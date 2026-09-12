from backend.app.services.mastery.concept_mastery import get_concept_mastery


def create_learning_profile(performance):

    mastery = get_concept_mastery(performance)

    profile = {}

    for concept, score in mastery.items():

        attempts = performance[concept]["attempts"]

        if attempts < 3:
            status = "Insufficient Data"

        elif score <= 40:
            status = "Weak"

        elif score >= 80:
            status = "Mastered"

        else:
            status = "Developing"

        profile[concept] = {
            "mastery": score,
            "status": status
        }

    return profile
