# 014 — Figma Wireframe Sync

## Design System Tokens
Based on the Figma Dev Mode variables definition query, we sync the following tokens into CSS variables:
- `--neutral-0`: `#ffffff`
- `--neutral-50`: `#f9f9f9`
- `--neutral-200`: `#e5e5e5`
- `--neutral-300`: `#cccccc`
- `--neutral-500`: `#7b7b7b`
- `--neutral-700`: `#474747`
- `--neutral-900`: `#181818`
- `--neutral-1000`: `#000000`

## Wireframe Visual Aesthetics
- **Borders**: All primary component borders should use `2px border-[var(--neutral-1000)]` or `border-[var(--neutral-300)]`.
- **Backgrounds**: Cards use `bg-[var(--neutral-0)]`, pages use `bg-[var(--neutral-50)]`.
- **Text**: Headers use `text-[var(--neutral-900)]`, secondary text uses `text-[var(--neutral-500)]`.
- **Placeholders**: Illustrations and covers use a box with a crossed line (`✕`) indicating an image placeholder.

## Screens Structure
1. **Home Screen**: Bedroom wireframe (rug, bed, bookshelf outline boxes, simple speech bubble).
2. **Backpack Drawer**: Tab group for Collectibles vs. Pip's Journal, item thumbnail slot boxes, quantity badges.
3. **Bookshelf**: Outline library shelves, cover rectangles, story detail ruled line text wires, completion badge cards.
4. **Explore Map**: Grayscale grid schematic map with outline location markers, quest list check/lock icons.
