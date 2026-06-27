# 007 — Cozy Home Screen

## Goal
Implement a visually rich, interactive cozy room homepage mimicking the hand-drawn pencil/watercolor style of the reference image. The interface represents the companion's living room, serving as the main navigational and emotional hub for the Cabbits app.

## Requirements
1. **Pencil-Sketch Visual Style**:
   - Match the desaturated warm tones, soft pencil outlines, and cozy room composition.
   - Use dynamic visual assets (cozy room background and cute standing Cabbit bunny character).
2. **Top Status Bar UI**:
   - **Time**: Display local hour (e.g. `"10:30 AM"`).
   - **Weather**: Display status box (e.g., `"Rainy 18°C"`, `"Sunny 22°C"`, or `"Snowy 2°C"`).
   - **Carrot Coins**: Display currency icon + coin amount (starting at `128`).
   - **Mail Notification**: Envelope button opening a notification modal containing letters from teacher agents.
3. **Bottom Navigation Bar**:
   - Five navigation tabs:
     - `Home` (House icon, active by default)
     - `Explore` (Globe icon, opens the quest map drawer)
     - `Learn` (Book icon, redirects to `/bookshelf`)
     - `Inventory` (Backpack icon, opens bag showing carrot snacks and books)
     - `Profile` (Bunny head icon, opens companion profile details)
4. **Clickable Hotspots (Furniture Interactions)**:
   - **Bookshelf**: Clicking coordinates matching the bookshelf redirects immediately to `/bookshelf`.
   - **Bed**: Clicking the bed toggles the Cabbit to sleep state. The Cabbit moves to the bed, closes eyes (mood changes to `"sleeping"`), and the room dims.
   - **Bowl / Kitchen**: Clicking the bowl feeds the Cabbit. Spends 5 coins, increments curiosity by +5%, and sets mood to `"happy"`.
   - **Window**: Clicking the window toggles the weather states and room light overlay filter.
5. **Interactive Cabbit Speech Bubbles**:
   - Tapping the Cabbit triggers random speech bubbles reflecting their current state or temperament (e.g. curious, playful, gentle, focused).
6. **Data & State**:
   - Extend `Companion` profile to track:
     - `carrotCoins`: number.
     - `cabbitMood`: `"idle" | "hungry" | "sleeping" | "happy"`.
     - `cabbitLocation`: `"rug" | "bed" | "table"`.
   - Extend `supabase/schema.sql` to include columns `carrot_coins`, `cabbit_mood`, and `cabbit_location`.

## Acceptance Criteria
- App compiles, builds, and runs cleanly with no errors.
- Top bar displays system time, weather, and carrot coins.
- Interactive hotspots (Bookshelf, Bed, Food Bowl, Window) trigger expected state transitions.
- Bottom navigation tabs open correct drawers/sub-sheets.
- Tapping the companion displays responsive dialog bubbles.
- All states persist on reload and sync to database/localStorage.
