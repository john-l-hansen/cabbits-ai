# 009 — Data-Driven World & Rewards

## Goal
Establish a structured data model layer in the project and implement a collectible item reward loop for quest completions. Users will find and collect items (Feather, Silver Acorn, Lantern, Carrot) during check-ins and inspect them in the Backpack.

## Requirements
1. **Data Files (`lib/data/`)**:
   - `items.ts`: Exports `Item` definitions (id, name, description, emoji/icon, locationOrigin).
   - `books.ts`: Exports static default books.
   - `quests.ts`: Exports quests list, connecting each to an optional reward item from `items.ts`.
   - `locations.ts`: Exports coordinate pin positions and place descriptions, grouping quests.
2. **Database Integration**:
   - Create a `companion_items` join table to record which item IDs have been acquired for each companion.
3. **TypeScript Types (`types/index.ts`)**:
   - Declare `Item` type.
   - Update `Companion` type with `inventory: string[]`.
4. **State Management (`CompanionProvider.tsx`)**:
   - Manage the companion's collected inventory state.
   - Inject the dynamic reward item in `completeQuest()`.
5. **Quest Completion Screen (`app/quest/page.tsx`)**:
   - If the completed quest has a reward item, show a card stating: `"You found the [Item Name]! Added to backpack."` alongside its icon.
6. **Backpack Drawer & Item Popups (`app/page.tsx`)**:
   - Display collected items in the Backpack drawer.
   - Tapping an item pops up an **Item Detail Modal** showing the name, description, large icon, and origin.

## Acceptance Criteria
- App builds and compiles successfully.
- Quest completion awards the correct item and saves it to inventory.
- Backpack drawer displays collectibles, and item detail modals show correct metadata.
- Clearing the companion wipes inventory.
