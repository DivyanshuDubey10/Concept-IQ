import pandas as pd
import joblib


MODEL_PATH = "backend/ml/mastery_model.pkl"


def predict_mastery(
    attempts,
    accuracy,
    recent_accuracy,
    difficulty,
    correct_answers
):

    model = joblib.load(MODEL_PATH)

    student = pd.DataFrame([
        [
            attempts,
            accuracy,
            recent_accuracy,
            difficulty,
            correct_answers
        ]
    ], columns=[
        "attempts",
        "accuracy",
        "recent_accuracy",
        "difficulty",
        "correct_answers"
    ])

    prediction = model.predict(student)[0]
    probability = model.predict_proba(student)[0][1]

    if prediction == 1:
        result = "Likely Mastered"
    else:
        result = "Needs More Practice"

    return {
        "prediction": result,
        "probability": float(probability)
    }