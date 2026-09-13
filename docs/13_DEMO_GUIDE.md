# 13. Demo Guide

This document provides the exact script and technical choreography for the 2-minute ConceptIQ hackathon pitch. The primary goal of this demo is to vividly illustrate our core differentiator: the transition from superficial grading to targeted conceptual mastery.

## 1. Pre-Flight Checklist

Before the judges arrive, Developer 1 must ensure the following environment state:
*   [ ] Local FastAPI backend and React frontend are running.
*   [ ] The database is freshly seeded (specifically ensuring the "Python > Recursion" question bank is fully loaded).
*   [ ] Logged in as the designated `demo_student` account with a clean slate (zero previous mastery history).
*   [ ] Verify the external LLM API is reachable and responding within 2 seconds.

## 2. The 2-Minute Pitch Script

This is a two-person presentation. Developer 1 drives the UI; Developer 2 narrates.

| Timestamp | Action (Driver) | Narration (Speaker) | Technical Highlight |
| :--- | :--- | :--- | :--- |
| **0:00–0:15** | From the Dashboard, select **Python > Recursion**. | "Traditional platforms just tell you if you're right or wrong. ConceptIQ tells you exactly *why* you're wrong and how to fix it. Let's watch a student practicing Python Recursion." | Fast SPA routing. |
| **0:15–0:35** | Start the diagnostic quiz. Answer 2 questions correctly, but intentionally select the wrong answer for the question on **Base Cases**. | "The student takes a diagnostic. They understand 'recursive calls' fine, but they stumble here on the 'Base Cases' question." | Immediate API response evaluation. |
| **0:35–0:50** | Navigate to the Mastery Dashboard. | "Instead of giving a generic 60% failing grade, ConceptIQ breaks the topic down. Look here: The engine has precisely pinpointed 'Base Cases' as the failing concept, calculating its mastery at just 32%." | Concept-level mastery aggregation; visual progress bars. |
| **0:50–1:10** | Return to the Quiz View. Reveal the AI Tutor explanation. | "Because they failed that specific concept, the AI Tutor intervenes immediately. It dynamically generates a personalized explanation of Base Cases, using simple analogies tailored specifically to their low 32% mastery level." | Context-aware dynamic prompt engineering. |
| **1:10–1:30** | Click 'Next Question'. | "Now, the Adaptive Engine takes over. It automatically queries the database for a new practice question specifically targeting that weak 'Base Cases' concept..." | Logic targeting the lowest mastery concept. |
| **1:30–1:45** | Successfully answer the new question. | "...and because they struggled previously, the difficulty automatically adapted down to Medium. Armed with the AI's explanation, the student now gets it right." | Rule-based difficulty adaptation (Hard + Wrong -> Medium). |
| **1:45–2:00** | Open the Daily Revision tab. | "The mastery score immediately recovers. Finally, the system prioritizes 'Base Cases' at the top of tomorrow's spaced revision queue to ensure they don't forget it. That is the ConceptIQ loop: From knowing the answer, to mastering the concept." | Automated spaced revision prioritization. |

## 3. Contingency Plan

If the external LLM API experiences latency or downtime during the live demo:
*   The backend is configured with a 4-second timeout on the LLM call.
*   If it times out, the backend returns a hardcoded, generic fallback explanation for the concept.
*   **The pivot:** If this occurs, the Speaker should highlight it as a feature: *"Notice how our system gracefully degrades. Even if the AI service goes down, the core adaptive loop and fallback learning materials ensure the student's progress is never blocked."*
