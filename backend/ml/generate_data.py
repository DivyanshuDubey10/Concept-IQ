import random
import pandas as pd


random.seed(42)

data = []

for _ in range(1000):

    attempts = random.randint(3, 20)
    difficulty = random.randint(1, 3)

    accuracy = random.uniform(10, 100)

    recent_accuracy = accuracy + random.uniform(-20, 20)
    recent_accuracy = max(0, min(100, recent_accuracy))

    correct_answers = round(attempts * accuracy / 100)

    # Overall learning score
    mastery_score = (
        accuracy * 0.55
        + recent_accuracy * 0.45
    )

    # Difficulty affects how confident we are in mastery
    if difficulty == 3:
        mastery_score -= 5
    elif difficulty == 1:
        mastery_score += 5

    # Add natural variation
    mastery_score += random.uniform(-10, 10)

    mastered = 1 if mastery_score >= 70 else 0

    data.append([
        attempts,
        round(accuracy, 2),
        round(recent_accuracy, 2),
        difficulty,
        correct_answers,
        mastered
    ])


df = pd.DataFrame(
    data,
    columns=[
        "attempts",
        "accuracy",
        "recent_accuracy",
        "difficulty",
        "correct_answers",
        "mastered"
    ]
)

df.to_csv(
    "backend/ml/data/mastery_data.csv",
    index=False
)

print("Synthetic dataset generated successfully!")
print("Rows:", len(df))

print("\nClass distribution:")
print(df["mastered"].value_counts())

print("\nFirst 10 rows:")
print(df.head(10))