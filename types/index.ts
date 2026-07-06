export type CompanionTemperament = "gentle" | "curious" | "playful" | "focused";

export type CompanionMood = "idle" | "hungry" | "sleeping" | "happy";
export type CompanionLocation = "rug" | "bed" | "table";

export type Companion = {
  id: string;
  name: string;
  temperament: CompanionTemperament;
  level: number;
  xp: number;
  health: number;
  learning: number;
  kindness: number;
  energy: number;
  curiosity: number;
  insightsCount: number;
  carrotCoins: number;
  cabbitMood: CompanionMood;
  cabbitLocation: CompanionLocation;
  createdAt: string;
  inventory: string[];
  interests: Record<string, number>;
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
  type: "consumable" | "collectible" | "equipment";
  locationOrigin: string;
  image?: string;
};

export type DraftObject = {
  id: string;
  companionId: string;
  type: "item" | "quest";
  objectId: string;
  data: any;
  status: "draft" | "approved" | "discarded";
  createdAt: string;
};

export type JournalEntry = {
  id: string;
  companionId: string;
  topic: string;
  summary: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};
export interface QuestChoice {
  id: string;
  type: "logical" | "verbal" | "practical";
  text: string;
  description: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  placeholder: string;
  initialSaying: string;
  rewardItemId?: string;
  isLocked: boolean;
  unlockCondition: string;
  locationId?: string;
  poiId?: string;
  choices?: QuestChoice[];
  xpReward?: number;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  pinEmoji: string;
  top: string;
  left: string;
  questIds: string[];
}

