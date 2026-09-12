def find_weak_concepts(concept_accuracy):
    weak_concepts = []

    for concept, accuracy in concept_accuracy.items():
        if accuracy <= 40:
            weak_concepts.append(concept)

    return weak_concepts


