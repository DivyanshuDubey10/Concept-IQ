"""
Quiz router — orchestrates the core adaptive learning loop.

Flow for POST /api/quizzes/{quiz_id}/submit:
  1. Load Quiz (verify owner)
  2. Identify current question from Quiz.state
  3. Evaluate correctness
  4. Call intelligence layer (learning_service.process_student_answer)
  5. Upsert UserConceptMastery with new mastery score
  6. Set next_revision_date from spaced revision schedule
  7. Log QuizSession row
  8. Store updated state (performance + next question) back to Quiz
  9. Return full SubmitAnswerResponse
"""
from datetime import datetime, timezone, date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.topic import Topic, Concept
from backend.app.models.question import Question
from backend.app.models.quiz import Quiz, QuizSession
from backend.app.models.mastery import UserConceptMastery
from backend.app.core.security import get_current_user
from backend.app.schemas.quiz import (
    QuizStartRequest,
    QuizStartResponse,
    QuizStatusResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    QuizQuestion,
    QuizOption,
    ConceptTested,
)
from backend.app.services.learning_service import process_student_answer

router = APIRouter(prefix="/api/quizzes", tags=["Quizzes"])

# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #

OPTION_LETTER_TO_ID = {"A": 1, "B": 2, "C": 3, "D": 4}
OPTION_ID_TO_LETTER = {v: k for k, v in OPTION_LETTER_TO_ID.items()}


def _ai_options_to_list(options_dict: dict) -> list[QuizOption]:
    """Convert AI-generated {"A": "...", "B": "..."} to [{id:1, text:...}]."""
    return [
        QuizOption(id=OPTION_LETTER_TO_ID[k], text=v)
        for k, v in sorted(options_dict.items())
        if k in OPTION_LETTER_TO_ID
    ]


def _db_question_to_schema(q: Question, qid: int) -> QuizQuestion:
    """Convert a DB Question row to the QuizQuestion schema."""
    return QuizQuestion(
        question_id=qid,
        difficulty=q.difficulty,
        text=q.content,
        options=[QuizOption(id=opt["id"], text=opt["text"]) for opt in q.options],
    )


def _state_question_to_schema(state: dict) -> QuizQuestion:
    """Re-build a QuizQuestion from the persisted state dict."""
    cq = state["current_question"]
    return QuizQuestion(
        question_id=cq["id"],
        difficulty=cq["difficulty"],
        text=cq["text"],
        options=[QuizOption(id=o["id"], text=o["text"]) for o in cq["options"]],
    )


def _get_first_db_question(db: Session, concept_id: int, difficulty: int = 2) -> Question | None:
    """Fetch a seed question for quiz start; fallback to adjacent difficulties."""
    for diff in [difficulty, difficulty - 1, difficulty + 1]:
        q = (
            db.query(Question)
            .filter(Question.concept_id == concept_id, Question.difficulty == diff)
            .first()
        )
        if q:
            return q
    return None


def _upsert_mastery(
    db: Session, user_id: int, concept_id: int, new_mastery: float, revision_date_str: str
):
    """Create or update the mastery row for this user/concept."""
    mastery_row = (
        db.query(UserConceptMastery)
        .filter(
            UserConceptMastery.user_id == user_id,
            UserConceptMastery.concept_id == concept_id,
        )
        .first()
    )
    next_rev = date.fromisoformat(revision_date_str)
    if mastery_row:
        mastery_row.mastery_percentage = new_mastery
        mastery_row.next_revision_date = next_rev
        mastery_row.updated_at = datetime.now(timezone.utc)
    else:
        mastery_row = UserConceptMastery(
            user_id=user_id,
            concept_id=concept_id,
            mastery_percentage=new_mastery,
            next_revision_date=next_rev,
            updated_at=datetime.now(timezone.utc),
        )
        db.add(mastery_row)
    return mastery_row


# --------------------------------------------------------------------------- #
# POST /api/quizzes/start
# --------------------------------------------------------------------------- #

