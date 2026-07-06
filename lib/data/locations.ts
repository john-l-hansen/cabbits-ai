import { Location } from "@/types";

export const LOCATIONS: Record<string, Location> = {
  pond: {
    id: "pond",
    name: "Crescent Pond",
    description: "A calm, reflective body of water. Golden lilies float on the surface, catching ripples of wind.",
    pinEmoji: "🌧️",
    top: "17.5%",
    left: "36.8%",
    questIds: ["pond_lilies", "pond_ripples", "pond_grove"],
  },
  meadow: {
    id: "meadow",
    name: "Oak Forest",
    description: "A sprawling field of tall grasses and bright wildflowers. Home to hummingbirds and sweet clover.",
    pinEmoji: "🌸",
    top: "19.0%",
    left: "85.4%",
    questIds: ["meadow_buttercups", "meadow_clover", "meadow_hummingbird"],
  },
  forest: {
    id: "forest",
    name: "Little Bridge",
    description: "A dense, mystical woodland where the ancient oaks whisper secrets to those who listen closely.",
    pinEmoji: "🌳",
    top: "52.0%",
    left: "62.3%",
    questIds: ["forest_oak", "forest_perch", "forest_undergrowth"],
  },
  burrow: {
    id: "burrow",
    name: "Pip's Burrow",
    description: "A cozy underground home with warm lanterns and comfortable tunnels dug beneath the tree roots.",
    pinEmoji: "🏡",
    top: "77.0%",
    left: "36.8%",
    questIds: ["burrow_entrance", "burrow_lichen", "burrow_tunnels"],
  },
  library: {
    id: "library",
    name: "Secret Library",
    description: "An ancient stone structure hidden behind ivy walls. The shelves contain dusty volumes of forgotten lore.",
    pinEmoji: "🏛️",
    top: "82.0%",
    left: "86.5%",
    questIds: ["library_ivy", "library_shelves", "library_tablet"],
  },
};
