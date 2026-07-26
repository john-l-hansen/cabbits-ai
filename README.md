# Cabbits — A Cozy AI-Native Companion World

A cozy, AI-native virtual companion experience where children explore logic, language, and reasoning alongside their evolving Cabbit friend in a handcrafted claymorphic valley.

🚀 **Live Application Link**: [https://cabbits-ai.vercel.app/login](https://cabbits-ai.vercel.app/login)

---

## 📖 Table of Contents
1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Getting Started](#-getting-started)
6. [Generative AI Architecture (Kaggle Context)](#-generative-ai-architecture-kaggle-context)

---

## 🌟 Overview

Cabbits is designed as a calm, emotionally engaging virtual space that replaces traditional high-pressure game loops with mindful moments of curiosity and learning. Every view in the application is designed to mimic a handcrafted, clay-inspired toybox or speech bubble, creating a highly tactile visual layout.

As a player, you create a companion Cabbit, interact with it in its cozy room, and journey out into a living valley to solve logic-based environmental quests. Learning is structured as a shared activity—you share observations and solutions to help your companion build curiosity and unlock new content.

---

## 🎨 Key Features

### 🏡 Cozy Home View
* **Tactile Interactions**: Toggle your companion to sleep (dimming the bedroom to night mode) or spend Carrot Coins to feed them snacks.
* **Camera Focus Zooms**: Clicking on major exit hotspots (Bookshelf, Closet, Portrait, and Window) pans and zooms the camera towards the target object to create a seamless transition before routing to the next page.
* **Adaptive Dialogue**: Click Pip to trigger responsive, personality-driven speech bubbles that reflect current weather cycles, coin balances, and synthesized memories.

### 🗺️ Explore Map
* **Interactive landmarks**: A data-driven map displaying points of interest like Crescent Pond, Green Meadow, Oak Forest, and the Secret Library.
* **Persistent Ambient Audio**: Custom atmospheric tracks play when visiting different zones and persist seamlessly across sub-pages unless a new area-specific track is triggered.
* **Companion Reflections**: Pip reflects on landmarks dynamically, providing hints and observations based on current weather conditions.

### 🧪 Quest Chamber
* **Approach Options**: Embark on observations using different types of thinking: Logical, Relational, or Practical.
* **Agent Orchestration Loader**: Submitting your approach plays an orchestration sequence showing simulated coordination logs (Orchestrator -> Specialist -> Evaluator -> Safety).
* **Rewards & Collectibles**: Completing quests writes observations to the companion's journal, awards curiosity metrics, and unlocks custom collectibles.

### 👤 Profile & Equipment
* **3D Pedestal Stage**: Displays your companion centered on a transparent 3D claymorphic grass pedestal against a custom cloud sky.
* **Claymorphic Inventory**: A simplified gear drawer featuring a custom clay-molded backpack illustration.

---

## 💻 Tech Stack

* **Frontend Framework**: Next.js (App Router) & React 19
* **Styling**: Tailwind CSS & Vanilla CSS (Tailwind v4 Theme Engine)
* **Animation**: Framer Motion (for fluid transitions and spring physics)
* **Icons & Assets**: Custom Figma-derived illustrations and MP3 zone soundtracks

---

## 📂 Project Structure

```bash
cabbits/
├── app/                  # Next.js App Router (pages: bookshelf, explore, profile, quest)
├── components/           # Reusable UI blocks (MainShell, CompanionOrb, TypedSpeechBubble)
├── public/               # Static assets (3D illustrations, MP3 audio loops)
├── lib/
│   ├── agents/           # Dialogue generators and simulated specialist orchestration
│   ├── data/             # Static dictionaries (books, items, quests, locations)
│   └── constants.ts      # Quote constants and global settings
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/john-l-hansen/cabbits.git
cd cabbits
npm install
```

### 3. Run Development Server
Start the local server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to run the app.

---

## 🤖 Generative AI Architecture (Kaggle Context)

While this submission functions as a standalone frontend showcase, the architecture is built specifically to transition from rule-based overrides to live Generative AI connections:
* **Evolving Dialogue**: The `getCompanionGreeting` function is modeled as a system-prompt orchestrator, designed to pass companion metadata, weather states, and past journal summaries to an LLM API to produce real-time contextual dialog.
* **Generative NPCs & Crafting**: The data-driven layout maps locations, items, and quests directly from JSON dictionaries. A live backend LLM can dynamically write new item schemas (e.g. customized keepsake rewards generated by the village Blacksmith) directly into the database inventory table to render them in real-time.
