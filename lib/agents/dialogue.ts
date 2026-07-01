import { Companion, JournalEntry } from "@/types";

// Dynamic Personality Greetings Pool
const PERSONALITY_GREETINGS: Record<
  string, // Temperament
  {
    sunny: string[];
    rainy: string[];
    snowy: string[];
    standard: string[];
  }
> = {
  curious: {
    sunny: [
      "The sun is shining! I wonder why shadows grow longer in the afternoon?",
      "It's so bright! How do plants turn this sunlight into sweet sugar?",
      "Perfect sunny day to look for tiny bugs in the grass. Shall we explore?"
    ],
    rainy: [
      "Listen to the rain tap! Where do the water drops go when they seep into the soil?",
      "Rainy days are perfect for thinking. Let's study how clouds form!",
      "I love watching raindrops stream down the window. Each one follows a unique path."
    ],
    snowy: [
      "Look at the snow! Why is every single snowflake shaped like a hexagon?",
      "It's freezing! I wonder how the fish survive beneath the frozen pond water?",
      "Everything is white! How do animals find food when the valley is covered in snow?"
    ],
    standard: [
      "I was just wondering: why do birds fly in V-shapes? Do you know?",
      "Let's look at something simple today and find its hidden secrets!",
      "A new day means new questions! What are you curious about today?"
    ]
  },
  gentle: {
    sunny: [
      "The warm sun feels so peaceful on my ears. It's a lovely day to rest together.",
      "The sunshine is so soft today. I hope the wildflowers are happy.",
      "Shall we sit near the window and enjoy the warm breeze?"
    ],
    rainy: [
      "The rain has a very calming sound. It feels so cozy to stay inside and read.",
      "Let's make sure the little birds outside have a safe dry branch to sit on.",
      "The raindrops are watering the garden. Nature is taking a quiet bath."
    ],
    snowy: [
      "The snow is falling so softly, like tiny cotton balls. Let's stay warm.",
      "It is cold outside. I'm glad we have a cozy room to share.",
      "The valley looks so peaceful under a blanket of white snow."
    ],
    standard: [
      "I'm so glad we are friends. Let's take our time and learn gently today.",
      "How are you feeling today? Remember to take a deep breath.",
      "I'm here beside you. Whatever we study today, we will do it together."
    ]
  },
  playful: {
    sunny: [
      "Woohoo, sunshine! Let's go run circles in the meadow and count clovers!",
      "The sun is out! If I shadow-box my silhouette, do you think I can win?",
      "Perfect day for a carrot hunt! I bet I can find one hidden in the grass."
    ],
    rainy: [
      "Raindrops! I want to splash in the puddles! Can we?",
      "Tapping on the roof sounds like a drum roll! What game should we play next?",
      "Even if it's raining, we can have a giant indoor adventure!"
    ],
    snowy: [
      "Snow! Let's build a snow-rabbit! Or have a snowball fight!",
      "Brrr, it's chilly! Running around really fast is the best way to stay warm!",
      "Look at the frost on the window—it looks like a slide!"
    ],
    standard: [
      "Let's make learning a game! Ask me a fun question!",
      "I've got so much energy today! Let's do some ear-wiggles!",
      "If we count to ten backwards in rabbit-talk, does it sound like squeaks?"
    ]
  },
  focused: {
    sunny: [
      "Clear skies provide excellent lighting for detailed visual observation.",
      "The solar cycle is at its peak. A productive time to review our maps.",
      "The sunlight helps us see fine textures. Let's choose a book to study."
    ],
    rainy: [
      "The atmospheric pressure is dropping. Rainy days minimize distractions.",
      "Let's use this quiet rain interval to log our observations systematically.",
      "A perfect setting to focus our attention on reading without interruption."
    ],
    snowy: [
      "Winter weather structures our daily routine. Let's review our libraries.",
      "The cold keeps us indoors. Perfect for concentrated problem-solving.",
      "Let's focus on translating the stone runes while the snow falls outside."
    ],
    standard: [
      "Let's establish a clear goal for our study session today.",
      "Concentration is the key to deep understanding. What shall we analyze?",
      "One subject at a time. Let's review our active quests and make progress."
    ]
  }
};

