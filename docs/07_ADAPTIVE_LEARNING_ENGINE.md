# 07. Adaptive Learning Engine

This document details the logic powering the Adaptive Learning Engine (owned by Developer 2). This engine is responsible for selecting the right question at the right difficulty level based on the student's real-time performance to maintain engagement and optimize learning.

## 1. Engine Objective

The primary goal of the Adaptive Engine is to keep the student in the "Zone of Proximal Development"—the sweet spot where questions are neither too easy (causing boredom) nor too hard (causing frustration). 

## 2. Question Difficulty Scale

Questions in the database are categorized into three discrete difficulty levels:

| Level | Integer Value | Description |
| :--- | :---: | :--- |
| **Easy** | `1` | Tests basic recall and fundamental recognition of the concept. |
| **Medium** | `2` | Requires application of the concept in a straightforward scenario. |
| **Hard** | `3` | Involves complex application, edge cases, or synthesis with other concepts. |

## 3. The MVP Rule-Based Algorithm

For the hackathon MVP, the engine uses a deterministic, rule-based state machine. This guarantees reliable, predictable behavior during the 2-minute demo.

The state machine evaluates the student's answer to the *current* question to determine the difficulty of the *next* question.

### 3.1. Difficulty Transition Matrix

| Current Difficulty | Answer Result | Next Difficulty | Action Taken |
| :--- | :--- | :--- | :--- |
| 1 (Easy) | Correct | 2 (Medium) | Promote |
| 2 (Medium) | Correct | 3 (Hard) | Promote |
| 3 (Hard) | Correct | 3 (Hard) | Maintain (Max Level Reached) |
| 3 (Hard) | Wrong | 2 (Medium) | Demote |
| 2 (Medium) | Wrong | 1 (Easy) | Demote |
| 1 (Easy) | Wrong | 1 (Easy) | Maintain (Min Level Reached) |

### 3.2. Next Question Selection Logic

When a student submits an answer, the Adaptive Engine executes the following sequence to fetch the next question:

1.  **Identify Weakest Concept:** The engine queries the `user_concept_mastery` table to find the concept (within the current topic) with the lowest current mastery score.
2.  **Determine Target Difficulty:** The engine applies the Transition Matrix (Table 3.1) based on the immediate past answer.
3.  **Fetch Question:** The engine queries the `questions` table for an unanswered question where `concept_id = [Weakest Concept]` AND `difficulty = [Target Difficulty]`.
4.  **Fallback Mechanism (Question Exhaustion):** 
    *   Select the target difficulty.
    *   If unavailable, try an adjacent difficulty.
    *   If no suitable questions remain for the concept at any difficulty, the engine gracefully ends the targeted practice session.
    *   It returns a payload with enough state (e.g., `is_completed: true`) for the frontend to show a "Practice Complete" or equivalent progress message.
    *   The engine explicitly handles this as a valid completion state, not a server error (HTTP 500).

## 4. Future Scope: ML-Driven Adaptation

While the MVP relies on rules, the architecture allows for a seamless swap to an ML-driven adaptive engine using `scikit-learn` (e.g., Logistic Regression or Random Forest). 

Instead of relying solely on the *immediate past answer*, a future model would utilize a richer feature vector to predict the optimal next question difficulty.

**Planned Feature Vector for Future ML Model:**
*   `current_mastery_percentage`
*   `total_attempts_on_concept`
*   `recent_accuracy_window` (e.g., % correct over the last 5 attempts)
*   `consecutive_correct_answers`
*   `consecutive_incorrect_answers`
*   `time_since_last_revision`
*   `performance_trend_slope`

*Note: This ML integration is an experimental enhancement. The core narrative and demo rely on the robust rule-based algorithm defined in Section 3.*
