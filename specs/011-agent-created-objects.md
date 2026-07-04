# 011 — Agent-Created Objects

## Goal
Build the proposal engine (Phase 4 of the roadmap) where completing quests triggers the creation of draft items and quests. Users can review these in the "Dream Log" and approve them to integrate them dynamically into the map and item lists.

## Requirements
1. **Database Schema (`companion_draft_objects`)**:
   - Store Pip's proposed draft items and quests:
     - `id`: UUID primary key.
     - `companion_id`: UUID foreign key.
     - `type`: 'item' | 'quest'
     - `object_id`: Unique identifier (e.g. `moonlit_pearl`).
     - `data`: JSONB payload containing details (title, description, icon, location, etc.).
     - `status`: 'draft' | 'approved' | 'discarded'
2. **State Management (`CompanionProvider.tsx`)**:
   - Cache draft objects in `draftObjects` state.
   - Expose `approveDraftObject(objectId)` and `discardDraftObject(objectId)`.
   - On load, fetch draft objects.
   - Dynamically merge approved items from `draftObjects` into `ITEMS` and approved quests into `QUESTS` in-memory.
   - Modify `completeQuest` to trigger proposal generation after quest completion:
     - crescent pond observation -> drafts `moonlit_pearl` and `pearl_hunt`.
     - green meadow observation -> drafts `clover_nectar` and `nectar_brew`.
     - oak forest observation -> drafts `mossy_bark` and `bark_rubbing`.
3. **Approval Interface: "Dream Log" (`app/page.tsx`)**:
   - Add a tab/section inside the **Profile drawer** called **"Pip's Dream Log"**.
   - Lists the draft items and quests in `draftObjects`.
   - Displays Pip's notes and explanation.
   - Action buttons: "Approve & Add" and "Discard".
4. **Dynamic Map rendering (`app/explore/page.tsx`)**:
   - Make sure that newly approved quests appear on the map pin bottom-sheets, allowing players to play them!

## Acceptance Criteria
- App builds and compiles successfully.
- Completing a landmark quest spawns a draft item/quest in Pip's Dream Log.
- Approving the draft makes it appear in the Backpack drawer (if item) or Explore Map (if quest).
- Discarding the draft clears it.

---

## Future Roadmap Reminder: Item Generation Engine Tool

> [!IMPORTANT]
> **Trigger Condition**: When transitioning the proposal loop from hardcoded/local regex parsing to a live LLM orchestration stack (Phase 4), build a dedicated **Item Generation Tool**.
> 
> **Tool Responsibilities**:
> 1. Parse keepsake descriptions during onboarding to dynamically output matching titles, slots, descriptions, and emojis.
> 2. Parse Quest observations to generate dynamic draft objects, lore, and achievements.
> 3. Verify item balance parameters (e.g. rarity weights, properties) before adding to database tables.

