import { Quest } from "@/types";

// Dynamic templates with variables that can be randomized
const QUEST_TEMPLATES: Record<string, (vars: { count: number; name: string }) => Quest> = {
  pond_lilies: (vars) => ({
    id: "pond_lilies",
    title: "Sort the Lilies",
    description: `A cluster of ${vars.count} floating water lilies is clogging the channel near Crescent Pond. Choose how to help Pip manage them.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“These lilies are beautiful but they grow so fast, ${vars.name}. Let's find a way to group them!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "pond",
    poiId: "Golden Lilies",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Group by Prime Numbers",
        description: `Count the petals on each pad and divide the ${vars.count} lilies into exact mathematical sets.`
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Recite the Lily Poem",
        description: "Speak a gentle forest rhyme to encourage the lily spirits to shift and let water flow."
      },
      {
        id: "practical",
        type: "practical",
        text: "Clear Channel Debris",
        description: "Carefully untangle the lily roots and clear away dry reeds that block the stream."
      }
    ]
  }),
  pond_ripples: (vars) => ({
    id: "pond_ripples",
    title: "Analyze the Ripples",
    description: `A rain shower has started, sending ${vars.count} concentric wave rings across the pond. Investigate their motion.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Water is like a moving mirror, ${vars.name}. Look at how the waves travel!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "pond",
    poiId: "Center Ripples",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Calculate Wave Frequencies",
        description: "Measure the distance between the ripples to find the mathematical pattern of their expansion."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Echo the Wave Song",
        description: "Sing a soft humming tune that matches the rhythm of the drops hitting the water."
      },
      {
        id: "practical",
        type: "practical",
        text: "Measure Float Displacements",
        description: "Drop a floating leaf into the center and observe how the kinetic wave rings push it outwards."
      }
    ]
  }),
  pond_grove: (vars) => ({
    id: "pond_grove",
    title: "Clear the East Grove Path",
    description: `A group of ${vars.count} fallen birch branches is blocking the walkway into the East Grove.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Oh dear, the path is completely blocked. How should we clear it, ${vars.name}?”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "pond",
    poiId: "East Grove",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Sort and Stack by Length",
        description: "Sort the branches by length and stack them in geometric piles to optimize space."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Ask for Beaver Aid",
        description: "Speak with the friendly forest beaver nearby and ask politely if he can help move the heavy logs."
      },
      {
        id: "practical",
        type: "practical",
        text: "Use Leverage Action",
        description: "Find a long sturdy oak limb and use it as a lever to pry the largest blockages off the path."
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
    title: "Oak Bark Patterns",
    description: `The ancient oak tree shows a pattern of ${vars.count} grooves along its trunk. Examine them.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“This oak tree has been standing for hundreds of years. Look at the bark, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "forest",
    poiId: "Ancient Oak Tree",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Calculate Tree Age Curve",
        description: "Measure the depth of the grooves and estimate the trunk growth rate to calculate its age."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Tell the Forest History",
        description: "Read an old story about the woodcutter who spared this majestic oak long ago."
      },
      {
        id: "practical",
        type: "practical",
        text: "Apply Tree Wax Seal",
        description: "Apply a protective natural beeswax sealant to the exposed bark grooves to prevent mold."
      }
    ]
  }),
  forest_perch: (vars) => ({
    id: "forest_perch",
    title: "Build a Nesting Box",
    description: `Help Pip build a wooden nesting box for local bluebirds at a height of ${vars.count} feet on the High Perch.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Let's build a safe, cozy home high up in the branches, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "forest",
    poiId: "High Perch Branch",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Draft Geometric Blueprints",
        description: "Compute the correct structural ratios and angle joints to make a weather-proof design."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Carve Forest Welcome Glyphs",
        description: "Carve friendly, welcoming bird runes on the front door panel to invite local bluebirds."
      },
      {
        id: "practical",
        type: "practical",
        text: "Lash Perch Support System",
        description: "Use sturdy ivy vines and a square knot technique to anchor the nesting box onto the branch."
      }
    ]
  }),
  forest_undergrowth: (vars) => ({
    id: "forest_undergrowth",
    title: "Identify Glowing Mushrooms",
    description: `A collection of ${vars.count} bioluminescent mushrooms has appeared in the forest shadows.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“They glow with such a soft, magical light, ${vars.name}! What should we do?”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "forest",
    poiId: "Whispering Undergrowth",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Classify Spore Spacing",
        description: "Sort the mushroom caps by size and calculate the mathematical spacing of their spore vents."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Inscribe Luminescent Glyphs",
        description: "Transcribe the patterns of light pulses to check if they match ancient Cabbits symbols."
      },
      {
        id: "practical",
        type: "practical",
        text: "Collect Active Spore Prints",
        description: "Press a cap gently onto a dry oak leaf to gather a clean spore print for research."
      }
    ]
  }),
  burrow_entrance: (vars) => ({
    id: "burrow_entrance",
    title: "Burrow Door Alignment",
    description: `The pulley system on the main entry door is unbalanced by ${vars.count} grams. Align the weights.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“The door creaks and shifts when we open it. Let's fix it, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "burrow",
    poiId: "Warm Lantern Entrance",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Balance Counterweight Pulleys",
        description: `Add or subtract gravel weights to balance the pulleys by exactly ${vars.count} grams.`
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Inscribe Cozy Greetings",
        description: "Paint a warm, cheerful welcome sign over the doorway to put visitors at ease."
      },
      {
        id: "practical",
        type: "practical",
        text: "Lubricate Wooden Hinges",
        description: "Apply a layer of linseed oil to the friction joints to completely eliminate the creaking."
      }
    ]
  }),
  burrow_lichen: (vars) => ({
    id: "burrow_lichen",
    title: "Organize Lichen Jars",
    description: `A collection of ${vars.count} jars containing glowing lichen needs sorting on the pantry shelf.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“The jars are all jumbled up. Let's make the shelf look neat, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "burrow",
    poiId: "Lichen Storage Shelf",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Sort by Light Intensity",
        description: `Arrange the ${vars.count} jars in a perfect linear gradient from dimmest green to brightest gold.`
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Label Harvesting Details",
        description: "Label each jar carefully with its harvesting location and name of the gatherer."
      },
      {
        id: "practical",
        type: "practical",
        text: "Build Wooden Spacers",
        description: "Carve custom wooden slats to slot between the jars so they don't roll off the shelf."
      }
    ]
  }),
  burrow_tunnels: (vars) => ({
    id: "burrow_tunnels",
    title: "Reinforce Tunnel Walls",
    description: `A dry sandy patch along the hallway has shifted by ${vars.count} millimeters. Reinforce the wall.`,
    placeholder: "Select your approach below to begin.",
    initialSaying: `“Let's make sure our tunnels are solid and safe dug beneath the roots, ${vars.name}!”`,
    isLocked: false,
    unlockCondition: "",
    locationId: "burrow",
    poiId: "Comfortable Tunnels",
    xpReward: 200,
    choices: [
      {
        id: "logic",
        type: "logical",
        text: "Calculate Pressure Angles",
        description: "Compute the correct angle for placing cedar support beams to bear the overhead load."
      },
      {
        id: "verbal",
        type: "verbal",
        text: "Sculpt Clay Wall Reliefs",
        description: "Sculpt friendly Cabbits faces and leaf carvings into the damp clay walls to make them cozy."
      },
      {
        id: "practical",
        type: "practical",
        text: "Pack Structural Clay",
        description: "Mix dry dirt with river water to create a thick clay plaster and pack it into structural gaps."
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