@router.post("/start", response_model=QuizStartResponse, status_code=status.HTTP_201_CREATED)
def start_quiz(
    payload: QuizStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Initialize a new quiz session for a topic.
    Optionally accepts a concept_id to target a specific concept (for revision).
    """
    topic = db.query(Topic).filter(Topic.id == payload.topic_id).first()
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found.")

    # Determine starting concept
    if payload.concept_id:
        concept = db.query(Concept).filter(
            Concept.id == payload.concept_id,
            Concept.topic_id == payload.topic_id,
        ).first()
        if not concept:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Concept not found in this topic.",
            )
    else:
        concept = (
            db.query(Concept).filter(Concept.topic_id == payload.topic_id).first()
        )
        if not concept:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No concepts found for this topic.",
            )

    # Get first question from seed DB (Medium difficulty)
    first_q = _get_first_db_question(db, concept.id, difficulty=2)
    if not first_q:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No questions available for this topic. Please run seed data.",
        )

    # Build initial quiz state
    initial_state = {
        "topic_name": topic.name,
        "current_question": {
            "id": 1,
            "db_question_id": first_q.id,
            "concept_id": concept.id,
            "concept_name": concept.name,
            "difficulty": first_q.difficulty,
            "text": first_q.content,
            "options": first_q.options,
            "correct_option_id": first_q.correct_option_id,
        },
        "performance": {},
        "question_counter": 1,
    }

    quiz = Quiz(
        user_id=current_user.id,
        topic_id=payload.topic_id,
        state=initial_state,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    return QuizStartResponse(
        quiz_id=quiz.id,
        first_question=_db_question_to_schema(first_q, qid=1),
    )


# --------------------------------------------------------------------------- #
# GET /api/quizzes/{quiz_id}
# --------------------------------------------------------------------------- #

@router.get("/{quiz_id}", response_model=QuizStatusResponse)
def get_quiz_status(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the current quiz session status and the pending question."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.user_id == current_user.id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found.")

    if quiz.completed_at:
        return QuizStatusResponse(status="completed")

    return QuizStatusResponse(
        status="in_progress",
        current_question=_state_question_to_schema(quiz.state),
    )


# --------------------------------------------------------------------------- #
# POST /api/quizzes/{quiz_id}/submit
# --------------------------------------------------------------------------- #

@router.post("/{quiz_id}/submit", response_model=SubmitAnswerResponse)
def submit_answer(
    quiz_id: int,
    payload: SubmitAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Submit an answer. Triggers:
      - Mastery update
      - AI explanation generation
      - Adaptive difficulty + next question selection
    """
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.user_id == current_user.id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found.")
    if quiz.completed_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Quiz is already completed.")

    state = quiz.state
    cq = state["current_question"]

    # Validate question_id matches current question
    if payload.question_id != cq["id"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="question_id does not match the current question.",
        )

    correct_option_id = cq["correct_option_id"]
    is_correct = payload.selected_option_id == correct_option_id
    concept_id = cq["concept_id"]
    concept_name = cq["concept_name"]
    current_difficulty = cq["difficulty"]

    # Resolve the student's chosen option text and correct option text
    options_map = {o["id"]: o["text"] for o in cq["options"]}
    student_answer_text = options_map.get(payload.selected_option_id, "Unknown")
    correct_answer_text = options_map.get(correct_option_id, "Unknown")

    # Call the intelligence layer
    performance = state.get("performance", {})
    try:
        result = process_student_answer(
            performance=performance,
            topic=state["topic_name"],
            concept=concept_name,
            question_text=cq["text"],
            student_answer=student_answer_text,
            correct_answer=correct_answer_text,
            current_difficulty=current_difficulty,
        )
        client_response = result["client_response"]
        server_state = result["server_state"]
        new_mastery = server_state["new_mastery"]
        revision_date_str = server_state["revision_scheduled"]["revision_date"]
        ai_explanation = client_response.get("explanation", "")
        updated_performance = performance  # updated in-place by intelligence layer
        next_question_data = client_response.get("next_question")
        next_difficulty = client_response.get("next_difficulty", current_difficulty)
    except Exception:
        # Graceful degradation: intelligence layer unavailable
        new_mastery = 50.0
        from datetime import timedelta
        revision_date_str = (datetime.now(timezone.utc) + timedelta(days=1)).date().isoformat()
        ai_explanation = (
            "Our AI tutor is temporarily unavailable. "
            "The correct answer has been highlighted above."
        )
        updated_performance = performance
        next_question_data = None
        next_difficulty = current_difficulty

    # Upsert mastery and revision schedule
    _upsert_mastery(db, current_user.id, concept_id, new_mastery, revision_date_str)

    # Log the session entry
    session_log = QuizSession(
        quiz_id=quiz.id,
        concept_id=concept_id,
        question_text=cq["text"],
        selected_option_id=payload.selected_option_id,
        is_correct=is_correct,
    )
    db.add(session_log)

    # Determine next question
    next_q_schema: QuizQuestion | None = None
    is_completed = False

    if next_question_data:
        # Use AI-generated next question
        q_counter = state.get("question_counter", 1) + 1
        next_opts = _ai_options_to_list(next_question_data["options"])
        correct_letter = server_state.get("next_question_correct_answer", "A")
        correct_opt_id = OPTION_LETTER_TO_ID.get(correct_letter, 1)

        # Find or use the first concept that matches weakest concept
        weak_concepts = client_response.get("weak_concepts", [])
        next_concept_name = weak_concepts[0] if weak_concepts else concept_name
        next_concept = (
            db.query(Concept)
            .filter(
                Concept.topic_id == quiz.topic_id,
                Concept.name == next_concept_name,
            )
            .first()
        ) or db.query(Concept).filter(Concept.id == concept_id).first()

        next_state_q = {
            "id": q_counter,
            "db_question_id": None,
            "concept_id": next_concept.id if next_concept else concept_id,
            "concept_name": next_concept_name,
            "difficulty": next_difficulty,
            "text": next_question_data["question"],
            "options": [{"id": o.id, "text": o.text} for o in next_opts],
            "correct_option_id": correct_opt_id,
        }
        next_q_schema = QuizQuestion(
            question_id=q_counter,
            difficulty=next_difficulty,
            text=next_question_data["question"],
            options=next_opts,
        )
        state["current_question"] = next_state_q
        state["question_counter"] = q_counter
    else:
        # Fall back to DB question
        next_concept_name = concept_name
        weak_concepts = client_response.get("weak_concepts", []) if "client_response" in dir() else []
        if weak_concepts:
            next_concept_name = weak_concepts[0]

        next_concept = (
            db.query(Concept)
            .filter(Concept.topic_id == quiz.topic_id, Concept.name == next_concept_name)
            .first()
        ) or db.query(Concept).filter(Concept.id == concept_id).first()

        db_next = _get_first_db_question(db, next_concept.id if next_concept else concept_id, next_difficulty)
        if db_next:
            q_counter = state.get("question_counter", 1) + 1
            state["current_question"] = {
                "id": q_counter,
                "db_question_id": db_next.id,
                "concept_id": next_concept.id if next_concept else concept_id,
                "concept_name": next_concept_name,
                "difficulty": db_next.difficulty,
                "text": db_next.content,
                "options": db_next.options,
                "correct_option_id": db_next.correct_option_id,
            }
            state["question_counter"] = q_counter
            next_q_schema = _db_question_to_schema(db_next, qid=q_counter)
        else:
            is_completed = True
            quiz.completed_at = datetime.now(timezone.utc)

    state["performance"] = updated_performance
    quiz.state = state

    # SQLAlchemy doesn't auto-detect mutations in JSON columns — force update
    from sqlalchemy.orm.attributes import flag_modified
    flag_modified(quiz, "state")

    db.commit()

    return SubmitAnswerResponse(
        is_completed=is_completed,
        is_correct=is_correct,
        correct_option_id=correct_option_id,
        concept_tested=ConceptTested(
            concept_id=concept_id,
            name=concept_name,
            new_mastery_percentage=round(new_mastery, 1),
        ),
        ai_explanation=ai_explanation,
        next_question=next_q_schema,
    )
