export type CompanionTemperament = "gentle" | "curious" | "playful" | "focused";

export type CompanionMood = "idle" | "hungry" | "sleeping" | "happy";
export type CompanionLocation = "rug" | "bed" | "table";

export type Companion = {
  id: string;
  name: string;
  temperament: CompanionTemperament;
  curiosity: number;
  insightsCount: number;
  carrotCoins: number;
  cabbitMood: CompanionMood;
  cabbitLocation: CompanionLocation;
  createdAt: string;
  inventory: string[];
};

export type CompanionMemory = {
  id: string;
  companionId: string;
  content: string;
  questId: string;
  createdAt: string;
};

export type BookCategory = "stories" | "logic" | "math" | "language" | "science" | "creativity";

export type Book = {
  id: string;
  title: string;
  category: BookCategory;
  coverGradient: string;
  coverEmoji: string;
  ageRange: string;
  readingTime: string;
  skills: string[];
  description: string;
  isNew?: boolean;
  isLocked?: boolean;
  progress: number;
  isFavorite: boolean;
};

export type Item = {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "consumable" | "collectible";
  locationOrigin: string;
};