// Generates dynamic greetings on Home screen
export function getCompanionGreeting(
  companion: Companion,
  weather: "sunny" | "rainy" | "snowy",
  timeOfDay: "morning" | "afternoon" | "evening" | "night",
  journalEntries: JournalEntry[] = []
): string {
  // 1. Sleeping state override
  if (companion.cabbitMood === "sleeping") {
    const sleepQuotes = [
      "Zzz... dreaming of sweet clover fields...",
      "Zzz... giant crunchy orange carrots...",
      "Zzz... chasing golden butterflies in the sunshine...",
      "Zzz... soft breathing... twitching ears..."
    ];
    const idx = Math.floor(Math.random() * sleepQuotes.length);
    return sleepQuotes[idx];
  }

  // 2. Wealthy state override (Coins > 150)
  if (companion.carrotCoins > 150 && Math.random() < 0.25) {
    return `We have collected ${companion.carrotCoins} coins! That is a heavy coin bag. Shall we buy a new adventure in the library?`;
  }

  // 3. Memory Synthesis Reflection Override (25% chance)
  if (journalEntries && journalEntries.length > 0 && Math.random() < 0.25) {
    const entry = journalEntries[Math.floor(Math.random() * journalEntries.length)];
    const thoughts = [
      `I've been reviewing my journal notes on ${entry.topic}... ${entry.summary}`,
      `I was just thinking about our study of ${entry.topic}! Remember? ${entry.summary}`,
      `Nature is so fascinating. My notebook page on ${entry.topic} says: ${entry.summary}`,
      `Look! I drew a little picture next to our ${entry.topic} note: ${entry.summary}`
    ];
    return thoughts[Math.floor(Math.random() * thoughts.length)];
  }

  // 4. Thematic Interest Quest Announcements (20% chance)
  const interests = companion.interests || {};
  if (Math.random() < 0.20) {
    if (interests.mushroom >= 2) {
      return `I noticed we've been observing mushrooms a lot! I prepared a special study quest for us at the Oak Forest. Let's go mapping!`;
    }
    if (interests.space >= 2) {
      return `I've been thinking about the night sky since you observed stars. I prepared a special star mapping quest at the Secret Library!`;
    }
    if (interests.bug >= 2) {
      return `Bugs are so interesting! Since we've been observing insects, I added a special Catching Fireflies quest at the Green Meadow!`;
    }
  }

  // 5. Personality & Weather matching
  const personality = companion.temperament.toLowerCase();
  const pool = PERSONALITY_GREETINGS[personality] || PERSONALITY_GREETINGS.curious;

  // Select pool based on weather
  let selectPool = pool.standard;
  if (weather === "sunny" && Math.random() < 0.7) selectPool = pool.sunny;
  else if (weather === "rainy" && Math.random() < 0.7) selectPool = pool.rainy;
  else if (weather === "snowy" && Math.random() < 0.7) selectPool = pool.snowy;

  const idx = Math.floor(Math.random() * selectPool.length);
  return selectPool[idx];
}

// Generates landmark commentary on Map bottom sheets
export function getLandmarkComment(
  landmarkId: string,
  companion: Companion,
  weather: "sunny" | "rainy" | "snowy"
): string {
  const name = companion.name;
  
  if (landmarkId === "pond") {
    if (weather === "rainy") {
      return `“The rain ripples on Crescent Pond are so neat, ${name}! Look at how the concentric rings expand!”`;
    }
    return `“Crescent Pond looks so peaceful today. Do you think the golden water lilies are sleeping beneath the surface?”`;
  }

  if (landmarkId === "meadow") {
    if (weather === "sunny") {
      return `“All the yellow buttercups are open in the sunshine! Let's walk over and count how they group together!”`;
    }
    return `“The grass in the Green Meadow feels so wet and cool. Let's see if we can find any sweet clover patches!”`;
  }

  if (landmarkId === "forest") {
    return `“The Oak Forest is so old and ancient. If we look closely at the bark, do you think we can find where Moss hides his acorns?”`;
  }

  if (landmarkId === "burrow") {
    return `“This is my home! It's so warm and comfortable under the tree roots. I like keeping the lanterns lit.”`;
  }

  if (landmarkId === "library") {
    return `“The Secret Library smells like old books and stone walls. Let's look for ancient signs and runes!”`;
  }

  return `“What a mysterious place! Let's explore and see what we can learn together.”`;
}
