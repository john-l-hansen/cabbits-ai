# Cabbits — Visual Style Guide

**Source direction:** soft, hand-formed clay world with a gentle storybook warmth. The visual system should feel cheerful and safe, with a faint rainy-day tenderness rather than high-energy game UI.

## 1. Design north star

**Cozy tactile companionship.** Every surface looks touchable; every interaction is understandable at a glance. UI floats above the world as cream-colored, rounded objects, while the room itself is a miniature diorama with softened scale, chunky silhouettes, and low visual stakes.

---

## 2. Color system

### Core neutrals
* `cream-50`: `#FFF9ED` (Primary UI surface, cards, navigation)
* `cream-100`: `#FFF1D6` (App background, soft fills)
* `cream-200`: `#F7DFAE` (Ambient panels, subtle borders)
* `honey-100`: `#F7C66D` (Floor/light warmth, decorative fill)
* `honey-300`: `#EFA43B` (Wood highlights, secondary emphasis)
* `caramel-500`: `#B9691E` (Furniture depth, warm outlines)
* `cocoa-700`: `#442515` (Primary text and dark icon strokes)
* `cocoa-500`: `#754728` (Secondary text, subdued strokes)

### Garden greens
* `leaf-100`: `#DDECA0` (Light foliage, soft positive states)
* `leaf-300`: `#A8C94B` (Plant highlights, friendly success)
* `leaf-500`: `#6E9B24` (Main foliage, active environmental elements)
* `leaf-700`: `#456B1B` (Dark foliage depth; use sparingly)

### Rain and sky blues
* `sky-100`: `#D9EDFA` (Airy panels and large quiet areas)
* `sky-300`: `#9CC9E7` (Window, soft selected backgrounds)
* `sky-500`: `#609DCC` (Objects, utility accents, water)
* `sky-700`: `#356B9A` (Focus rings and accessible blue text)

---

## 3. Typography
* **Primary / UI:** `Nunito Sans` or `Nunito`
* Use `cocoa-700` for primary copy; avoid pure black.
* Keep text blocks compact. Messages should feel like dialogue bubbles.

---

## 4. UI components

### Surface recipe
* **App canvas**: `cream-100` (Radius: 32–48 px)
* **Card / status chip**: `cream-50` (Radius: 24–32 px, shadow: `0 5px 14px rgba(115, 70, 26, .12)`)
* **Bottom nav**: `cream-50` (Radius: 30–36 px)
* **Selected nav item**: `sky-300` (Radius: 22–28 px)
* **Speech bubble**: `cream-50` (Radius: 24–30 px)
* **Notification badge**: `coral-500` (Radius: 999 px)
