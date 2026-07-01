export interface Location {
  id: string;
  name: string;
  description: string;
  pinEmoji: string;
  top: string; // CSS position top
  left: string; // CSS position left
  questIds: string[]; // references quest IDs in quests.ts
}

export const LOCATIONS: Record<string, Location> = {
  pond: {
    id: "pond",
    name: "Crescent Pond",
    description: "A calm, reflective body of water. Golden lilies float on the surface, catching ripples of wind.",
    pinEmoji: "🌧️",
    top: "28%",
    left: "28%",
    questIds: ["watch_ripples"],
  },
  meadow: {
    id: "meadow",
    name: "Green Meadow",
    description: "A sprawling field of tall grasses and bright wildflowers. Home to hummingbirds and sweet clover.",
    pinEmoji: "🌸",
    top: "48%",
    left: "48%",
    questIds: ["count_flowers"],
  },
  forest: {
    id: "forest",
    name: "Oak Forest",
    description: "A dense, mystical woodland where the ancient oaks whisper secrets to those who listen closely.",
    pinEmoji: "🌳",
    top: "28%",
    left: "75%",
    questIds: ["notice_one_thing", "wise_owl"],
  },
  burrow: {
    id: "burrow",
    name: "Pip's Burrow",
    description: "A cozy underground home with warm lanterns and comfortable tunnels dug beneath the tree roots.",
    pinEmoji: "🏡",
    top: "70%",
    left: "75%",
    questIds: ["tidy_tunnel"],
  },
  library: {
    id: "library",
    name: "Secret Library",
    description: "An ancient stone structure hidden behind ivy walls. The shelves contain dusty volumes of forgotten lore.",
    pinEmoji: "🏛️",
    top: "76%",
    left: "28%",
    questIds: ["decipher_rune"],
  },
};
