from backend.app.services.adaptive.adaptive_session import run_adaptive_step

def process_student_answer(
    performance,
    topic,
    concept,
    question_text,
    student_answer,
    correct_answer,
    current_difficulty
):
    """
    Main entry point for processing a student's answer.
    Returns a dictionary separated into 'client_response' (safe for frontend)
    and 'server_state' (for database updates).
    """
    return run_adaptive_step(
        performance,
        topic,
        concept,
        question_text,
        student_answer,
        correct_answer,
        current_difficulty
    )