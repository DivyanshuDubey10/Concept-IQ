def select_question(questions, weak_concepts, current_difficulty):

    for question in questions:
        if (
            question["concept"] in weak_concepts
            and question["difficulty"] == current_difficulty
        ):
            return question

    return None
