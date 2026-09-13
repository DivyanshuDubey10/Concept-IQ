from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.topic import Topic, Concept
from backend.app.models.mastery import UserConceptMastery
from backend.app.models.quiz import QuizSession
from backend.app.core.security import get_current_user
from backend.app.schemas.progress import (
    ProgressResponse,
    ProgressTopicOut,
    ProgressConceptOut,
    ProgressHistoryItem,
)

router = APIRouter(prefix="/api/progress", tags=["Progress"])


@router.get("", response_model=ProgressResponse)
def get_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the current mastery snapshot for all concepts, grouped by topic."""
    topics = db.query(Topic).all()
    result = []

    for topic in topics:
        concepts = db.query(Concept).filter(Concept.topic_id == topic.id).all()
        concept_out_list = []

        for concept in concepts:
            mastery_row = (
                db.query(UserConceptMastery)
                .filter(
                    UserConceptMastery.user_id == current_user.id,
                    UserConceptMastery.concept_id == concept.id,
                )
                .first()
            )
            mastery_pct = round(mastery_row.mastery_percentage, 1) if mastery_row else 0.0
            concept_out_list.append(
                ProgressConceptOut(name=concept.name, mastery=mastery_pct)
            )

        if concept_out_list:
            result.append(ProgressTopicOut(topic_name=topic.name, concepts=concept_out_list))

    return ProgressResponse(topics=result)


@router.get("/history", response_model=list[ProgressHistoryItem])
def get_progress_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return time-series mastery history derived from quiz session logs.
    Each entry represents one answered question with its concept and correctness.
    """
    # Join quiz_sessions → quizzes (filter by user) → concepts
    from backend.app.models.quiz import Quiz
    sessions = (
        db.query(QuizSession, Concept)
        .join(Quiz, QuizSession.quiz_id == Quiz.id)
        .join(Concept, QuizSession.concept_id == Concept.id)
        .filter(Quiz.user_id == current_user.id)
        .order_by(QuizSession.answered_at.asc())
        .all()
    )

    history = []
    for session, concept in sessions:
        history.append(
            ProgressHistoryItem(
                date=session.answered_at.date().isoformat(),
                concept_id=concept.id,
                concept_name=concept.name,
                mastery=100.0 if session.is_correct else 0.0,
                is_correct=session.is_correct,
            )
        )
    return history
