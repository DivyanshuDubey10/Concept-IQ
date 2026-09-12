from backend.app.services.adaptive.adaptive_session import run_adaptive_step


performance = {}

current_difficulty = 2

answers = [
    ("Inheritance", "A", "A"),
    ("Inheritance", "B", "A"),
    ("Inheritance", "B", "A"),
    ("Inheritance", "A", "A"),
    ("Inheritance", "A", "A")
]

for concept, student_answer, correct_answer in answers:

    result = run_adaptive_step(
        performance,
        "Java",
        concept,
        student_answer,
        correct_answer,
        current_difficulty
    )

    current_difficulty = (
        result["result"]["next_difficulty"]
    )

    print("Correct:", result["result"]["is_correct"])
    print("Mastery:", result["result"]["mastery"])
    print("ML Prediction:", result["result"]["ml_prediction"])
    print("Recent Accuracy:", result["result"]["recent_accuracy"])
    print("Weak Concepts:", result["weak_concepts"])
    print("Next Difficulty:", result["next_difficulty_text"])
    print("Revision:", result["revision"])

    if result["next_question"]:
        print("Targeted Question:")
        print(result["next_question"]["question"])

        print("Options:")
        print(result["next_question"]["options"])

    print("-" * 50)