# 03. Product Requirements

This document defines the functional and non-functional requirements for the ConceptIQ Minimum Viable Product (MVP). It clearly distinguishes the core hackathon deliverables from experimental features.

## 1. User Roles

*   **Student:** The primary user who selects topics, takes assessments, interacts with the AI tutor, and reviews progress.

## 2. Functional Requirements (MVP)

### 2.1. Authentication & Profile
| Req ID | Feature | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| AUTH-01 | Registration | Students can register using an email and password. | New user created in database; JWT token issued. |
| AUTH-02 | Login | Students can log in to existing accounts. | Valid credentials return a JWT; invalid credentials return a 401 error. |
| AUTH-03 | Profile Viewing | Students can view their basic profile details. | `/api/users/profile` returns correct user data. |

### 2.2. Topics & Concepts
| Req ID | Feature | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| TOPC-01 | Topic Browsing | Students can browse available high-level topics (e.g., Python). | UI successfully displays topics from `GET /api/topics`. |
| TOPC-02 | Concept Mapping | Topics are structured as a collection of granular concepts (e.g., Recursion -> Base Cases). | Database schema accurately reflects the Topic -> Concept hierarchy. |

### 2.3. The Adaptive Learning Loop
| Req ID | Feature | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| LOOP-01 | Diagnostic Quiz | Students take an initial quiz to establish baseline mastery across a topic's concepts. | Quiz session initialized; responses recorded; initial mastery scores generated. |
| LOOP-02 | Weak Concept Detection | System identifies the specific concept where the student is struggling most. | System accurately flags the concept with the lowest mastery score. |
| LOOP-03 | Personalized AI Explanation | AI provides an explanation specifically targeting the weak concept. | AI response explains *why* the concept works, not just what the answer is. |
| LOOP-04 | Targeted Practice | System serves follow-up questions specifically testing the identified weak concept. | Next question presented is mapped directly to the weak concept. |
| LOOP-05 | Rule-Based Difficulty Adjustment | Question difficulty (Easy=1, Medium=2, Hard=3) adapts based on immediate performance. | Follows MVP rules (e.g., Medium + Wrong = Easy; Easy + Correct = Medium). |

### 2.4. Mastery & Revision
| Req ID | Feature | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| MSTR-01 | Granular Mastery Tracking | The system tracks mastery as a percentage at the individual concept level. | Dashboard displays mastery breakdown (e.g., "Recursive Calls: 78%"). |
| MSTR-02 | Dynamic Mastery Updates | Mastery scores recalculate immediately after a practice attempt. | Concept mastery percentage updates in the database and UI upon answer submission. |
| REVS-01 | Spaced Revision | System schedules concepts for revision based on a fixed interval (Today -> Tomorrow -> 3 days -> 7 days). | `GET /api/revision/today` accurately returns concepts due based on the schedule. |

## 3. Experimental / Future Scope (Not MVP)

| Feature | Description | Status |
| :--- | :--- | :--- |
| ML Mastery Prediction | Using scikit-learn (Logistic Regression/Random Forest) to predict mastery based on attempt counts, time since revision, and trends. | Experimental / Future Scope |
| Complex ML Difficulty Adaptation | Adjusting difficulty based on historical consecutive correctness and overall performance trends rather than immediate rules. | Experimental / Future Scope |

## 4. Non-Functional Requirements

*   **Performance:** The core learning loop (Answer Submission -> Evaluation -> AI Explanation Generation -> Next Question Selection) must execute quickly enough to maintain student engagement (target < 3 seconds).
*   **Reliability:** The adaptive engine must behave deterministically for the hackathon demo.
*   **Usability:** The UI must clearly visualize the transition between taking a quiz, viewing an AI explanation, and tracking mastery.
