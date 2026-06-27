export type SimulatedPayload = {
  routedSpecialist: "Botany" | "Physics" | "History" | "Generalist";
  specialistFeedback: string;
  evaluationRating: "Thoughtful" | "Developing" | "Brief";
  evaluationFeedback: string;
  companionReflection: string;
  isSafe: boolean;
};

export function runAgentSimulation(
  userText: string,
  companionName: string,
  temperament: string
): SimulatedPayload {
  const normalizedText = userText.toLowerCase();

  // 1. Safety check (basic simulated moderation)
  const toxicKeywords = ["abuse", "kill", "hate", "weapon", "bomb", "stupid"];
  const containsUnsafe = toxicKeywords.some((word) => normalizedText.includes(word));
  if (containsUnsafe) {
    return {
      routedSpecialist: "Generalist",
      specialistFeedback: "No feedback available.",
      evaluationRating: "Brief",
      evaluationFeedback: "Safety block triggered.",
      companionReflection: "I'm here to support safe and kind reflections. Let's try noticing something else together.",
      isSafe: false,
    };
  }

  // 2. Orchestrator routing to Specialist Teacher
  let routedSpecialist: "Botany" | "Physics" | "History" | "Generalist" = "Generalist";
  let specialistFeedback = "";

  const botanyKeywords = ["plant", "leaf", "flower", "tree", "grass", "moss", "wood", "green", "pot"];
  const physicsKeywords = ["clock", "shadow", "light", "time", "sun", "mirror", "reflection", "gravity", "metal"];
  const historyKeywords = ["book", "coin", "map", "old", "paper", "pen", "ink", "photo", "read"];

  if (botanyKeywords.some((w) => normalizedText.includes(w))) {
    routedSpecialist = "Botany";
    specialistFeedback =
      "Observations of plant life connect us directly to biological efficiency. The veins on a leaf are nature's capillary systems, optimized over millions of years to transport water and nutrients. Studying this reminds us that structure is always linked to survival.";
  } else if (physicsKeywords.some((w) => normalizedText.includes(w))) {
    routedSpecialist = "Physics";
    specialistFeedback =
      "Studying shadows and clocks highlights the nature of time and light. A shadow is not an entity itself, but rather the absence of light waves blocked by matter. Its length shifts depending on the angle of incoming light, showing wave propagation in action.";
  } else if (historyKeywords.some((w) => normalizedText.includes(w))) {
    routedSpecialist = "History";
    specialistFeedback =
      "Objects like books, coins, and maps are vessels of human culture. A single printed page represents centuries of printing press evolution and linguistic shifts. By studying it closely, we connect to the minds of craftspeople who came before us.";
  } else {
    routedSpecialist = "Generalist";
    specialistFeedback =
      "Everyday objects carry hidden complexities. By focusing your attention on a single item, you are training your brain to see beyond the surface, recognizing patterns of design, material science, and utility.";
  }

  // 3. Evaluator Agent (reflection depth check)
  const trimmedLength = userText.trim().length;
  let evaluationRating: "Thoughtful" | "Developing" | "Brief" = "Developing";
  let evaluationFeedback = "";

  if (trimmedLength < 25) {
    evaluationRating = "Brief";
    evaluationFeedback = "Your observation is quite short. Try adding a bit more detail next time to help us study it.";
  } else if (trimmedLength > 65) {
    evaluationRating = "Thoughtful";
    evaluationFeedback = "Excellent! You described details and patterns, which shows a deep level of focus and curiosity.";
  } else {
    evaluationRating = "Developing";
    evaluationFeedback = "Good start! You noticed the core elements. Try looking closer at the materials or shapes next time.";
  }

  // 4. Companion Agent (wrapping responses with warmth based on temperament)
  let companionReflection = "";
  const tempKey = temperament.toLowerCase();

  switch (tempKey) {
    case "gentle":
      companionReflection = `I love how slowly and quietly you noticed that. Learning is a peaceful path, and you are taking it step-by-step. ${companionName} is glad to reflect with you.`;
      break;
    case "curious":
      companionReflection = `Aha! That's fascinating! Looking closely reveals so many new questions. ${companionName} wonders: what else will we find if we keep asking how things work?`;
      break;
    case "playful":
      companionReflection = `Spotting details is like a secret game! Who knew this could teach us so much? ${companionName} is super excited to see what we investigate next!`;
      break;
    case "focused":
      companionReflection = `Excellent observation. You isolated the core properties of the object and concentrated on its details. This focused approach will serve us well.`;
      break;
    default:
      companionReflection = `Thank you for sharing that observation. ${companionName} is ready to continue guiding you on our learning journey.`;
  }

  return {
    routedSpecialist,
    specialistFeedback,
    evaluationRating,
    evaluationFeedback,
    companionReflection,
    isSafe: true,
  };
}
