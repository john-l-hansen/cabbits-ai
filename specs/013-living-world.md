# 013 — Living World

## Goal
Build the final Phase 5 milestone: Living World (Thematic Personalization). The game world will react to player observations. Pip will track interest levels in specific topics (mushrooms, space, bugs) by scanning observations, and dynamically surface custom reactive quests on the map when a threshold is met.

## Requirements
1. **Database Column (`interests`)**:
   - Store interests as a JSONB dictionary inside the `companions` table:
     - `interests`: `{ "mushroom": 0, "space": 0, "bug": 0 }`
2. **Scanner & Proposer (`CompanionProvider.tsx`)**:
   - Scan observations submitted in `completeQuest()`.
   - Increment `interests[topic]` on keyword matches:
     - `mushroom`: "mushroom", "fungus", "toadstool", "spore".
     - `space`: "star", "telescope", "sky", "moon", "constellation".
     - `bug`: "bug", "insect", "butterfly", "firefly", "beetle".
   - When any topic score hits `2`, inject the corresponding reactive quest into the active location:
     - `mushroom` → `special_mushroom_quest` ("Mushroom Glow Study") at Oak Forest.
     - `space` → `special_star_quest` ("Starlight Constellations") at Secret Library.
     - `bug` → `special_bug_quest` ("Catching Fireflies") at Green Meadow.
3. **Greetings Notification (`dialogue.ts`)**:
   - Inject interest-awareness announcements to home screen greetings when a topic is unlocked (score >= 2).
4. **Explore Map Highlights (`app/explore/page.tsx`)**:
   - Highlight these dynamic reactive quests with a distinct outline and sparkle label (`✨ REACTIVE QUEST ✨`).

## Acceptance Criteria
- App compiles and builds successfully.
- Logging two observations about a theme triggers a Pip dialog announcement.
- The corresponding dynamic quest appears highlighted on the Explore Map.
- Completing the dynamic quest awards items/coins correctly.
