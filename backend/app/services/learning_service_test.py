from backend.app.services.learning_service import process_student_answer


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

    result = process_student_answer(
        performance,
        "Java",
        concept,
        student_answer,
        correct_answer,
        current_difficulty
    )

    current_difficulty = result["next_difficulty"]

    print("Correct:", result["result"]["is_correct"])
    print("Mastery:", result["result"]["mastery"])
    print("ML:", result["result"]["ml_prediction"])
    print("Weak Concepts:", result["weak_concepts"])
    print("Next Difficulty:", result["next_difficulty_text"])
    print("Revision:", result["revision"])

    if result["next_question"]:
        print("Targeted Question:")
        print(result["next_question"]["question"])

    print("-" * 50)