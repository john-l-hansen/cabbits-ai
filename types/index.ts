export type CompanionTemperament = "gentle" | "curious" | "playful" | "focused";

export type Companion = {
  id: string;
  name: string;
  temperament: CompanionTemperament;
  createdAt: string;
};
