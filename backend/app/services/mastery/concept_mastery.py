from backend.app.services.mastery.mastery_calculator import calculate_mastery


def get_concept_mastery(performance):

    mastery = {}

    for concept, data in performance.items():

        mastery[concept] = calculate_mastery(
            data["correct"],
            data["attempts"]
        )

    return mastery