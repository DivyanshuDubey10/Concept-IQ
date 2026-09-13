# 08. AI System (Tutor Engine)

This document outlines the design and implementation of the AI Tutor Engine within ConceptIQ (owned by Developer 2).

## 1. Core Philosophy

The ConceptIQ AI Tutor is expressly designed **not** to simply hand the student the correct answer. Its primary directive is to act as a personalized mentor: it helps the student understand *why* their specific answer was incorrect and reinforces the underlying concept before they attempt the next question.

## 2. Tutor Capabilities

The AI Tutor Engine is responsible for delivering:
*   **Targeted Remediation:** Explanations tailored specifically to the exact incorrect option the student selected.
*   **Adaptive Complexity:** Explanations that scale in technical depth based on the student's demonstrated mastery (e.g., a student with 20% mastery receives analogies; a student with 80% mastery receives concise technical corrections).
*   **Contextual Examples:** Generation of relevant, easy-to-understand examples (e.g., brief code snippets or real-world analogies).

## 3. Architecture: Dynamic Prompt Engineering

ConceptIQ does not rely on pre-written explanations. The system's intelligence comes from how the backend dynamically constructs a highly contextual prompt before sending it to the LLM API.

### 3.1. The Prompt Variables

When a student submits a wrong answer, the AI Tutor Service compiles a prompt using real-time session state:
*   `{concept_name}`: The specific granular concept failing (e.g., "Base Cases").
*   `{question_text}`: The question attempted.
*   `{student_answer}`: The exact incorrect text the student chose.
*   `{correct_answer}`: The correct text.
*   `{mastery_level}`: The student's current mastery percentage for this specific concept.

### 3.2. Example Prompt Construction

**System Directive:**
> You are an empathetic, expert AI coding tutor. A student just answered a question incorrectly. 
> Your task: Explain *why* their specific answer was wrong, and *why* the correct answer is right, focusing strictly on the provided Concept. 
> Crucially, adapt your language based on their Mastery Level. If Mastery is low (<50%), use simple analogies and basic terms. If Mastery is high (>75%), provide a concise, highly technical correction. Keep it under 100 words.

**Dynamically Injected User Prompt:**
> Concept: {concept_name} (e.g., Base Cases in Recursion)
> Student Mastery: {mastery_level} (e.g., 32%)
> 
> Question: {question_text} (e.g., What happens if a recursive function lacks a base case?)
> Student chose: "{student_answer}" (e.g., It runs faster)
> Correct answer: "{correct_answer}" (e.g., It causes a Stack Overflow)
> 
> Generate the explanation.

### 3.3. Expected AI Output (Low Mastery Example)

Based on the prompt above (32% mastery), the LLM generates a foundational, analogy-driven response:

> "I see you thought it would run faster! Actually, it's quite the opposite. Think of a recursive function like walking down a staircase. The 'base case' is the solid floor at the bottom. If there is no floor (no base case), you just keep falling forever. In Python, if you don't tell the function exactly when to stop, it will keep calling itself until the program crashes with a 'Stack Overflow' error."

## 4. Execution Flow in the API

1.  The student submits an incorrect answer to `/api/quizzes/{quiz_id}/submit`.
2.  The API identifies the correct answer and the tested concept.
3.  The API calls the AI Tutor Service.
4.  The AI Tutor Service constructs the prompt (as shown in 3.2) and makes a synchronous call to the external LLM API.
5.  The LLM's explanation is bundled into the final JSON response payload and displayed in the frontend UI alongside the next adaptive question.
