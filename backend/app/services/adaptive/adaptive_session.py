from backend.app.services.adaptive.learning_intelligence import process_learning_step
from backend.app.services.adaptive.difficulty import difficulty_to_text
from backend.app.services.adaptive.targeted_practice import generate_targeted_question
from backend.app.services.mastery.weak_concept_detector import find_weak_concepts
from backend.app.services.mastery.spaced_revision import schedule_revision
from backend.app.services.ai.explanation_generator import generate_explanation

def run_adaptive_step(
    performance,
    topic,
    concept,
    question_text,
    student_answer,
    correct_answer,
    current_difficulty
):
    # 1. Process the student's answer
    result = process_learning_step(
        performance,
        concept,
        student_answer,
        correct_answer,
        current_difficulty
    )

    # 2. Find weak concepts
    mastery_data = {}
    for concept_name, data in performance.items():
        mastery_data[concept_name] = (data["correct"] / data["attempts"]) * 100

    weak_concepts = find_weak_concepts(mastery_data)

    # 3. Convert difficulty number to text
    next_difficulty = result["next_difficulty"]
    difficulty_text = difficulty_to_text(next_difficulty)
    mastery = result["mastery"]
    revision = schedule_revision(mastery)

    # 4. Generate explanation for the question they just answered
    explanation = generate_explanation(
        topic=topic,
        concept=concept,
        question=question_text,
        student_answer=student_answer,
        correct_answer=correct_answer,
        mastery=mastery
    )

    # 5. Generate a question targeting the weak concept
    next_question = None
    if weak_concepts:
        weakest_concept = weak_concepts[0]
        next_question = generate_targeted_question(
            topic,
            weakest_concept,
            mastery_data[weakest_concept],
            difficulty_text
        )

    # 6. Format the API contract response
    client_response = {
        "explanation": explanation,
        "weak_concepts": weak_concepts,
        "next_difficulty": next_difficulty,
    }
    
    server_state = {
        "new_mastery": mastery,
        "revision_scheduled": revision
    }

    if next_question:
        client_response["next_question"] = {
            "question": next_question["question"],
            "options": next_question["options"]
        }
        server_state["next_question_correct_answer"] = next_question["correct_answer"]
        server_state["next_question_explanation"] = next_question["explanation"]

    return {
        "client_response": client_response,
        "server_state": server_state
    }