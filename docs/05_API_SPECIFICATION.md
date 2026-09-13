# 05. API Specification

This document details the RESTful API endpoints for the ConceptIQ MVP application layer, owned by Developer 1. All endpoints (except public Auth routes) require a valid JWT Bearer token in the `Authorization` header.

## 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new student account. | `{ "email": "...", "password": "...", "name": "..." }` | `{ "access_token": "...", "token_type": "bearer" }` |
| POST | `/api/auth/login` | Authenticate and retrieve JWT. | `{ "email": "...", "password": "..." }` | `{ "access_token": "...", "token_type": "bearer" }` |
| GET | `/api/auth/me` | Get current authenticated user basic details. | None | `{ "id": 1, "email": "...", "name": "..." }` |

## 2. User Profile (`/api/users`)

| Method | Endpoint | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/users/profile` | Retrieve full student profile and preferences. | None | `{ "user_id": 1, "name": "...", "preferences": {...} }` |
| PUT | `/api/users/profile` | Update user profile. | `{ "name": "..." }` | `{ "status": "success" }` |

## 3. Topics & Concepts (`/api/topics`)

| Method | Endpoint | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/topics` | List all available high-level topics. | None | `[ { "topic_id": 1, "name": "Python", "description": "..." }, ... ]` |
| GET | `/api/topics/{topic_id}` | Get topic details including its child concepts. | None | `{ "topic_id": 1, "name": "Python", "concepts": [ { "concept_id": 101, "name": "Base Cases" }, ... ] }` |

## 4. Quizzes & Adaptive Learning (`/api/quizzes`)

*These endpoints orchestrate the core adaptive learning loop.*

| Method | Endpoint | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/api/quizzes/start` | Initialize a new diagnostic or practice session for a topic. (Optional: Pass `concept_id` to start a targeted revision practice session). | `{ "topic_id": 1, "concept_id": 101 }` | `{ "quiz_id": "abc-123", "first_question": { "id": 50, "text": "...", "options": [...] } }` |
| GET | `/api/quizzes/{quiz_id}` | Get current session status and next pending question. | None | `{ "status": "in_progress", "current_question": {...} }` |
| POST | `/api/quizzes/{quiz_id}/submit` | Submit an answer. Triggers Mastery Update, AI explanation, and Adaptive Engine for next question. *Note: Does not automatically mark a scheduled revision as complete.* | `{ "question_id": 50, "selected_option_id": 3 }` | See detailed payload below. |

### Core Loop Payload: `/api/quizzes/{quiz_id}/submit`

This is the most critical endpoint for the hackathon demo. A typical response payload on an **incorrect** answer demonstrates the full integration of the intelligence layers:

```json
{
  "is_completed": false,
  "session_summary": null,
  "is_correct": false,
  "correct_option_id": 2,
  "concept_tested": {
    "concept_id": 101,
    "name": "Base Cases",
    "new_mastery_percentage": 32
  },
  "ai_explanation": "You missed the base case. A recursive function must have a terminating condition to prevent infinite loops. In your answer...",
  "next_question": {
    "question_id": 51,
    "difficulty": 1,
    "text": "What happens if a recursive function lacks a base case?",
    "options": [
      { "id": 1, "text": "It runs faster" },
      { "id": 2, "text": "It causes a RecursionError (Stack Overflow)" }
    ]
  }
}
```

## 5. Mastery & Progress (`/api/progress`)

| Method | Endpoint | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/progress` | Get current mastery snapshot for all concepts. | None | `{ "topics": [ { "topic_name": "Python", "concepts": [ { "name": "Base Cases", "mastery": 32 } ] } ] }` |
| GET | `/api/progress/history` | Get historical time-series data of mastery changes (for charts). | None | `[ { "date": "...", "concept_id": 101, "mastery": 25 }, ... ]` |

## 6. Revision Scheduling (`/api/revision`)

| Method | Endpoint | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/revision/today` | List concepts scheduled for revision today based on performance decay. | None | `[ { "concept_id": 101, "name": "Base Cases", "current_mastery": 32 } ]` |
| POST | `/api/revision/{concept_id}/complete` | Mark a scheduled revision activity as explicitly complete for this concept, bumping it to the next revision interval. | None | `{ "status": "success", "next_revision_date": "2024-11-20" }` |
