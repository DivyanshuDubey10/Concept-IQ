def calculate_mastery(correct_answers, total_answers):
    if total_answers == 0:
        return 0
    mastery = (correct_answers / total_answers) * 100
    return mastery
