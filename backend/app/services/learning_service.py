from backend.app.services.adaptive.adaptive_session import run_adaptive_step


def process_student_answer(
    performance,
    topic,
    concept,
    student_answer,
    correct_answer,
    current_difficulty
):

    result = run_adaptive_step(
        performance,
        topic,
        concept,
        student_answer,
        correct_answer,
        current_difficulty
    )

    return result