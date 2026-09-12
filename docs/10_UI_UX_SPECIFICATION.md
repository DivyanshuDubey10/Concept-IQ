# 10. UI/UX Specification

This document details the frontend architecture, user flows, and design system for the ConceptIQ React application (owned by Developer 1).

## 1. Design Philosophy & Aesthetics

To stand out in the hackathon, ConceptIQ must deliver a premium, highly engaging user experience. The interface is designed to reduce cognitive load while maximizing the sense of progression and intelligence.

*   **Theme:** Modern, sleek "Dark Mode" by default (using deep slate/indigo palettes) with vibrant, glowing accent colors to indicate success, failure, and mastery progress.
*   **Typography:** Google Fonts 'Inter' or 'Outfit' for clean, highly legible technical reading.
*   **Micro-interactions:** Smooth Tailwind CSS transitions on hover states, gentle pulsing on primary CTAs, and fluid slide-in animations for AI Tutor interventions.
*   **Responsiveness:** Mobile-first approach using Tailwind's utility classes to ensure the adaptive quiz loop is perfectly usable on any device size.

## 2. Core User Flows

### 2.1. The Adaptive Quiz Flow
This is the most critical interaction in the application. It must be a seamless Single Page Application (SPA) experience without any page reloads during the session.

1.  **Topic Selection:** User selects a topic card from the dashboard.
2.  **Question View:** A clean interface presenting the question text and multiple-choice options.
3.  **Submission:** User clicks an option and hits "Submit". A loading spinner indicates the backend is evaluating the answer, updating mastery, and consulting the AI.
4.  **Evaluation State:**
    *   *If Correct:* The selected option highlights green. A brief success animation plays. The "Next Question" button appears.
    *   *If Incorrect:* The selected option highlights red; the correct option highlights green.
5.  **AI Intervention (Incorrect State):** A stylized chat interface (the `AITutorBubble`) smoothly slides into view containing the personalized AI explanation regarding the specific failed concept.
6.  **Progression:** The "Next Question" button dynamically loads the targeted practice question chosen by the Adaptive Engine.
7.  **Exiting the Session:** A persistent "End Session & View Progress" control is always visible. This allows the student to intentionally exit the continuous adaptive practice session and navigate back to the dashboard to review their updated mastery metrics. (It does not imply the student must answer an unlimited number of questions).

### 2.2. The Mastery & Revision Flow
1.  **Overview Dashboard:** Displays high-level summaries (Total Topics Started, Overall Progress).
2.  **Granular Mastery Breakdown:** A detailed visual list showing specific concepts (e.g., Base Cases, Call Stacks) with their mastery percentages represented by dynamic progress bars (Red for weak, Yellow for learning, Green for mastered).
3.  **Daily Revision Queue:** A prominent section listing concepts specifically scheduled for today (prioritized by lowest mastery), featuring a clear "Start Revision" button.

## 3. Key React Components

*   **`QuizEngine`:** The smart container managing the session state, current question, and API interactions.
*   **`QuestionCard` / `OptionList`:** Renders the question and options. Manages the visual states (`default`, `selected`, `correct`, `incorrect`, `disabled`).
*   **`AITutorBubble`:** A visually distinct component (e.g., with a subtle glowing border or distinct background) that renders the LLM's explanation, clearly separating it from the core question text.
*   **`MasteryProgressBar`:** A reusable component that maps a percentage (0-100) to a colored bar (Red < 40%, Yellow 40-70%, Green > 70%).

## 4. Error Handling & Accessibility

*   **Loading States:** Skeleton loaders are used during initial API fetches (dashboard data). Inline spinners or button-state changes are used for asynchronous actions (submitting answers).
*   **Error States:** Graceful toast notifications (e.g., "Network error, please try again") are utilized rather than app-breaking crashes or raw alert boxes.
*   **Accessibility (a11y):** 
    *   Semantic HTML5 tags.
    *   Keyboard navigability (ability to tab through quiz options and hit Enter to submit).
    *   High color contrast ratios between text and background to ensure readability.
