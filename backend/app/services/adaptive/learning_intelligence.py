from backend.app.services.ai.answer_evaluator import evaluate_answer
from backend.app.services.mastery.performance_tracker import update_performance
from backend.app.services.mastery.concept_mastery import get_concept_mastery
from backend.app.services.mastery.learning_profile import create_learning_profile
from backend.app.services.mastery.recent_performance import calculate_recent_accuracy
from backend.app.services.adaptive.adaptive_engine import get_next_difficulty
from backend.app.services.ml.mastery_predictor import predict_mastery


def process_learning_step(
    performance,
    concept,
    student_answer,
    correct_answer,
    current_difficulty
):

    is_correct = evaluate_answer(
        student_answer,
        correct_answer
    )

    performance = update_performance(
        performance,
        concept,
        is_correct
    )

    mastery = get_concept_mastery(performance)

    profile = create_learning_profile(performance)

    concept_mastery = mastery[concept]

    history = performance[concept]["history"]

    recent_accuracy = calculate_recent_accuracy(history)

    # ML mastery prediction
    attempts = performance[concept]["attempts"]
    correct_answers = performance[concept]["correct"]

    ml_prediction = predict_mastery(
        attempts,
        concept_mastery,
        recent_accuracy,
        current_difficulty,
        correct_answers
    )

    next_difficulty = get_next_difficulty(
        current_difficulty,
        concept_mastery,
        recent_accuracy,
        ml_prediction["probability"],
        attempts
    )
    return {
        "is_correct": is_correct,
        "concept": concept,
        "mastery": concept_mastery,
        "recent_accuracy": recent_accuracy,
        "profile": profile,
        "next_difficulty": next_difficulty,
        "ml_prediction": ml_prediction
    }