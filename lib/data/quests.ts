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
    poiId: "Blue Dome Door",
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
    poiId: "Lily Pads",
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
    poiId: "Garden Bench",
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
    title: "The Hollow Treehouse",
    description: `Help Pip inspect the round wooden door and ${vars.count} windows carved into the roots of the ancient hollow treehouse.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Look at this cozy treehouse! Let's see if anyone is inside, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "meadow",
    poiId: "Hollow Tree",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Calculate Ring Patterns",
        description: "Examine the wood grain around the door frame to estimate the tree's growth rings."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Knock and Say Hello",
        description: "Call out friendly greetings through the round window to introduce Pip to the resident."
      },
      {
        id: "practical",
        type: "practical",
        text: "Clean the Welcome Steps",
        description: "Sweep away loose pine needles and forest moss from the front stone steps."
      }
    ]
  }),
  meadow_clover: (vars) => ({
    id: "meadow_clover",
    title: "The Hollow Log Tunnel",
    description: `A hollow wooden log is lying on the path, measuring ${vars.count} inches wide. Inspect what is inside.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“This log looks like a secret tunnel, ${vars.name}! Should we peek inside?”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "meadow",
    poiId: "Hollow Log",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Measure Inner Volume",
        description: "Estimate the length and internal diameter of the log tunnel using a twigs grid."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Whisper into the Log",
        description: "Whisper a soft eco-song into the opening to check for friendly echoes."
      },
      {
        id: "practical",
        type: "practical",
        text: "Clear Blocked Leaves",
        description: "Use a stick to clear out damp leaves and dry dirt blocking the log passage."
      }
    ]
  }),
  meadow_hummingbird: (vars) => ({
    id: "meadow_hummingbird",
    title: "Acorns by the Tree Stump",
    description: `Help Pip sort a pile of ${vars.count} acorns scattered around the base of the old tree stump.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Look at all these acorns! The squirrels must have dropped them, ${vars.name}. Let's help organize them.”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "meadow",
    poiId: "Tree Stump",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Sort by Acorn Caps",
        description: "Categorize the acorns into mathematical groups based on whether their caps are attached."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Compose an Acorn Rhyme",
        description: "Tell a short squirrel tale about storing food for the upcoming winter."
      },
      {
        id: "practical",
        type: "practical",
        text: "Gather in a Pile",
        description: "Collect the scattered acorns and pile them neatly in the hollow at the base of the stump."
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
    poiId: "Music Alcove",
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
    poiId: "Storage Shelf",
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
    poiId: "Living Room TV",
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
    title: "The Curiosity Study Desk",
    description: `Help Pip inspect the green desk lamp, the warm steaming mug, and the ${vars.count} open notebooks on the wooden study desk.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“This desk is so cozy, ${vars.name}! Look at Pip's notebooks—let's examine what he wrote.”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "library",
    poiId: "Study Desk",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Verify Ink Formulas",
        description: "Calculate the dilution ratio of water to black pigment for the permanent ink bottle."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Read the Wisdom Signs",
        description: "Translate the cursive scripts on the wall signs: 'Curiosity is the key' and 'Knowledge grows when shared.'"
      },
      {
        id: "practical",
        type: "practical",
        text: "Trim the Desk Lamp Wick",
        description: "Carefully trim the wick of the oil lantern next to the desk to keep the flame bright and clean."
      }
    ]
  }),
  library_shelves: (vars) => ({
    id: "library_shelves",
    title: "Organize the Reading Rug",
    description: `A total of ${vars.count} loose scrolls and scattered books are lying around the blue rug. Help organize them.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Oh, it looks like a big breeze blew all the loose pages off the desk! Let's clean them up, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "library",
    poiId: "Reading Rug",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Sort Pages by Index Number",
        description: "Sort the loose parchment sheets numerically and bind them into a single volume."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Catalog Book Titles",
        description: "Read and write down the titles of the scattered books into the library ledger."
      },
      {
        id: "practical",
        type: "practical",
        text: "Stack Books Neatly",
        description: "Carefully dust each book cover and stack them in neat piles beside the low table."
      }
    ]
  }),
  library_tablet: (vars) => ({
    id: "library_tablet",
    title: "Bluebirds at the Round Window",
    description: `A pair of bluebirds is nesting on the sill of the large round window, chirping at a volume of ${vars.count} decibels. Inspect the window area.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Listen to their sweet songs! The sunbeams shining through are so warm, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "library",
    poiId: "Round Window",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Calculate Angle of Sunbeams",
        description: "Measure the angle of the incoming light beams to calculate the hour of the afternoon."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Translate the Bird Songs",
        description: "Listen closely to the chirps and guess what forest news the bluebirds are sharing."
      },
      {
        id: "practical",
        type: "practical",
        text: "Clear the Window Sill",
        description: "Gently brush away dust, dry leaves, and loose feathers from the wooden window frame."
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
