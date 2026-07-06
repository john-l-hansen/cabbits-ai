# 015 — Explore Quests Loop & Companion Growth

## Goal
Implement a fully functional game loop where players interact with 3 Points of Interest (POIs) per Explore location. Each POI features an active quest offering 3 distinct, positive, problem-solving choice approaches representing different styles of intelligence. Completing quests awards XP, driving companion growth (leveling up), and completing all 3 POIs in a location resets and randomizes the quest set with themed variations.

## Requirements

1. **3 Points of Interest (POIs) per Location**:
   - The Explore Map detail view (when a location is selected) renders 3 clickable POI pins.
   - Selecting a POI pin highlights it and loads its corresponding Quest Details.
   - Locations configured:
     - **Crescent Pond**: Golden Lilies, Center Ripples, East Grove
     - **Oak Forest**: Buttercup Patch, Purple Clover, Hummingbird Nest
     - **Little Bridge**: Ancient Oak, High Perch, Whispering Undergrowth
     - **Pip's Burrow**: Warm Entrance, Lichen Storage, Comfort Tunnels
     - **Secret Library**: Ivy Stone Walls, Forgotten Shelves, Glowing Rune Tablet

2. **Choice-Based Quests (3 Problem-Solving Types)**:
   - Instead of a freeform text input, the `/quest` page presents the active quest with **3 distinct choice buttons** (styled as clay cards).
   - Each option solves the quest problem positively using a different style of logic:
     - **Logical / Deductive (Math/Reasoning)**: Uses arithmetic, sorting, logic grids, or sequence prediction.
     - **Verbal / Relational (Empathy/Language)**: Uses translation, kind words, conflict resolution, or storytelling.
     - **Practical / Observational (Science/Mechanics)**: Uses biological details, mechanical fixes, or direct observation.

3. **XP & Growth System**:
   - Completing a quest awards **200 XP**.
   - Level-up threshold is defined as: `XP needed = Level * 1000`.
   - Upon reaching the threshold:
     - Companion's level increases by 1.
     - Excess XP carries over to the next level.
     - Core attributes (Health, Learning, Kindness, Energy) scale up slightly (+1 to +5 points).
     - Triggers a celebratory level-up dialog / celebration state on Home or Quest return.

4. **Set Completion & Randomization**:
   - We track the completion of quests per location.
   - When all 3 POIs/Quests for a given location are completed, the "Set" is complete.
   - Completion triggers a reset/randomization:
     - The completed quests are cleared.
     - The location's POIs are populated with new randomized quest templates matching the theme and tone of that location (e.g., swapping item names, target numbers, or dialog details) to allow infinite progression loops.

## Acceptance Criteria
- Explore map POIs are fully interactive and clickable, selecting different quests.
- `/quest` loads 3 distinct choice buttons instead of text input.
- Choosing any option submits the quest, shows the multi-agent thinking animation, and awards 200 XP.
- Reaching level thresholds increments companion level and scales stats.
- Completing all 3 quests in a location resets and randomizes that location's quests.
