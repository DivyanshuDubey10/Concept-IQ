# ConceptIQ

> **"From knowing the answer to mastering the concept."**

*A project for the CodeMyFYP Build Beyond Hackathon (Track: AI in Learning / AI in Education).*

---

## What is ConceptIQ?

Traditional educational platforms suffer from a critical flaw: binary evaluation. They tell a student if their answer is right or wrong, but fail to identify the underlying conceptual misunderstanding, explain *why* the student struggled, or provide a personalized path to actual mastery.

ConceptIQ solves this by implementing a **continuous adaptive learning loop**. 

Instead of generating a generic "60% score" on a broad quiz, ConceptIQ breaks topics down into granular concepts, pinpoints exactly where a student is failing, and immediately intervenes with a personalized AI explanation and targeted, adaptive practice.

## The Core Learning Loop

1. **Diagnostic:** A student takes an assessment to establish a baseline.
2. **Detection:** The system calculates mastery at the *concept level* and identifies the weakest link (e.g., struggling with "Base Cases" despite understanding "Recursive Calls").
3. **Intervention:** The AI Tutor provides a personalized explanation targeted specifically at the failing concept, adapting its language to the student's current mastery level.
4. **Adaptation:** The engine serves a new practice question specifically targeting the weak concept, dynamically adjusting the difficulty based on recent performance.
5. **Resolution:** Mastery is updated, and the concept is prioritized in an automated spaced revision schedule to ensure long-term retention.

## Tech Stack (MVP)

*   **Frontend:** React.js, Tailwind CSS
*   **Backend Application:** Python, FastAPI
*   **Intelligence Engine:** Custom Rule-Based Engine & External LLM API
*   **Database:** SQLite
*   **Experimental ML (Future Scope):** `scikit-learn`

## Comprehensive Documentation

We approach this hackathon with a production mindset. Please explore the `docs/` directory for detailed, implementation-oriented technical specifications:

1.  [Project Overview](docs/01_PROJECT_OVERVIEW.md)
2.  [Problem Statement](docs/02_PROBLEM_STATEMENT.md)
3.  [Product Requirements (MVP vs. Future)](docs/03_PRODUCT_REQUIREMENTS.md)
4.  [System Architecture](docs/04_SYSTEM_ARCHITECTURE.md)
5.  [API Specification](docs/05_API_SPECIFICATION.md)
6.  [Database Design & ERD](docs/06_DATABASE_DESIGN.md)
7.  [Adaptive Learning Engine Rules](docs/07_ADAPTIVE_LEARNING_ENGINE.md)
8.  [AI System & Prompt Engineering](docs/08_AI_SYSTEM.md)
9.  [Mastery Tracking & Revision](docs/09_MASTERY_AND_REVISION.md)
10. [UI/UX Specification](docs/10_UI_UX_SPECIFICATION.md)
11. [Security](docs/11_SECURITY.md)
12. [Testing Strategy](docs/12_TESTING.md)
13. [Hackathon Demo Guide](docs/13_DEMO_GUIDE.md)
14. [Team Responsibilities](docs/14_TEAM_RESPONSIBILITIES.md)

## The Team

Built by a 2-person development team with strictly defined architectural responsibilities:
*   **Developer 1:** Frontend Experience & Application API Layer
*   **Developer 2:** Adaptive Engine, Mastery Algorithms, & AI/ML Integration
