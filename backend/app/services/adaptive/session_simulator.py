from backend.app.services.adaptive.learning_intelligence import process_learning_step


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

    result = process_learning_step(
        performance,
        concept,
        student_answer,
        correct_answer,
        current_difficulty
    )

    current_difficulty = result["next_difficulty"]

    print("Correct:", result["is_correct"])
    print("Mastery:", result["mastery"])
    print("Recent accuracy:", result["recent_accuracy"])
    print("Status:", result["profile"][concept]["status"])
    print("Next difficulty:", result["next_difficulty"])
    print()