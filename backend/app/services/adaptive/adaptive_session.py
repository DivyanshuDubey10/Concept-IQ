from backend.app.services.adaptive.learning_intelligence import process_learning_step
from backend.app.services.adaptive.difficulty import difficulty_to_text
from backend.app.services.adaptive.targeted_practice import generate_targeted_question
from backend.app.services.mastery.weak_concept_detector import find_weak_concepts
from backend.app.services.mastery.spaced_revision import schedule_revision

def run_adaptive_step(
    performance,
    topic,
    concept,
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
        mastery_data[concept_name] = (
            data["correct"] / data["attempts"]
        ) * 100

    weak_concepts = find_weak_concepts(mastery_data)

    # 3. Convert difficulty number to text
    next_difficulty = result["next_difficulty"]
    difficulty_text = difficulty_to_text(next_difficulty)
    revision = schedule_revision(result["mastery"])

    # 4. Generate a question targeting the weak concept
    next_question = None

    if weak_concepts:
        weakest_concept = weak_concepts[0]

        next_question = generate_targeted_question(
            topic,
            weakest_concept,
            mastery_data[weakest_concept],
            difficulty_text
        )

    return {
        "result": result,
        "weak_concepts": weak_concepts,
        "next_difficulty": next_difficulty,
        "next_difficulty_text": difficulty_text,
        "next_question": next_question,
        "revision": revision
    }