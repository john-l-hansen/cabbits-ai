# 012 — Memory Synthesis

## Goal
Build the Memory Synthesis engine (Phase 5 of the roadmap) where completing quests synthesizes learnings into Pip's consolidated Journal notebook. This data is persisted, displayed as vintage parchment notebook pages, and woven into Pip's home greetings.

## Requirements
1. **Database Schema (`companion_journal`)**:
   - Store Pip's compiled learnings:
     - `id`: UUID primary key.
     - `companion_id`: UUID foreign key.
     - `topic`: Topic name (e.g. `Water Circles`).
     - `summary`: Synthesized summary text.
     - `icon`: Emoji representing the topic.
2. **State & Synthesis (`CompanionProvider.tsx`)**:
   - Expose `journalEntries: JournalEntry[]`.
   - Update `completeQuest` to run the synthesis compiler mapping quest IDs to journal topics.
   - Save updates to database / local storage `cabbits_journal_v1`.
3. **Dialogue Customization (`dialogue.ts`)**:
   - Update `getCompanionGreeting` to accept optional `journalEntries`.
   - If present, Pip has a 25% chance of referencing a journal log in home bubble texts.
4. **Notebook Interface (`app/page.tsx`)**:
   - Add a tab category "Pip's Journal" inside the Backpack drawer.
   - Tapping an entry opens the Parchment Page Overlay.

## Acceptance Criteria
- App compiles and builds successfully.
- Completing a landmark quest spawns or updates the corresponding journal entry.
- Journal entries appear inside the Backpack drawer.
- Tapping a journal page opens a detailed parchment card.
- Idle Pip occasionally references synthesized memories in home screen speech bubbles.
