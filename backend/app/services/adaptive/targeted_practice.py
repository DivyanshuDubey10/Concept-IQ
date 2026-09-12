from backend.app.services.ai.question_generator import generate_question


def generate_targeted_question(
    topic,
    concept,
    mastery,
    difficulty
):

    generated = generate_question(
        topic,
        concept,
        difficulty
    )

    return {
        "concept": concept,
        "mastery": mastery,
        "difficulty": difficulty,
        "question": generated["question"],
        "options": generated["options"]
    }