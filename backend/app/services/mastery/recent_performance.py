def calculate_recent_accuracy(history, recent_questions=5):

    if len(history) == 0:
        return 0

    recent_answers = history[-recent_questions:]

    correct = 0

    for answer in recent_answers:
        if answer:
            correct += 1

    return (correct / len(recent_answers)) * 100