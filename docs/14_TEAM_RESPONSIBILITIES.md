# 14. Team Responsibilities

This document defines the strict division of labor for the ConceptIQ 2-person hackathon team. Responsibilities are divided cleanly along architectural lines to prevent merge conflicts, minimize blocking dependencies, and ensure high parallel development velocity.

## Developer 1: Frontend & Application API Layer

Developer 1 owns the entire user-facing experience and the core backend plumbing that serves data to the client.

### 1. Frontend Execution (React.js + Tailwind CSS)
*   **Core Views:** Developing the Login, Signup, Home/Dashboard, and Topic Selection pages.
*   **Quiz UI:** Building the responsive Question Display, Option selection logic, and Answer Submission interaction.
*   **Visualizing Intelligence:** Implementing the UI components that render Developer 2's data (e.g., the AI Tutor chat bubbles, granular Mastery Progress bars, and the Revision Queue list).
*   **UX Polish:** Ensuring mobile responsiveness, implementing loading skeletons, handling error states gracefully, and maintaining basic accessibility standards.

### 2. Application Backend (Python + FastAPI)
*   **Infrastructure:** Structuring the FastAPI app and managing database connections (PostgreSQL).
*   **Authentication:** Implementing the JWT generation, hashing, and route protection middleware.
*   **API Endpoints:** Developing and maintaining all RESTful routes defined in the API Specification (`/api/auth`, `/api/users`, `/api/topics`, `/api/quizzes`, `/api/progress`, `/api/revision`).
*   **Integration:** Invoking Developer 2's Intelligence modules from within the route controllers (specifically during the `/api/quizzes/{quiz_id}/submit` workflow).

---

## Developer 2: Learning Intelligence & AI/ML

Developer 2 owns the proprietary "brain" of ConceptIQ. They are completely decoupled from frontend concerns, focusing strictly on the logic that makes the platform adaptive.

### 1. AI System & Prompt Engineering
*   **LLM Orchestration:** Managing API calls to the external Large Language Model.
*   **Dynamic Prompting:** Designing the context-aware prompt templates that inject the specific failed concept, the student's wrong answer, and their current mastery level to generate highly personalized explanations.

### 2. Adaptive Learning Engine
*   **Rule-Based Adaptation:** Implementing the state machine that dictates difficulty changes (e.g., Hard + Wrong -> Medium).
*   **Weak Concept Detection:** Algorithms to parse session data and pinpoint the exact failing concept.
*   **Dynamic Question Selection:** Writing the logic to fetch the optimal next question targeting the student's weakest area at the newly calculated difficulty.

### 3. Mastery & Revision Algorithms
*   **Mastery Calculation:** Implementing the math (weighted moving average) to update granular concept-level percentages after every answer.
*   **Spaced Repetition:** Implementing the logic that calculates and sets the `next_revision_date` (Today, Tomorrow, +3 Days, +7 Days).

### 4. Machine Learning Track (Experimental)
*   **Predictive Modeling:** Using `scikit-learn` to build Logistic Regression or Random Forest models to predict future mastery based on attempt history and time decay.
*   **ML Integration:** Prototyping the replacement of the rule-based MVP engines with the trained predictive models.

---

## Shared Backend Responsibility: Database & ORM

The PostgreSQL database schema and ORM implementation is a coordinated responsibility between both developers, sitting at the intersection of application state and learning intelligence.

*   **Developer 1** manages the database connection lifecycle within the FastAPI app and handles standard CRUD data persistence (users, profile, topics).
*   **Developer 2** defines the schema requirements for complex analytical data (mastery tracking, quiz sessions) and authors the complex read queries necessary for the adaptive engine.
*   **Coordination:** Both developers actively collaborate on the final physical schema design to ensure it supports both rapid API responses and complex intelligence queries without conflicts.
