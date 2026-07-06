import { Quest } from "@/types";

// Dynamic templates with variables that can be randomized
const QUEST_TEMPLATES: Record<string, (vars: { count: number; name: string }) => Quest> = {
  pond_lilies: (vars) => ({
    id: "pond_lilies",
    title: "Unlocking the Blue Dome Door",
    description: `Help Pip inspect the decorative blue front door of the grass-dome house, checking the lock tumbler and the ${vars.count} round brass rivets.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“This round blue door is locked shut. Let's see if we can find a way to open it, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "pond",
    poiId: "Golden Lilies",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Solve the Keyhole Puzzle",
        description: "Analyze the pin configuration inside the brass lock to match the tumbler grooves."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Knock and Call for Moss",
        description: "Knock gently on the round wooden door and ask if anyone is home in a friendly voice."
      },
      {
        id: "practical",
        type: "practical",
        text: "Oil the Door Handle",
        description: "Apply natural oil to the rusty brass handle and check the door alignment."
      }
    ]
  }),
  pond_ripples: (vars) => ({
    id: "pond_ripples",
    title: "Examine the Floating Lily Pads",
    description: `Observe the green lily pads floating on the pond surface, counting ${vars.count} ripples surrounding them.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Look at how the lily pads float so peacefully, ${vars.name}! What should we check?”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "pond",
    poiId: "Center Ripples",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Measure Concentric Circles",
        description: "Calculate the distance and mathematical intervals between each expanding ripple ring."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Sing a Song to the Water",
        description: "Compose a short, soft poem about the peaceful reflections on the water's surface."
      },
      {
        id: "practical",
        type: "practical",
        text: "Retrieve a Floating Leaf",
        description: "Use a long wooden branch to pull a loose lily pad closer to inspect its underside."
      }
    ]
  }),
  pond_grove: (vars) => ({
    id: "pond_grove",
    title: "Inspect the Wooden Garden Bench",
    description: `Check the wooden bench on the forest path, checking for loose wood slats and verifying the stability of its ${vars.count} support frames.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“This bench is a perfect spot to sit and rest. Let's make sure it's stable, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "pond",
    poiId: "East Grove",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Analyze Bench Load Balance",
        description: "Check if the bench legs are level on the dirt path and calculate load stability."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Carve a Friend Greeting",
        description: "Inscribe a tiny smiley face or welcoming traveler marker into the armrest."
      },
      {
        id: "practical",
        type: "practical",
        text: "Tighten the Frame Screws",
        description: "Use a screwdriver to tighten the loose wood screws on the backrest."
      }
    ]
  }),
  meadow_buttercups: (vars) => ({
    id: "meadow_buttercups",
    title: "Count the Buttercups",
    description: `A patch of ${vars.count} bright yellow buttercups has opened in the sunlight. Pip wants to study them.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Look at all the yellow faces looking up at the sky! Let's examine them, ${vars.name}.”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "meadow",
    poiId: "Buttercup Patch",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Petal Multiplication",
        description: `Count the petals on one stem and multiply it by the ${vars.count} stems to find the total petal count.`
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Translate Honeybee Cues",
        description: "Watch the bees hovering and write down a guide to help younger companions locate nectar."
      },
      {
        id: "practical",
        type: "practical",
        text: "Soil Health Inspection",
        description: "Examine the damp clay soil around the roots and add rich compost to keep them healthy."
      }
    ]
  }),
  meadow_clover: (vars) => ({
    id: "meadow_clover",
    title: "Identify Clover Clusters",
    description: `A dense patch containing ${vars.count} clover stems is growing along the clearing. Find a way to catalogue them.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Clovers are so soft and green. Shall we explore the patch, ${vars.name}?”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "meadow",
    poiId: "Purple Clover Clusters",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Find Rare Four-Leaf Stems",
        description: `Use a grid search pattern to scan the ${vars.count} stems and calculate the mathematical odds of a mutation.`
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Share Clover Lore",
        description: "Teach Pip the legend of the ancient Cabbits who used clovers to brew healing potions."
      },
      {
        id: "practical",
        type: "practical",
        text: "Weed out Brambles",
        description: "Carefully prune away the sharp, thorny brambles that are starting to crowd the patch."
      }
    ]
  }),
  meadow_hummingbird: (vars) => ({
    id: "meadow_hummingbird",
    title: "Help the Hummingbirds",
    description: `A small hummingbird has built a nest in a wild rosebush, but the wind is blowing at ${vars.count} knots.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Oh, the poor birds are struggling against the wind gusts. Let's help them, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "meadow",
    poiId: "Hummingbird Nest",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Analyze Flight Patterns",
        description: "Observe the wing flap frequency to calculate how the birds counter the wind vectors."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Reassure with Soft Calls",
        description: "Chirp softly to calm the baby birds and show them we are friendly neighbors."
      },
      {
        id: "practical",
        type: "practical",
        text: "Construct Windbreak Screen",
        description: "Gather thick fern fronds and tie them together to shield the nest from heavy wind gusts."
      }
    ]
  }),
  forest_oak: (vars) => ({
    id: "forest_oak",
    title: "Pebbles on the River Bed",
    description: `The calm river bed displays a collection of ${vars.count} flat, polished pebbles. Inspect them.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Look at all these smooth pebbles polished by the water, ${vars.name}! Let's examine them!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "forest",
    poiId: "River Bed",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Sort Pebbles by Density",
        description: "Categorize the pebbles by geological layers and count the distribution of granite vs quartz."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Write River Bed Tales",
        description: "Recount the history of how this river bed was formed to Pip over a cozy tea."
      },
      {
        id: "practical",
        type: "practical",
        text: "Sift the Sand and Gravel",
        description: "Use a fine mesh sieve to sift the sand and isolate smooth river stones for path building."
      }
    ]
  }),
  forest_perch: (vars) => ({
    id: "forest_perch",
    title: "Inspect the Old Wooden Bridge",
    description: `Help Pip inspect the wooden planks of the old bridge span across the river, measuring ${vars.count} feet long.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“This old wooden bridge helps everyone cross the river safely. Let's make sure it's secure, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "forest",
    poiId: "Bridge",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Analyze Truss Forces",
        description: "Calculate the stress and load distribution across the main support trusses of the bridge."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Carve Crossing Runes",
        description: "Engrave clear safety symbols and welcoming traveler markers into the wooden handrails."
      },
      {
        id: "practical",
        type: "practical",
        text: "Tighten Support Bolts",
        description: "Use a wrench to tighten loose bolts and secure weak wooden planks along the walkway."
      }
    ]
  }),
  forest_undergrowth: (vars) => ({
    id: "forest_undergrowth",
    title: "Track River Current Velocity",
    description: `The flowing river runs at a speed of ${vars.count} meters per minute. Analyze the water currents.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Listen to the rushing water! It's so fast today, ${vars.name}! What should we look for?”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "forest",
    poiId: "River",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Measure Flow Rate Dynamics",
        description: "Time a floating leaf over a distance to calculate the average water current speed."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Compose a River Song",
        description: "Listen to the rhythm of the rushing water and sing a song about flowing rivers."
      },
      {
        id: "practical",
        type: "practical",
        text: "Clear Driftwood Obstacles",
        description: "Sift out large floating driftwood logs to keep the main channel clear and safe for forest animals."
      }
    ]
  }),
  burrow_entrance: (vars) => ({
    id: "burrow_entrance",
    title: "Tune the Alcove Instruments",
    description: `Help Pip tune the acoustic guitar and piano in the warm lantern alcove, adjusting ${vars.count} loose string pegs.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“The acoustic instruments in this cozy music nook sound a bit out of tune. Let's fix them, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "burrow",
    poiId: "Warm Lantern Entrance",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Calculate Frequency Harmonics",
        description: "Measure vibration pitches and calculate the correct tension frequencies for each string."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Sing a Cozy Duet",
        description: "Lead a warm singing warm-up to guide Pip as he matches the pitch of the keys."
      },
      {
        id: "practical",
        type: "practical",
        text: "Wind the Pegs Manually",
        description: "Use the peg-winder tool to carefully tighten the steel strings until they click into standard tuning."
      }
    ]
  }),
  burrow_lichen: (vars) => ({
    id: "burrow_lichen",
    title: "Organize Lichen & Potted Plants",
    description: `Help Pip organize ${vars.count} books and green potted plants on the high wooden storage shelf.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Our shelf has books and plants all mixed up. Let's make it look clean and cozy, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "burrow",
    poiId: "Lichen Storage Shelf",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Arrange by Height and Subject",
        description: "Categorize books by subject and arrange the plants from tallest to shortest."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Label the Plant Species",
        description: "Write neat calligraphy tags identifying the different forest lichen and moss types."
      },
      {
        id: "practical",
        type: "practical",
        text: "Dust Shelves and Water Plants",
        description: "Use a soft feather duster to clean the wood and water the small potted ferns."
      }
    ]
  }),
  burrow_tunnels: (vars) => ({
    id: "burrow_tunnels",
    title: "Set Up the Living Room TV",
    description: `The retro television screen displays static. Configure the antenna and console wiring to display a game running at ${vars.count} frames per second.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Let's get this gaming setup running on our cozy retro TV, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "burrow",
    poiId: "Comfortable Tunnels",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Trace Console Signal Flow",
        description: "Map the input/output ports and calculate the correct signal frequency channels."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Recount retro Game Lore",
        description: "Tell Pip a story about the classic arcade games played by Cabbits in the old times."
      },
      {
        id: "practical",
        type: "practical",
        text: "Adjust the Wire Connections",
        description: "Plug the color-coded composite cables into the correct TV jacks and adjust the rabbit-ear antenna."
      }
    ]
  }),
  library_ivy: (vars) => ({
    id: "library_ivy",
    title: "Ivy Overgrowth Clearance",
    description: `Thick ivy has covered a block of ${vars.count} stone tiles on the ancient stone library wall.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“The ivy is blocking the old carvings. Let's clear it away, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "library",
    poiId: "Ivy Stone Walls",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Map Grid Coordinates",
        description: `Construct a 2D coordinate grid over the ${vars.count} tiles to trace the hidden stone seams.`
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Read Ivy Growth Runes",
        description: "Recite the traditional ivy growth poem to locate the key joints where roots are loose."
      },
      {
        id: "practical",
        type: "practical",
        text: "Prune Structural Roots",
        description: "Use pruning shears to cut the central thick ivy roots without damaging the historic stones."
      }
    ]
  }),
  library_shelves: (vars) => ({
    id: "library_shelves",
    title: "Catalog the Tomes",
    description: `A stack of ${vars.count} ancient scrolls and book volumes is lying unsorted on the table.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“So much forgotten knowledge here! Let's arrange them neatly, ${vars.name}.”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "library",
    poiId: "Forgotten Lore Shelves",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Sort Chronologically",
        description: `Sort the ${vars.count} scrolls by historical cycles using their seal stamps.`
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Translate Title Dialect",
        description: "Translate the old titles from ancient Cabbits dialect and document them in the library ledger."
      },
      {
        id: "practical",
        type: "practical",
        text: "Dust and Restore Scrolls",
        description: "Use a soft dry feather brush to remove dust and wrap worn scrolls in protective linen cases."
      }
    ]
  }),
  library_tablet: (vars) => ({
    id: "library_tablet",
    title: "Decipher the Rune",
    description: `The glowing stone tablet features ${vars.count} engraved glyph symbols. Decode them.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“These runes date back to the early Cabbits. Let's study them, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "library",
    poiId: "Glowing Rune Tablet",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Decode Numerical Cypher",
        description: "Examine the geometric line intersections of the symbols to extract the cypher code."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Inscribe Ancient Lyrics",
        description: "Recite the corresponding verses of the ancient Cabbits saga that mention these symbols."
      },
      {
        id: "practical",
        type: "practical",
        text: "Make Charcoal Rubbing",
        description: "Place a thin parchment sheet over the slate and rub charcoal to capture the grooves clearly."
      }
    ]
  })
};

// Generates randomized quests based on locationId
export function getRandomizedQuestSet(locationId: string, companionName: string): Record<string, Quest> {
  const idsMap: Record<string, string[]> = {
    pond: ["pond_lilies", "pond_ripples", "pond_grove"],
    meadow: ["meadow_buttercups", "meadow_clover", "meadow_hummingbird"],
    forest: ["forest_oak", "forest_perch", "forest_undergrowth"],
    burrow: ["burrow_entrance", "burrow_lichen", "burrow_tunnels"],
    library: ["library_ivy", "library_shelves", "library_tablet"]
  };

  const templates = idsMap[locationId] || [];
  const quests: Record<string, Quest> = {};

  templates.forEach((templateId) => {
    const generator = QUEST_TEMPLATES[templateId];
    if (generator) {
      // Randomize values to make each quest set feel unique but consistent in tone
      const count = Math.floor(Math.random() * 8) + 5; // e.g. 5 to 12
      quests[templateId] = generator({ count, name: companionName });
    }
  });

  return quests;
}

// Default export showing initial quests
export const QUESTS: Record<string, Quest> = {
  ...getRandomizedQuestSet("pond", "Pip"),
  ...getRandomizedQuestSet("meadow", "Pip"),
  ...getRandomizedQuestSet("forest", "Pip"),
  ...getRandomizedQuestSet("burrow", "Pip"),
  ...getRandomizedQuestSet("library", "Pip")
};
