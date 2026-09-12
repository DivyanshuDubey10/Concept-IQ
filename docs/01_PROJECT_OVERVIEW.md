# 01. Project Overview

**Project Name:** ConceptIQ
**Tagline:** "From knowing the answer to mastering the concept."
**Hackathon:** CodeMyFYP Build Beyond (Track: AI in Learning / AI in Education)

## 1. Introduction

ConceptIQ is an adaptive AI learning and practice platform designed to solve a fundamental flaw in traditional educational systems: the binary evaluation of answers. Most platforms tell a student if they are right or wrong, but fail to identify the underlying conceptual misunderstanding, explain why the student struggled, or provide a targeted path to actual mastery.

ConceptIQ moves beyond simple "AI tutoring" by implementing a **continuous adaptive learning loop** driven by demonstrated student performance.

## 2. The Core Learning Loop

Our primary differentiator is the Adaptive Question Engine and the complete learning cycle:

1. **Topic Selection & Diagnostic:** The student selects a topic (e.g., Python > Recursion) and takes a diagnostic assessment.
2. **Performance Analysis & Weak Concept Detection:** The system analyzes the answers to calculate mastery at the *granular concept level* (e.g., Identifying that "Base Cases" is at 32% mastery, while "Recursive Calls" is at 78%).
3. **Personalized AI Explanation:** The AI Tutor steps in to provide a targeted, personalized explanation focusing specifically on the weak concept, adapting its complexity to the student's level.
4. **Targeted Practice & Adaptive Difficulty:** The student receives practice questions specifically targeting the weak concept. Question difficulty automatically adapts based on real-time performance (e.g., correctly answering an Easy question promotes the next to Medium).
5. **Mastery Update & Revision Scheduling:** Mastery scores are updated based on the new performance data, and a spaced revision schedule is generated to prioritize weak or potentially forgotten concepts.

## 3. High-Level Architecture & Tech Stack (MVP)

*   **Frontend Layer:** React.js, Tailwind CSS (Handles routing, state management, and adaptive UI rendering)
*   **Application/API Layer:** Python, FastAPI (REST APIs, Authentication via JWT, Session Management)
*   **Intelligence Layer:**
    *   **AI Engine:** LLM API (Question generation, personalized explanations, answer evaluation)
    *   **Adaptive Engine:** Rule-based difficulty adjustment and concept selection
    *   **ML Engine (Experimental):** scikit-learn (Mastery prediction models based on attempt history, time since revision, and performance trends)
*   **Data Layer:** PostgreSQL

## 4. The Demo Narrative

The intended hackathon demo will walk judges through a complete, localized learning loop in 2 minutes:
1.  **Diagnostic:** A student struggles with a quiz on Python Recursion.
2.  **Detection:** The system pinpoints "Base Cases" as the specific failing concept (32% mastery).
3.  **Intervention:** The AI provides a personalized explanation of base cases.
4.  **Adaptation:** The student takes a targeted practice question, and the system adapts difficulty based on their answer.
5.  **Resolution:** The dashboard reflects improved concept mastery and schedules the next revision.

## 5. Project Scope & Goals

This project focuses on delivering a robust Minimum Viable Product (MVP) that proves the efficacy of the adaptive learning loop. While advanced Machine Learning models for mastery prediction are being explored, the core MVP relies on a deterministic, rule-based adaptive engine to ensure reliability during the hackathon demonstration.
