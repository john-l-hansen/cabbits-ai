export interface Quest {
  id: string;
  title: string;
  description: string;
  placeholder: string;
  initialSaying: string;
  rewardItemId?: string; // Links to items in items.ts
  isLocked: boolean;
  unlockCondition: string;
  locationId?: string;
}

export const QUESTS: Record<string, Quest> = {
  notice_one_thing: {
    id: "notice_one_thing",
    title: "Find the Silver Acorn",
    description: "Look around the room and study the ancient oak floorboards. Can you find where Moss hid the rare Silver Acorn?",
    placeholder: "I noticed a slightly loose oak plank near the dresser. Underneath it was a tiny silver shell...",
    initialSaying: "“We can start small. Curiosity usually does. Tell me about any object in the room.”",
    rewardItemId: "silver_acorn",
    isLocked: false,
    unlockCondition: "",
  },
  watch_ripples: {
    id: "watch_ripples",
    title: "Watch the Water Ripples",
    description: "Walk over to Crescent Pond. Watch the ripples on the water. What patterns do they make?",
    placeholder: "I noticed that when a raindrop hits the center, it forms concentric rings expanding outwards in perfect circles...",
    initialSaying: "“Water carries reflections and secrets. Let's study how the waves dance on the surface.”",
    rewardItemId: "feather",
    isLocked: false,
    unlockCondition: "",
  },
  count_flowers: {
    id: "count_flowers",
    title: "Count the Wildflowers",
    description: "Walk into the Green Meadow and study the wildflowers. Pick a group of colors and describe how they cluster.",
    placeholder: "I observed a cluster of five yellow buttercups growing tight against a purple clover stem...",
    initialSaying: "“Meadows are full of numbers! Let's count how nature clusters its colors.”",
    rewardItemId: "lantern",
    isLocked: false,
    unlockCondition: "",
  },
  wise_owl: {
    id: "wise_owl",
    title: "Speak to the Wise Owl",
    description: "Seek out the Wise Owl perched on the High Branch. Ask him for an riddle about the forest's age.",
    placeholder: "The Wise Owl whispered that the forest is as old as the first acorn, yet as young as this morning's dew...",
    initialSaying: "“Owl conversation is always a riddle. Be very respectful!”",
    isLocked: true,
    unlockCondition: "Requires 1 Insight",
  },
  tidy_tunnel: {
    id: "tidy_tunnel",
    title: "Tidy up the Tunnel",
    description: "Help Pip sweep the entrance tunnel clean and stack the glowing lichen jars neatly along the rock shelf.",
    placeholder: "I swept the pine needles out and sorted the green lichen jars from brightest to dimmest...",
    initialSaying: "“A tidy burrow makes for a tidy mind. Let's stack the glowing jars together!”",
    isLocked: true,
    unlockCondition: "Requires 1 Insight",
  },
  decipher_rune: {
    id: "decipher_rune",
    title: "Decipher the Rune",
    description: "Examine the glowing stone tablet in the back of the Secret Library. Translate the engraved signs.",
    placeholder: "The rune says: 'True wisdom lies not in knowing all, but in wondering always'...",
    initialSaying: "“These runes date back to the early Cabbits. Let's translate the stone carvings.”",
    isLocked: true,
    unlockCondition: "Requires 2 Insights",
  },
};
