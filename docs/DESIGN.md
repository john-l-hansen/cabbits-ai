# Design Direction: The Handcrafted Digital Toy

Cabbits is designed as a **handcrafted digital toy** rather than a traditional game. Every visual asset, interface card, and motion curve must reinforce the feeling that the user is interacting with a tiny, physical world assembled lovingly by hand.

---

## 1. Visual Materials & Layering

The visual language emphasizes tactile construction, soft organic forms, and warm materials.

### Tactile Cues & Materials
*   **Inspirations**: Paper dolls, felt boards, wooden toys, clay miniatures, children's picture books.
*   **Forms**: Soft shapes, slightly rounded corners (representing sand-smoothed wood or cut cardboard), and friendly proportions.
*   **Outlines**: Crisp, ink-style strokes (`border-4 border-black`) that resemble hand-drawn illustrations in a pop-up book.
*   **Imperfections**: Avoid sterile, perfectly clean lines or cold corporate gradients. Objects should look slightly offset, assembled, or hand-painted.

### Layered Scene Composition
*   Scenes are constructed like a cardboard shadowbox.
*   **Background Layer**: Relatively static cardboard backdrops with warm, neutral tones.
*   **Interactive Layer**: Modular, independent cardboard pieces (like a bed, a bowl, or a tree) that can be manipulated or tapped.
*   **Living Layer**: Characters rendered as upright vertical billboard cutouts.
*   **UI HUD**: Designed to look like physical bookmark tags, sticker labels, felt buttons, or wooden plaques floating above the scene.

---

## 2. Motion & Interactions (The Physics of Play)

Movement should feel physical, deliberate, and response-driven rather than automated.

### The Rest Budget
*   **Default State**: The world spends $99\%$ of its time completely still. Avoid constant particle loops, blinking widgets, or continuous background idle loops.
*   **Presence Resonance**: Acknowledging the user's presence gently. When the user's cursor hovers near an interactive element, the item sways or bounces slightly—proving it is "listening" to their attention.

### Puppet & Stop-Motion Physics
*   **Cardboard Puppetry**: Interactive panels and cutout characters sway from a single pin pivot point (using rotation pivots) rather than complex skeletal deformation.
*   **Hop Frame-Swaps**: Character traversal (hopping from tile to tile) is represented by discrete frame swaps (like 16-bit sprites or stop-motion frames). When Pip jumps, he shifts to a designated airborne sprite mid-air, landing with a spring-bouncy settle on the target.
*   **Tactile Clicking**: Buttons physically press down, shifting coordinates and shrinking their flat shadows:
    *   *Hover*: Translate up-left (`translate-x-[-1px] translate-y-[-1px]`), expanding the offset shadow.
    *   *Press*: Translate down-right (`translate-x-[3px] translate-y-[3px]`), flattening the shadow to indicate impact.

---

## 3. Interface Components (The Pop-up Book HUD)

The user interface should feel like part of the toy box.

*   **Dialogue Boxes**: Styled as hand-inked speech clouds or page flaps with a rounded tail pointer and thick outlines. Use a typewriter layout speed (20ms/char) to mimic reading a physical storybook.
*   **Navigation Tabs**: Represented as page-index dividers or sticker tabs lining the borders of the viewport.
*   **Status Gauges**: Replaced with cell-based segmented health/mana meters representing physical colored tokens (e.g. green wooden blocks for energy, gold/yellow coins).
