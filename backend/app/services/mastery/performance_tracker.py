def update_performance(performance, concept, is_correct):

    if concept not in performance:
        performance[concept] = {
            "attempts": 0,
            "correct": 0,
            "history": []
        }

    performance[concept]["attempts"] += 1

    if is_correct:
        performance[concept]["correct"] += 1

    performance[concept]["history"].append(is_correct)

    return performance