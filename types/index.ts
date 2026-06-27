export type CompanionTemperament = "gentle" | "curious" | "playful" | "focused";

export type Companion = {
  id: string;
  name: string;
  temperament: CompanionTemperament;
  createdAt: string;
};

export type CompanionMemory = {
  id: string;
  companionId: string;
  content: string;
  questId: string;
  createdAt: string;
};
