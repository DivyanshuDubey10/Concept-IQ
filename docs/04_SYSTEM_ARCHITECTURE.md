# 04. System Architecture

This document outlines the high-level architecture of ConceptIQ, illustrating the separation of concerns between the user interface, core API logic, the intelligence engines, and data storage.

## 1. High-Level Architecture Diagram

```mermaid
graph TD
    Client[Frontend Client<br/>React + Tailwind]
    
    subgraph Backend [FastAPI Backend Layer]
        API[API Router<br/>Endpoints]
        Auth[Auth Middleware<br/>JWT Validation]
        
        subgraph Core Services
            UM[User Service]
            TM[Topic Service]
            QM[Quiz Session Service]
        end
        
        subgraph Intelligence Services
            AE[Adaptive Engine<br/>Rule-Based Logic]
            MM[Mastery & Revision Manager]
            AIT[AI Tutor Service<br/>Prompt Engineering]
            MLE[ML Engine<br/>Experimental]
        end
        
        DB[(Relational Database<br/>SQLite)]
    end
    
    LLM[External LLM API]
    
    Client <-->|REST over HTTP| API
    API --> Auth
    Auth --> Core Services
    Core Services <--> Intelligence Services
    Core Services <--> DB
    Intelligence Services <--> DB
    AIT <-->|API Calls| LLM
```

## 2. Component Architecture

### 2.1. Client Layer (Frontend)
A responsive Single Page Application (SPA) designed to facilitate a seamless learning experience without page reloads during the critical quiz loop.
*   **Stack:** React.js, Tailwind CSS.
*   **Responsibilities:** State management (session data, current question, mastery scores), API communication, rendering AI chat interfaces, and displaying progress dashboards.

### 2.2. API / Application Layer (Backend)
The core backend application is built for speed and asynchronous request handling.
*   **Stack:** Python, FastAPI.
*   **Responsibilities:** 
    *   Exposing clean REST endpoints (owned by Developer 1).
    *   Managing JWT authentication.
    *   Orchestrating data flow between the database and intelligence services.

### 2.3. Intelligence Layer
This decoupled layer (owned by Developer 2) contains the proprietary logic that makes ConceptIQ adaptive.
*   **Adaptive Engine (MVP):** Implements deterministic rules for difficulty adjustment (e.g., Hard + Wrong -> Medium). It selects the next question by querying the database for questions linked to the student's lowest-mastery concept at the newly calculated difficulty level.
*   **Mastery & Revision Manager:** Calculates concept-level percentages based on recent answers and populates the revision schedule (Today, Tomorrow, 3 days, 7 days) based on performance thresholds.
*   **AI Tutor Service:** Responsible for context-aware prompt engineering. It injects the specific failed concept, the student's incorrect answer, and their current mastery level into a prompt to generate a highly targeted explanation from the LLM.
*   **ML Engine (Experimental):** A distinct module using `scikit-learn` to process historical session data and train models (Logistic Regression, Random Forest) for future predictive mastery and advanced difficulty tuning.

### 2.4. Data Layer
A relational database ensuring data integrity for structured learning content and user progress.
*   **Stack:** SQLite (Selected for zero-configuration hackathon MVP deployment).
*   **Responsibilities:** Persisting `users`, `topics` (and their child `concepts`), `questions`, `quiz_sessions`, and granular mastery tracking.

## 3. System Data Flow: The Adaptive Loop

To understand how the components interact, consider the data flow when a student submits an incorrect answer:

1.  **Request:** React client POSTs the answer to `/api/quizzes/{quiz_id}/submit`.
2.  **Processing:** FastAPI routes the request to the Quiz Session Service, which verifies the answer is wrong.
3.  **Mastery Update:** The Mastery Manager is invoked to decrease the mastery score for that specific concept (e.g., "Base Cases") and updates the DB.
4.  **AI Intervention:** The AI Tutor Service generates a prompt detailing the error regarding "Base Cases" and requests an explanation from the External LLM API.
5.  **Adaptation:** The Adaptive Engine applies the rule-based logic to drop the difficulty and selects the next practice question targeting "Base Cases" from the DB.
6.  **Response:** The API returns a payload to the React client containing: the wrong status, the AI explanation, the newly updated mastery percentage, and the next question payload.
