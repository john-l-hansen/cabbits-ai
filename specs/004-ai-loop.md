# 004 — AI Loop Simulation

## Goal
Implement a simulated multi-agent AI pipeline. Users will submit observations on their quest, view a step-by-step thinking visualizer representing different backend agents (Orchestrator, Teacher, Evaluator, Safety), and receive custom feedback.

## Requirements
1. **Quest Observation Input**:
   - Add a textarea in the `/quest` page to receive user input.
   - Restrict submission unless input is at least 10 characters long.
2. **Multi-Agent Simulation (`lib/agents/simulation.ts`)**:
   - **Orchestrator Agent**: Scans the input text for keywords:
     - `botany`: if input contains `"plant"`, `"leaf"`, `"flower"`, `"tree"`, `"grass"`, `"moss"`, `"wood"`, `"green"`.
     - `physics`: if input contains `"clock"`, `"shadow"`, `"light"`, `"time"`, `"sun"`, `"mirror"`, `"reflection"`, `"gravity"`.
     - `history`: if input contains `"book"`, `"coin"`, `"map"`, `"old"`, `"paper"`, `"pen"`, `"ink"`, `"photo"`.
     - `generalist`: fallback if no keywords match.
   - **Teacher Agent**: Simulates a subject-specific teacher response based on the routed topic.
   - **Evaluator Agent**: Evaluates response quality:
     - `"Brief"`: length < 25 characters.
     - `"Developing"`: length between 25 and 60 characters.
     - `"Thoughtful"`: length > 60 characters.
   - **Safety Agent**: Checks for basic language filters (e.g. block toxic/offensive terms if present).
   - **Companion Agent**: Summarizes the feedback, combining warmth and encouragement based on the companion's name and selected temperament.
3. **Interactive Thinking Animation**:
   - Show a simulated processing log of agents interacting when the user clicks submit:
     - Stage 1: `"Orchestrator: Routing request..."`
     - Stage 2: `"Consulting [Specialist] Specialist Teacher..."`
     - Stage 3: `"Evaluator: Reviewing reflection depth..."`
     - Stage 4: `"Safety: Content check approved."`
     - Stage 5: `"Companion: Synthesizing reflection..."`
   - Cycle through stages with a time delay (e.g., 600ms per stage) to give a realistic interactive flow.
4. **State and Database Integration**:
   - Save the complete reflection payload (user observation, routed specialist, evaluator score, companion feedback) inside the `content` field of the memory record.

## Acceptance Criteria
- Code compiles, builds, and runs cleanly with no errors.
- Short inputs display an error validation warning.
- Clicking submit initiates the multi-stage visual loader.
- Submitting different topics (e.g. leaf vs. clock) generates different routed specialist feedback.
- Completed Quest UI presents a rich summary layout displaying the user's input, the routed specialist feedback, and the companion's summary.
- The details persist on page refresh and are displayed on the home page.
