export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji representing the item
  type: "consumable" | "collectible";
  locationOrigin: string;
}

export const ITEMS: Record<string, Item> = {
  carrot: {
    id: "carrot",
    name: "Carrot Snack",
    description: "A sweet, crunchy orange carrot grown in the rich soils of the valley. A favorite treat for hungry Cabbits.",
    icon: "🥕",
    type: "consumable",
    locationOrigin: "Pip's Burrow",
  },
  feather: {
    id: "feather",
    name: "Golden Crest Feather",
    description: "A soft, shimmering golden feather dropped by a migrating valley swift. It catches the sunlight beautifully.",
    icon: "🪶",
    type: "collectible",
    locationOrigin: "Crescent Pond",
  },
  lantern: {
    id: "lantern",
    name: "Brass Pocket Lantern",
    description: "A small, hand-crafted brass lantern emitting a warm amber glow. Perfect for lighting dark forest pathways.",
    icon: "🏮",
    type: "collectible",
    locationOrigin: "Green Meadow",
  },
  silver_acorn: {
    id: "silver_acorn",
    name: "Silver Oak Acorn",
    description: "A rare, metallic silver acorn dropped by the oldest oak tree in the valley. Highly valued by forest scholars.",
    icon: "🌰",
    type: "collectible",
    locationOrigin: "Oak Forest",
  },
};
