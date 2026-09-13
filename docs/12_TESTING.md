# 12. Testing & Quality Assurance

This document outlines the testing strategy for the ConceptIQ MVP. Given the constraints of a hackathon, testing is strictly prioritized around the core learning loop to ensure a flawless demonstration.

## 1. Testing Strategy

*   **Unit Testing (Backend):** Focused exclusively on the intelligence logic (Mastery calculation math, Adaptive state machine rules).
*   **Integration Testing:** Focused on API endpoints and their interaction with the PostgreSQL database.
*   **Manual End-to-End (E2E) Testing:** Validating the complete student user journey in the React frontend.

## 2. Core Functional Test Scenarios

These manual scenarios must pass before the final hackathon submission.

| Scenario ID | Component | Action | Expected Result |
| :--- | :--- | :--- | :--- |
| T-01 | Authentication | Register, login, and fetch profile. | JWT is issued; profile endpoint returns HTTP 200 with valid data. |
| T-02 | Quiz Initialization | Start a diagnostic quiz for "Python". | API returns `quiz_id` and the first question payload successfully. |
| T-03 | Answer (Correct) | Submit correct answer to a Medium question. | `is_correct: true`; Mastery score increases; Next question difficulty is Hard (3). |
| T-04 | Answer (Incorrect) | Submit wrong answer to a Hard question. | `is_correct: false`; AI Explanation is generated; Mastery score drops; Next question targets the failed concept at Medium (2) difficulty. |
| T-05 | Revision Queue | Load the Daily Revision dashboard. | API returns concepts sorted strictly by lowest mastery score where `next_revision_date <= TODAY`. |

## 3. Intelligence Engine Verification

Testing the deterministic logic of the backend engines.

### 3.1. Adaptive Rule Matrix Verification

| Initial Difficulty | Action | Expected Next Difficulty |
| :--- | :--- | :--- |
| 1 (Easy) | Correct Answer | 2 (Medium) |
| 2 (Medium) | Correct Answer | 3 (Hard) |
| 3 (Hard) | Correct Answer | 3 (Hard) |
| 3 (Hard) | Wrong Answer | 2 (Medium) |
| 2 (Medium) | Wrong Answer | 1 (Easy) |
| 1 (Easy) | Wrong Answer | 1 (Easy) |

### 3.2. Mastery Math Verification

*   **Given:** Current Concept Mastery = `50.0`
*   **Action:** Student answers correctly (Attempt Value = 100)
*   **Algorithm:** `(Current * 0.7) + (Attempt * 0.3)`
*   **Expected Result:** `(50.0 * 0.7) + (100 * 0.3) = 65.0`. Database updates to 65.0 exactly.

## 4. UI/UX Verification Checklist

*   [ ] **SPA Integrity:** Submitting an answer and loading the next question does not trigger a full browser page reload.
*   [ ] **Feedback Latency:** The submit button immediately displays a loading spinner to prevent double-submissions while waiting for the LLM response.
*   [ ] **Mobile Responsiveness:** The AI Tutor chat bubble renders correctly on mobile viewports without obscuring the "Next Question" CTA.
*   [ ] **Visual State Resets:** Clicking "Next Question" cleanly resets all visual states (clears the AI bubble, deselects previous options).
