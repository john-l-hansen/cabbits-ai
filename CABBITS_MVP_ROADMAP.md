# Cabbits MVP Roadmap

## Philosophy

Do not build an infinite world.

Build a **small world with repeatable patterns**.

The objective of the MVP is not content quantity—it is proving that the world, companion, and adaptive storytelling architecture work together.

Every future feature should expand an existing pattern rather than introduce a new one.

---

# Layer 1 — World Shell

The first milestone is making the world feel real.

The world should exist before it becomes intelligent.

## MVP World

- Home
- Bookshelf
- Backpack
- World Map
- One Location (Oak Forest)
- One Companion (Pip)

Nothing more.

Resist adding:

- multiple locations
- professions
- dozens of NPCs
- crafting systems
- procedural generation

Build one beautiful example.

---

# Layer 2 — Content Pattern

Every location should follow the same reusable architecture.

```
Location
├── Atmosphere
├── Points of Interest
├── Experiences
├── Items Found Here
├── Characters Present
└── Memory Hooks
```

## Example

Oak Forest

Atmosphere
- Light rain

Points of Interest
- Ancient Oak

Experiences
- Find the Silver Acorn

Items
- Feather

Characters
- Wise Owl

Memory
- First Forest Visit

The pattern matters more than the amount of content.

---

# Layer 3 — Agent Layer

Agents should not invent the world from scratch.

Agents should populate structured containers.

Instead of:

Agent creates anything.

Use:

Agent chooses:

- Location atmosphere
- Current events
- Companion dialogue
- Quest narration
- Reward item
- Reflection

The creativity happens inside the architecture.

---

# Development Phases

## Phase 1 — Static World

Build authored content.

Screens

- Home
- Map
- Oak Forest
- Backpack
- Bookshelf
- Item Detail
- Quest Detail

No AI generation.

Goal:

The world exists.

---

## Phase 2 — Data-Driven World

Move all content into structured data.

Examples

locations.ts

items.ts

quests.ts

characters.ts

memories.ts

The UI should render from data rather than hardcoded screens.

Goal:

The world becomes scalable.

---

## Phase 3 — Agent-Assisted Storytelling

Introduce AI only where it enhances authored content.

Examples

- Pip greetings
- Location atmosphere
- Quest narration
- Reflection after completing quests
- Daily observations

Goal:

The world begins to feel alive.

---

## Phase 4 — Agent-Created Objects

Agents begin proposing new content.

Example

Moonlit Acorn

Type:
Quest Item

Location:
Oak Forest

Purpose:
Unlock Wise Owl memory

Status:
Draft

Nothing enters the game automatically.

Human approval is required.

Goal:

Generative expansion with consistency.

---

## Phase 5 — Living World

The world begins responding to player behavior.

Example

Player enjoys mushrooms

↓

Pip notices

↓

Oak Forest surfaces mushroom experiences

↓

New collection appears

↓

New memories are formed

Goal:

The world evolves naturally.

---

# Reusable UI Patterns

Build patterns instead of pages.

Core patterns

- Location Card
- Living Place
- Point of Interest Card
- Experience Card
- Inventory Category
- Item Detail
- Quest Detail
- Companion Bubble
- Memory Entry

Every new feature should reuse one of these patterns.

---

# Initial Asset Scope

Only produce assets necessary for the first playable experience.

## Companion

- Pip

## Home

- Bedroom
- Bookshelf
- Backpack

## World

- Oak Forest
- Ancient Oak

## Character

- Wise Owl

## Items

- Carrot
- Feather
- Lantern
- Silver Acorn

Everything else belongs in the backlog.

---

# Success Criteria

The MVP is successful if a player can:

1. Enter the Cabbits world.
2. Meet Pip.
3. Visit Oak Forest.
4. Complete a small experience.
5. Receive an item.
6. Create a memory.
7. Return home.

Once this loop feels delightful, the world is ready to expand.

---

# Guiding Principle

Never build more content than the architecture can support.

Build the smallest complete world possible.

Then expand it through repeatable patterns, reusable assets, and agent-assisted storytelling.

The first goal is not an infinite world.

The first goal is a world that feels alive.
