from backend.app.services.ai.answer_evaluator import evaluate_answer
from backend.app.services.mastery.mastery_calculator import calculate_mastery
from backend.app.services.adaptive.adaptive_engine import get_progress


def process_answer(student_answer, correct_answer, correct_answers, total_answers, current_difficulty):

    is_correct = evaluate_answer(student_answer, correct_answer)

    if is_correct:
        correct_answers += 1

    total_answers += 1

    accuracy = (correct_answers / total_answers) * 100

    mastery = calculate_mastery(correct_answers, total_answers)

    next_difficulty = get_progress(
        current_difficulty,
        accuracy
    )

    return {
        "is_correct": is_correct,
        "accuracy": accuracy,
        "mastery": mastery,
        "next_difficulty": next_difficulty,
        "correct_answers": correct_answers,
        "total_answers": total_answers
    }