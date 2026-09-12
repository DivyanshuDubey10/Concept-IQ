def get_next_difficulty(
    current_difficulty,
    mastery,
    recent_accuracy,
    ml_probability,
    attempts
):

    if mastery <= 40 or recent_accuracy <= 40:
        return max(current_difficulty - 1, 1)

    elif (
        attempts >= 3
        and mastery >= 80
        and recent_accuracy >= 80
        and ml_probability >= 0.80
    ):
        return min(current_difficulty + 1, 3)

    else:
        return current_difficulty