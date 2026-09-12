# 11. Security Specification

This document outlines the standard security measures implemented in the ConceptIQ MVP to protect user data and ensure application integrity during the hackathon demonstration and beyond.

## 1. Authentication & Authorization

ConceptIQ utilizes stateless JSON Web Tokens (JWT) to manage user sessions securely.

*   **Password Hashing:** User passwords are mathematically hashed using bcrypt (or equivalent secure algorithm) before being stored in the database. Plain text passwords are never stored, transmitted, or logged.
*   **Token Issuance:** Upon successful authentication (`POST /api/auth/login`), the FastAPI backend generates a JWT signed with a secure server-side secret key.
*   **Route Protection:** All core application routes (e.g., `/api/quizzes/*`, `/api/progress/*`) are shielded by middleware. This middleware verifies the validity and expiration of the JWT passed in the `Authorization: Bearer <token>` header, rejecting unauthorized requests with a `401` status.

## 2. Data Protection

*   **Storage:** The MVP utilizes PostgreSQL, which provides robust role-based access control (RBAC) and data isolation.
*   **Data in Transit:** All communication between the React frontend, the FastAPI backend, and the external LLM APIs must occur over HTTPS (TLS/SSL) to prevent interception of credentials, tokens, or personal learning data.

## 3. Application Security

*   **Injection Prevention:** The backend interacts with the database via parameterized queries or a secure ORM (like SQLAlchemy), strictly neutralizing SQL Injection (SQLi) vulnerabilities.
*   **Cross-Site Scripting (XSS):** The React frontend natively escapes values rendered in the DOM. Because the AI Tutor explanations require rendering Markdown, a strict sanitization library is applied before rendering to prevent malicious script execution.
*   **CORS (Cross-Origin Resource Sharing):** The backend is configured to exclusively accept API requests from the specific, authorized origin domain of the deployed frontend.

## 4. AI-Specific Security Considerations

Integrating Large Language Models introduces novel attack vectors that require specific mitigations.

*   **Prompt Injection Defense:** ConceptIQ mitigates prompt injection by heavily controlling the prompt assembly on the backend. The student's input (their selected multiple-choice answer) is treated strictly as a string literal injected into a rigid, non-executable template (see `08_AI_SYSTEM.md`). The system prompt includes explicit directives instructing the LLM to ignore any instructions attempting to override its tutoring persona.
*   **Key Management:** API keys for the external LLM provider are strictly managed as environment variables on the backend server. They are never exposed in client-side code or committed to the Git repository.
