# 09. Mastery Tracking and Revision Scheduling

This document details how ConceptIQ measures student understanding and ensures long-term retention through intelligently scheduled spaced revision.

## 1. Granular Mastery Tracking

The fundamental flaw in traditional quizzes is providing a single, monolithic score (e.g., "70% in Java OOP"). ConceptIQ discards this in favor of **concept-level mastery tracking**.

### 1.1. The Concept Score

Every concept in the database has an associated `mastery_percentage` (0 to 100) for every user. 

**Example Dashboard View:**
When a student looks at their "Java OOP" dashboard, they don't see a single generic score. They see actionable, granular metrics:
*   Inheritance: 82%
*   Polymorphism: 61%
*   **Method Overriding: 38%** *(Flagged as Weak)*
*   Encapsulation: 89%

### 1.2. MVP Mastery Calculation

For the hackathon MVP, the mastery score is updated immediately after every question using a weighted moving average. This ensures recent performance impacts the score more heavily than older attempts.

When a question on Concept $C$ is answered:
1.  **Determine Attempt Value:** 
    *   Correct = 100
    *   Incorrect = 0
2.  **Calculate New Score:** 
    `New_Mastery = (Current_Mastery * 0.7) + (Attempt_Value * 0.3)`

*(Note: The weights 0.7/0.3 are tunable. If the student gets the question correct, the score trends up; if incorrect, it drops significantly, immediately triggering the Adaptive Engine to serve easier questions for this concept).*

## 2. Spaced Revision Scheduling

To combat the "forgetting curve," ConceptIQ implements an automated spaced revision schedule, ensuring concepts are practiced just as the student is likely to forget them.

### 2.1. The Revision Intervals (MVP)

The MVP utilizes a fixed interval schedule. While answering practice questions automatically updates the mastery score, a concept's revision schedule is only advanced when the student explicitly finishes a targeted revision activity (via `POST /api/revision/{concept_id}/complete`).

**Successful Revision Progression:**
1.  **Initial Practice:** Today
2.  **Interval 1:** Tomorrow (+1 Day)
3.  **Interval 2:** +3 Days
4.  **Interval 3:** +7 Days

**Failed Revision Penalty Logic:**
For this MVP project, if a student fails a concept during its scheduled revision, it moves back precisely one tier. This is a simplified project rule, not a scientifically validated spaced-repetition algorithm:
*   7 Days → 3 Days
*   3 Days → Tomorrow
*   Tomorrow → Today
*   Today → Today (Remains in the immediate queue)

### 2.2. Prioritization Logic

When a student visits the "Daily Revision" dashboard (`GET /api/revision/today`), the system fetches all concepts where `next_revision_date <= TODAY`.

Crucially, the UI does not present these concepts in a random order. They are sorted and prioritized by **Mastery Score (Ascending)**. 

Concepts that the student historically struggled with (e.g., Method Overriding at 38%) are placed at the very top of the daily revision queue. This ensures the student tackles their weakest and most vulnerable areas first, while their cognitive energy is highest.

## 3. Future Scope: ML-Driven Enhancements

In future iterations (Developer 2's experimental track), both the mastery calculation and the revision intervals will be managed by machine learning models.

*   **Predictive Mastery:** Instead of a simple weighted average, a scikit-learn model will predict the *actual probability* that the student will answer the next question correctly, factoring in the specific difficulty of the questions they've been attempting.
*   **Dynamic Intervals:** The revision intervals (1, 3, 7 days) will become dynamic. If a student consistently aces "Encapsulation" during revision, the model will push the next revision date much further out (e.g., +30 days) to optimize study time.
