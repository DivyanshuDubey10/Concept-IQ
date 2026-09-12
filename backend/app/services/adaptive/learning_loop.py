from backend.app.services.adaptive.adaptive_engine import get_progress
from backend.app.services.mastery.mastery_calculator import calculate_mastery


answers = [True, True, False, True, True]

current_difficulty = 2
correct_answers = 0

for question_number, answer in enumerate(answers, start=1):

    if answer:
        correct_answers += 1

    total_answers = question_number

    accuracy = (correct_answers / total_answers) * 100

    mastery = calculate_mastery(correct_answers, total_answers)

    current_difficulty = get_progress(
        current_difficulty,
        accuracy
    )

    print("Question:", question_number)
    print("Accuracy:", accuracy)
    print("Mastery:", mastery)
    print("Next difficulty:", current_difficulty)
    print()