# 002 — Local State

## Goal
Implement a client-side local state solution to persist the companion's profile and track the completion status of the first quest.

## Requirements
- Persist companion state and quest completion in `localStorage` safely without causing React hydration mismatches.
- Ensure that the home page (`/`), companion creation page (`/companion/new`), and quest page (`/quest`) update dynamically based on the state.
- Add an expressive, breathing micro-animation to the Companion Orb to make it feel alive.
- Provide a way to reset the local companion data to make testing and repeating the flow seamless.

## State Structure
The application state must be modeled under a React Context tracking:
- `companion`: A `Companion` object or `null` if none has been created.
- `isFirstQuestCompleted`: A boolean indicating whether the first quest has been finished.
- `isLoading`: A boolean indicating whether state is currently being hydrated from client storage.

## Acceptance Criteria
- Loading screen or state transition displays gracefully when reading state on initial mount.
- If no companion exists, the Home screen displays the prompt to create one.
- Submitting the name and temperament form successfully saves the companion to state & storage and redirects to `/quest`.
- The quest page is inaccessible without a companion, automatically redirecting users to the creation page.
- Quest completion is interactive, updates state instantly, and persists upon page refresh.
- A "Reset Companion" button is provided to clear all local state and start fresh.
- Code compiles, builds, and passes all TypeScript checks cleanly.
