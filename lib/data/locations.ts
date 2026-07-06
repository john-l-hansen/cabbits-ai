import { Location } from "@/types";

export const LOCATIONS: Record<string, Location> = {
  pond: {
    id: "pond",
    name: "Crescent Pond",
    description: "A calm, reflective body of water. Golden lilies float on the surface, catching ripples of wind.",
    pinEmoji: "🌧️",
    top: "17.5%",
    left: "36.8%",
    questIds: ["watch_ripples"],
  },
  meadow: {
    id: "meadow",
    name: "Oak Forest",
    description: "A sprawling field of tall grasses and bright wildflowers. Home to hummingbirds and sweet clover.",
    pinEmoji: "🌸",
    top: "19.0%",
    left: "85.4%",
    questIds: ["count_flowers"],
  },
  forest: {
    id: "forest",
    name: "Little Bridge",
    description: "A dense, mystical woodland where the ancient oaks whisper secrets to those who listen closely.",
    pinEmoji: "🌳",
    top: "52.0%",
    left: "62.3%",
    questIds: ["notice_one_thing", "wise_owl"],
  },
  burrow: {
    id: "burrow",
    name: "Pip's Burrow",
    description: "A cozy underground home with warm lanterns and comfortable tunnels dug beneath the tree roots.",
    pinEmoji: "🏡",
    top: "77.0%",
    left: "36.8%",
    questIds: ["tidy_tunnel"],
  },
  library: {
    id: "library",
    name: "Secret Library",
    description: "An ancient stone structure hidden behind ivy walls. The shelves contain dusty volumes of forgotten lore.",
    pinEmoji: "🏛️",
    top: "82.0%",
    left: "86.5%",
    questIds: ["decipher_rune"],
  },
};
