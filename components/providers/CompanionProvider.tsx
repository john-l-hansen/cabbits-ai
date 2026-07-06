"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Companion, CompanionTemperament, CompanionMemory, Book, CompanionMood, CompanionLocation, Item, DraftObject, JournalEntry, Quest, Location } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { runAgentSimulation } from "@/lib/agents/simulation";
import { DEFAULT_BOOKS } from "@/lib/data/books";
import { QUESTS, getRandomizedQuestSet } from "@/lib/data/quests";
import { ITEMS } from "@/lib/data/items";
import { LOCATIONS } from "@/lib/data/locations";

// Helper function to inject reactive quests based on companion interests
const injectReactiveQuests = (
  interests: Record<string, number> | undefined,
  questsMap: Record<string, Quest>,
  locsMap: Record<string, Location>
) => {
  const newQuests = { ...questsMap };
  const newLocations = { ...locsMap };

  if (!interests) return { newQuests, newLocations };

  if (interests.mushroom >= 2) {
    const quest: Quest = {
      id: "special_mushroom_quest",
      title: "✨ Mushroom Glow Study ✨",
      description: "Help Pip map the glowing violet caps growing on the rotting oak logs.",
      placeholder: "I studied the pattern of the glowing spores...",
      initialSaying: "“Look at those purple caps! Let's examine their glow together.”",
      rewardItemId: "mossy_bark",
      isLocked: false,
      unlockCondition: "",
      locationId: "forest"
    };
    newQuests.special_mushroom_quest = quest;
    if (newLocations.forest && !newLocations.forest.questIds.includes(quest.id)) {
      newLocations.forest = {
        ...newLocations.forest,
        questIds: [...newLocations.forest.questIds, quest.id]
      };
    }
  }

  if (interests.space >= 2) {
    const quest: Quest = {
      id: "special_star_quest",
      title: "✨ Starlight Constellations ✨",
      description: "Pip wants to trace the rabbit constellation through the library telescope.",
      placeholder: "I looked through the lens and drew the stars forming the long ears...",
      initialSaying: "“The telescope is aligned! Can you see the rabbit ears in the sky?”",
      rewardItemId: "silver_acorn",
      isLocked: false,
      unlockCondition: "",
      locationId: "library"
    };
    newQuests.special_star_quest = quest;
    if (newLocations.library && !newLocations.library.questIds.includes(quest.id)) {
      newLocations.library = {
        ...newLocations.library,
        questIds: [...newLocations.library.questIds, quest.id]
      };
    }
  }

  if (interests.bug >= 2) {
    const quest: Quest = {
      id: "special_bug_quest",
      title: "✨ Catching Fireflies ✨",
      description: "Count the bioluminescent fireflies dancing over the meadow grass.",
      placeholder: "I watched the fireflies blink in sequence and logged their pattern...",
      initialSaying: "“Fireflies! Look at how they blink together! Can you count them?”",
      rewardItemId: "lantern",
      isLocked: false,
      unlockCondition: "",
      locationId: "meadow"
    };
    newQuests.special_bug_quest = quest;
    if (newLocations.meadow && !newLocations.meadow.questIds.includes(quest.id)) {
      newLocations.meadow = {
        ...newLocations.meadow,
        questIds: [...newLocations.meadow.questIds, quest.id]
      };
    }
  }

  return { newQuests, newLocations };
};


type CompanionContextType = {
  companion: Companion | null;
  isQuestCompleted: boolean;
  isLoading: boolean;
  isUsingSupabase: boolean;
  memories: CompanionMemory[];
  books: Book[];
  items: Record<string, Item>;
  quests: Record<string, Quest>;
  locations: Record<string, Location>;
  draftObjects: DraftObject[];
  journalEntries: JournalEntry[];
  completedQuestIds: string[];
  showLevelUpAlert: boolean;
  setShowLevelUpAlert: (show: boolean) => void;
  createCompanion: (name: string, temperament: CompanionTemperament) => Promise<void>;
  completeQuest: (questId: string, choiceId: string) => Promise<void>;
  resetCompanion: () => Promise<void>;
  toggleFavoriteBook: (bookId: string) => Promise<void>;
  updateBookProgress: (bookId: string, progress: number) => Promise<void>;
  feedCabbit: () => Promise<void>;
  toggleSleep: () => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  approveDraftObject: (objectId: string) => Promise<void>;
  discardDraftObject: (objectId: string) => Promise<void>;
  useInventoryItem: (itemId: string) => Promise<void>;
};

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

const COMPANION_STORAGE_KEY = "cabbits_companion_v1";
const QUEST_STORAGE_KEY = "cabbits_quest_completed_v1";
const MEMORIES_STORAGE_KEY = "cabbits_memories_v1";
const BOOKS_STATE_STORAGE_KEY = "cabbits_books_state_v1";

// Safe cross-platform UUID generator
const generateUUID = () => {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [isQuestCompleted, setIsQuestCompleted] = useState<boolean>(false);
  const [memories, setMemories] = useState<CompanionMemory[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dynamic registers supporting approved proposals
  const [activeItems, setActiveItems] = useState<Record<string, Item>>(ITEMS);
  const [activeQuests, setActiveQuests] = useState<Record<string, Quest>>(QUESTS);
  const [activeLocations, setActiveLocations] = useState<Record<string, Location>>(LOCATIONS);
  const [draftObjects, setDraftObjects] = useState<DraftObject[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);
  const [showLevelUpAlert, setShowLevelUpAlert] = useState<boolean>(false);

  // Initialize and load state
  useEffect(() => {
    async function loadState() {
      try {
        if (isSupabaseConfigured && supabase) {
          console.log("Cabbits: Connecting to Supabase database...");
          const savedCompanionJson = localStorage.getItem(COMPANION_STORAGE_KEY);
          
          if (savedCompanionJson) {
            const localComp = JSON.parse(savedCompanionJson) as Companion;
            // Fetch this specific companion from Supabase
            const { data: dbComp, error: compError } = await supabase
              .from("companions")
              .select("*")
              .eq("id", localComp.id)
              .maybeSingle();

            if (dbComp && !compError) {
              // Fetch companion items from Supabase
              const { data: dbItems, error: itemsError } = await supabase
                .from("companion_items")
                .select("item_id")
                .eq("companion_id", dbComp.id);

              const inventoryList = dbItems && !itemsError ? dbItems.map((it) => it.item_id) : [];

              // Fetch companion draft objects from Supabase
              const { data: dbDrafts, error: draftsError } = await supabase
                .from("companion_draft_objects")
                .select("*")
                .eq("companion_id", dbComp.id);

              const activeDraftsList: DraftObject[] = [];
              let itemsMap = { ...ITEMS };
              let questsMap = { ...QUESTS };
              let locsMap = { ...LOCATIONS };

              if (dbDrafts && !draftsError) {
                dbDrafts.forEach((d) => {
                  const itemData = d.data.item;
                  const questData = d.data.quest;

                  if (d.status === "draft") {
                    activeDraftsList.push({
                      id: d.id,
                      companionId: d.companion_id,
                      type: d.type as "item" | "quest",
                      objectId: d.object_id,
                      data: d.data,
                      status: "draft",
                      createdAt: d.created_at
                    });
                  } else if (d.status === "approved" && itemData && questData) {
                    itemsMap[itemData.id] = itemData;
                    questsMap[questData.id] = questData;
                    
                    const locationId = questData.locationId;
                    if (locsMap[locationId] && !locsMap[locationId].questIds.includes(questData.id)) {
                      locsMap[locationId] = {
                        ...locsMap[locationId],
                        questIds: [...locsMap[locationId].questIds, questData.id]
                      };
                    }
                  }
                });
              }

              const dbInterests = dbComp.interests ?? {};
              const { newQuests, newLocations } = injectReactiveQuests(dbInterests, questsMap, locsMap);

              setDraftObjects(activeDraftsList);
              setActiveItems(itemsMap);
              setActiveQuests(newQuests);
              setActiveLocations(newLocations);

              setCompanion({
                id: dbComp.id,
                name: dbComp.name,
                temperament: dbComp.temperament as CompanionTemperament,
                level: dbComp.level ?? 12,
                xp: dbComp.xp ?? 450,
                health: dbComp.health ?? 120,
                learning: dbComp.learning ?? 85,
                kindness: dbComp.kindness ?? 78,
                energy: dbComp.energy ?? 65,
                curiosity: dbComp.curiosity ?? 0,
                insightsCount: dbComp.insights_count ?? 0,
                carrotCoins: dbComp.carrot_coins ?? 128,
                cabbitMood: (dbComp.cabbit_mood as CompanionMood) ?? "idle",
                cabbitLocation: (dbComp.cabbit_location as CompanionLocation) ?? "rug",
                createdAt: dbComp.created_at,
                inventory: inventoryList,
                interests: dbInterests,
              });

              // Fetch synthesized journal entries
              const { data: dbJournal, error: journalError } = await supabase
                .from("companion_journal")
                .select("*")
                .eq("companion_id", dbComp.id)
                .order("updated_at", { ascending: false });

              if (dbJournal && !journalError) {
                const mappedJournal: JournalEntry[] = dbJournal.map((j) => ({
                  id: j.id,
                  companionId: j.companion_id,
                  topic: j.topic,
                  summary: j.summary,
                  icon: j.icon,
                  createdAt: j.created_at,
                  updatedAt: j.updated_at,
                }));
                setJournalEntries(mappedJournal);
              }

              // Fetch memory entries
              const { data: dbMemories, error: memoriesError } = await supabase
                .from("companion_memories")
                .select("*")
                .eq("companion_id", dbComp.id)
                .order("created_at", { ascending: false });

              if (dbMemories && !memoriesError) {
                const mappedMemories: CompanionMemory[] = dbMemories.map((m) => ({
                  id: m.id,
                  companionId: m.companion_id,
                  content: m.content,
                  questId: m.quest_id,
                  createdAt: m.created_at,
                }));
                setMemories(mappedMemories);
                
                // Determine first quest completion based on memories
                const hasFirstQuestMemory = mappedMemories.length > 0;
                setIsQuestCompleted(hasFirstQuestMemory);
              }

              // Fetch book progress states from Supabase
              const { data: dbBooks, error: booksError } = await supabase
                .from("companion_books")
                .select("*")
                .eq("companion_id", dbComp.id);

              const dbBookMap = new Map<string, { progress: number; is_favorite: boolean }>();
              if (dbBooks && !booksError) {
                dbBooks.forEach((b) => {
                  dbBookMap.set(b.book_id, { progress: b.progress, is_favorite: b.is_favorite });
                });
              }

              // Merge defaults with DB states
              const hydratedBooks = DEFAULT_BOOKS.map((b) => {
                const dbState = dbBookMap.get(b.id);
                return {
                  ...b,
                  progress: dbState?.progress ?? 0,
                  isFavorite: dbState?.is_favorite ?? false,
                } as Book;
              });
              setBooks(hydratedBooks);
            } else {
              // Companion not found in DB
              localStorage.removeItem(COMPANION_STORAGE_KEY);
              localStorage.removeItem(QUEST_STORAGE_KEY);
              localStorage.removeItem(MEMORIES_STORAGE_KEY);
              localStorage.removeItem(BOOKS_STATE_STORAGE_KEY);
            }
          }
        } else {
          console.warn("Cabbits: Supabase missing. Falling back to local storage.");
          
          // Hydrate approved lists
          const savedItems = localStorage.getItem("cabbits_approved_items_v1");
          const savedQuests = localStorage.getItem("cabbits_approved_quests_v1");
          const savedLocs = localStorage.getItem("cabbits_approved_locations_v1");
          if (savedItems) setActiveItems(JSON.parse(savedItems));
          if (savedQuests) setActiveQuests(JSON.parse(savedQuests));
          if (savedLocs) setActiveLocations(JSON.parse(savedLocs));

          // Load drafts
          const savedDrafts = localStorage.getItem("cabbits_drafts_v1");
          if (savedDrafts) setDraftObjects(JSON.parse(savedDrafts));

          // Load journal entries
          const savedJournal = localStorage.getItem("cabbits_journal_v1");
          if (savedJournal) setJournalEntries(JSON.parse(savedJournal));

          // Load completed quest IDs
          const savedCompleted = localStorage.getItem("cabbits_completed_quests_list_v1");
          if (savedCompleted) setCompletedQuestIds(JSON.parse(savedCompleted));

          const savedCompanion = localStorage.getItem(COMPANION_STORAGE_KEY);
          const savedQuest = localStorage.getItem(QUEST_STORAGE_KEY);
          const savedMemories = localStorage.getItem(MEMORIES_STORAGE_KEY);
          const savedBooksState = localStorage.getItem(BOOKS_STATE_STORAGE_KEY);

          if (savedCompanion) {
            const parsed = JSON.parse(savedCompanion);
            const interests = parsed.interests || {};
            setCompanion({
              ...parsed,
              level: parsed.level ?? 12,
              xp: parsed.xp ?? 450,
              health: parsed.health ?? 120,
              learning: parsed.learning ?? 85,
              kindness: parsed.kindness ?? 78,
              energy: parsed.energy ?? 65,
              inventory: (parsed.inventory && parsed.inventory.length > 0) ? parsed.inventory : ["carrot", "carrot", "carrot", "apple", "apple", "mushroom", "mushroom", "fruit_basket", "milk", "juice", "feather", "lantern", "wooden_sword", "adventurer_hat", "green_scarf", "explorer_pack", "leaf_charm", "comfy_boots"],
              interests: interests,
            });

            const baseQuests = savedQuests ? JSON.parse(savedQuests) : QUESTS;
            const baseLocations = savedLocs ? JSON.parse(savedLocs) : LOCATIONS;
            const { newQuests, newLocations } = injectReactiveQuests(interests, baseQuests, baseLocations);
            setActiveQuests(newQuests);
            setActiveLocations(newLocations);
          }
          if (savedQuest) {
            setIsQuestCompleted(JSON.parse(savedQuest) === true);
          }
          if (savedMemories) {
            setMemories(JSON.parse(savedMemories));
          }

          // Hydrate local books cache
          const localBookMap = new Map<string, { progress: number; isFavorite: boolean }>();
          if (savedBooksState) {
            try {
              const parsedStates = JSON.parse(savedBooksState) as { id: string; progress: number; isFavorite: boolean }[];
              parsedStates.forEach((b) => {
                localBookMap.set(b.id, { progress: b.progress, isFavorite: b.isFavorite });
              });
            } catch (e) {
              console.error("Failed to parse local books state:", e);
            }
          }

          const hydratedBooks = DEFAULT_BOOKS.map((b) => {
            const localState = localBookMap.get(b.id);
            return {
              ...b,
              progress: localState?.progress ?? 0,
              isFavorite: localState?.isFavorite ?? false,
            } as Book;
          });
          setBooks(hydratedBooks);
        }
      } catch (error) {
        console.error("Failed to load Cabbits state:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadState();
  }, []);

  const createCompanion = async (name: string, temperament: CompanionTemperament) => {
    const compId = generateUUID();
    const createdAt = new Date().toISOString();
    const newCompanion: Companion = {
      id: compId,
      name: name.trim(),
      temperament,
      level: 12,
      xp: 450,
      health: 120,
      learning: 85,
      kindness: 78,
      energy: 65,
      curiosity: 0,
      insightsCount: 0,
      carrotCoins: 128,
      cabbitMood: "idle",
      cabbitLocation: "rug",
      createdAt,
      inventory: ["carrot", "carrot", "carrot", "apple", "apple", "mushroom", "mushroom", "fruit_basket", "milk", "juice", "feather", "lantern", "wooden_sword", "adventurer_hat", "green_scarf", "explorer_pack", "leaf_charm", "comfy_boots"],
      interests: {},
    };

    setCompanion(newCompanion);
    setIsQuestCompleted(false);
    setMemories([]);
    setDraftObjects([]);
    setJournalEntries([]);
    setActiveItems(ITEMS);
    setActiveQuests(QUESTS);
    setActiveLocations(LOCATIONS);
    
    // Reset books collection
    const freshBooks = DEFAULT_BOOKS.map((b) => ({ ...b, progress: 0, isFavorite: false } as Book));
    setBooks(freshBooks);

    // Local Storage Cache
    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(newCompanion));
      localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(false));
      localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(BOOKS_STATE_STORAGE_KEY, JSON.stringify([]));
      localStorage.removeItem("cabbits_drafts_v1");
      localStorage.removeItem("cabbits_approved_items_v1");
      localStorage.removeItem("cabbits_approved_quests_v1");
      localStorage.removeItem("cabbits_approved_locations_v1");
      localStorage.removeItem("cabbits_journal_v1");
    } catch (error) {
      console.error("Local save failed:", error);
    }

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("companions").insert({
          id: compId,
          name: newCompanion.name,
          temperament: newCompanion.temperament,
          curiosity: 0,
          insights_count: 0,
          carrot_coins: 128,
          cabbit_mood: "idle",
          cabbit_location: "rug",
          interests: {},
          created_at: newCompanion.createdAt,
        });
      } catch (error) {
        console.error("Failed database client connection:", error);
      }
    }
  };

  const completeQuest = async (questId: string, choiceId: string) => {
    if (!companion) return;

    setIsQuestCompleted(true);

    const questData = activeQuests[questId];
    if (!questData) return;

    const choice = questData.choices?.find((c) => c.id === choiceId);

    // Dynamic specialist details based on choice type
    let specialistFeedback = "";
    let companionReflection = "";
    let routedSpecialist = "Generalist";

    if (choice?.type === "logical") {
      routedSpecialist = "Logician";
      specialistFeedback = `Analyzing pattern details: "${choice?.text || ""}" (${choice?.description || ""}). High deductive accuracy. Mathematical logic verified.`;
      companionReflection = `“Wow, ${companion.name}! Your logical logic checks out perfectly! That makes the calculations so clear and helps me see the pattern.”`;
    } else if (choice?.type === "verbal") {
      routedSpecialist = "Linguist & Relational";
      specialistFeedback = `Analyzing relational details: "${choice?.text || ""}" (${choice?.description || ""}). High empathy and communication index. Language semantics verified.`;
      companionReflection = `“Your words are so kind and thoughtful, ${companion.name}! Speaking to the forest neighbors and reciting runes makes me feel so happy and warm inside.”`;
    } else {
      routedSpecialist = "Practical Craftsman";
      specialistFeedback = `Analyzing mechanical details: "${choice?.text || ""}" (${choice?.description || ""}). Strong practical execution and scientific observation. Physical mechanics verified.`;
      companionReflection = `“That was a very practical solution! Fixing the hinges, lashing the wood, and checking the soil really makes a physical difference in our world, ${companion.name}.”`;
    }

    // Quest completions award 200 XP
    const xpReward = questData.xpReward || 200;
    const coinReward = 30;

    let newXP = companion.xp + xpReward;
    let newLevel = companion.level;
    let newHealth = companion.health;
    let newLearning = companion.learning;
    let newKindness = companion.kindness;
    let newEnergy = companion.energy;
    let leveledUp = false;

    // Level-up threshold: Level * 1000
    const xpNeeded = newLevel * 1000;
    if (newXP >= xpNeeded) {
      newXP = newXP - xpNeeded;
      newLevel += 1;
      leveledUp = true;
      // Scale attributes
      newHealth += Math.floor(Math.random() * 5) + 5; // +5 to +9
      newLearning += Math.floor(Math.random() * 5) + 5;
      newKindness += Math.floor(Math.random() * 5) + 5;
      newEnergy += Math.floor(Math.random() * 5) + 5;
      setShowLevelUpAlert(true);
    }

    // Update completed quests list
    const nextCompletedIds = [...completedQuestIds, questId];
    setCompletedQuestIds(nextCompletedIds);
    try {
      localStorage.setItem("cabbits_completed_quests_list_v1", JSON.stringify(nextCompletedIds));
    } catch (e) {
      console.error("Local save failed for completed list:", e);
    }

    // Set Completion & Randomization logic
    const locationId = questData.locationId;
    const locationQuestIds = {
      pond: ["pond_lilies", "pond_ripples", "pond_grove"],
      meadow: ["meadow_buttercups", "meadow_clover", "meadow_hummingbird"],
      forest: ["forest_oak", "forest_perch", "forest_undergrowth"],
      burrow: ["burrow_entrance", "burrow_lichen", "burrow_tunnels"],
      library: ["library_ivy", "library_shelves", "library_tablet"]
    }[locationId || ""];

    let finalQuests = { ...activeQuests };
    let finalCompletedIds = [...nextCompletedIds];

    if (locationQuestIds && locationQuestIds.every(id => finalCompletedIds.includes(id))) {
      // Clear completed flags for this location's quests
      finalCompletedIds = finalCompletedIds.filter(id => !locationQuestIds.includes(id));
      setCompletedQuestIds(finalCompletedIds);
      try {
        localStorage.setItem("cabbits_completed_quests_list_v1", JSON.stringify(finalCompletedIds));
      } catch (e) {
        console.error("Local save failed for completed list:", e);
      }

      // Generate a new randomized quest set for this location
      const newSet = getRandomizedQuestSet(locationId || "", companion.name);
      finalQuests = { ...activeQuests, ...newSet };
      setActiveQuests(finalQuests);
      try {
        localStorage.setItem("cabbits_approved_quests_v1", JSON.stringify(finalQuests));
      } catch (e) {
        console.error("Local save failed for active quests:", e);
      }
    }

    // Check if quest awards a collectible item
    const rewardItemId = questData.rewardItemId;
    let newInventory = [...companion.inventory];
    if (rewardItemId && !newInventory.includes(rewardItemId)) {
      newInventory.push(rewardItemId);
    }

    const updatedCompanion: Companion = {
      ...companion,
      level: newLevel,
      xp: newXP,
      health: newHealth,
      learning: newLearning,
      kindness: newKindness,
      energy: newEnergy,
      carrotCoins: companion.carrotCoins + coinReward,
      cabbitMood: "happy",
      inventory: newInventory,
    };

    setCompanion(updatedCompanion);

    const memoryId = generateUUID();
    const createdAt = new Date().toISOString();
    const contentJson = JSON.stringify({
      userObservation: choice ? `${choice.text}: ${choice.description}` : "Observed location landmarks.",
      routedSpecialist,
      specialistFeedback,
      evaluationRating: "Thoughtful",
      evaluationFeedback: "Problem-solving option selected.",
      companionReflection,
      curiosityEarned: 20,
      questId,
    });

    const newMemory: CompanionMemory = {
      id: memoryId,
      companionId: companion.id,
      content: contentJson,
      questId,
      createdAt,
    };

    const updatedMemories = [newMemory, ...memories];
    setMemories(updatedMemories);

    // Save dynamic approved registers to local storage
    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(updatedCompanion));
      localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(true));
      localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(updatedMemories));
    } catch (error) {
      console.error("Local save failed:", error);
    }

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("companions")
          .update({
            level: newLevel,
            xp: newXP,
            health: newHealth,
            learning: newLearning,
            kindness: newKindness,
            energy: newEnergy,
            carrot_coins: companion.carrotCoins + coinReward,
            cabbit_mood: "happy",
          })
          .eq("id", companion.id);

        await supabase.from("companion_memories").insert({
          id: memoryId,
          companion_id: companion.id,
          content: contentJson,
          quest_id: questId,
          created_at: createdAt,
        });

        if (rewardItemId) {
          await supabase.from("companion_items").insert({
            companion_id: companion.id,
            item_id: rewardItemId,
          });
        }
      } catch (error) {
        console.error("Failed database connection:", error);
      }
    }
  };

  const approveDraftObject = async (objectId: string) => {
    if (!companion) return;

    const draft = draftObjects.find((d) => d.objectId === objectId);
    if (!draft) return;

    const itemData = draft.data.item;
    const questData = draft.data.quest;

    const newItems = { ...activeItems, [itemData.id]: itemData };
    const newQuests = { ...activeQuests, [questData.id]: questData };

    const locationId = questData.locationId;
    const location = activeLocations[locationId];
    let newLocations = { ...activeLocations };
    if (location && !location.questIds.includes(questData.id)) {
      newLocations[locationId] = {
        ...location,
        questIds: [...location.questIds, questData.id]
      };
    }

    setActiveItems(newItems);
    setActiveQuests(newQuests);
    setActiveLocations(newLocations);

    const updatedDrafts = draftObjects.filter((d) => d.objectId !== objectId);
    setDraftObjects(updatedDrafts);

    try {
      localStorage.setItem("cabbits_drafts_v1", JSON.stringify(updatedDrafts));
      localStorage.setItem("cabbits_approved_items_v1", JSON.stringify(newItems));
      localStorage.setItem("cabbits_approved_quests_v1", JSON.stringify(newQuests));
      localStorage.setItem("cabbits_approved_locations_v1", JSON.stringify(newLocations));
    } catch (e) {
      console.error("Local save failed on approval:", e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("companion_draft_objects")
          .update({ status: "approved" })
          .eq("companion_id", companion.id)
          .eq("object_id", objectId);
      } catch (e) {
        console.error("Supabase update failed on approval:", e);
      }
    }
  };

  const discardDraftObject = async (objectId: string) => {
    if (!companion) return;

    const updatedDrafts = draftObjects.filter((d) => d.objectId !== objectId);
    setDraftObjects(updatedDrafts);

    try {
      localStorage.setItem("cabbits_drafts_v1", JSON.stringify(updatedDrafts));
    } catch (e) {
      console.error("Local save failed on discard:", e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("companion_draft_objects")
          .update({ status: "discarded" })
          .eq("companion_id", companion.id)
          .eq("object_id", objectId);
      } catch (e) {
        console.error("Supabase update failed on discard:", e);
      }
    }
  };

  const toggleFavoriteBook = async (bookId: string) => {
    if (!companion) return;

    let newFavoriteStatus = false;
    const updatedBooks = books.map((b) => {
      if (b.id === bookId) {
        newFavoriteStatus = !b.isFavorite;
        return { ...b, isFavorite: newFavoriteStatus };
      }
      return b;
    });

    setBooks(updatedBooks);

    try {
      const serializable = updatedBooks.map((b) => ({ id: b.id, progress: b.progress, isFavorite: b.isFavorite }));
      localStorage.setItem(BOOKS_STATE_STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.error("Local save failed for favorite:", e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("companion_books").upsert(
          {
            companion_id: companion.id,
            book_id: bookId,
            is_favorite: newFavoriteStatus,
          },
          { onConflict: "companion_id,book_id" }
        );
      } catch (e) {
        console.error("Database upsert failed for favorite:", e);
      }
    }
  };

  const updateBookProgress = async (bookId: string, newProgress: number) => {
    if (!companion) return;

    const targetBook = books.find((b) => b.id === bookId);
    const prevProgress = targetBook?.progress ?? 0;
    if (prevProgress === newProgress) return;

    let curiosityReward = 0;
    let coinReward = 0;
    if (newProgress > prevProgress) {
      curiosityReward = 20;
      coinReward = 15;
    }

    let newCuriosity = companion.curiosity + curiosityReward;
    let newInsightsCount = companion.insightsCount;

    if (newCuriosity >= 100) {
      newCuriosity = 0;
      newInsightsCount += 1;
    }

    const updatedCompanion: Companion = {
      ...companion,
      curiosity: newCuriosity,
      insightsCount: newInsightsCount,
      carrotCoins: companion.carrotCoins + coinReward,
      cabbitMood: "happy",
    };

    const updatedBooks = books.map((b) => {
      if (b.id === bookId) {
        return { ...b, progress: newProgress };
      }
      return b;
    });

    setCompanion(updatedCompanion);
    setBooks(updatedBooks);

    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(updatedCompanion));
      const serializable = updatedBooks.map((b) => ({ id: b.id, progress: b.progress, isFavorite: b.isFavorite }));
      localStorage.setItem(BOOKS_STATE_STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.error("Local save failed for progress:", e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("companions")
          .update({
            curiosity: newCuriosity,
            insights_count: newInsightsCount,
            carrot_coins: companion.carrotCoins + coinReward,
            cabbit_mood: "happy",
          })
          .eq("id", companion.id);

        await supabase.from("companion_books").upsert(
          {
            companion_id: companion.id,
            book_id: bookId,
            progress: newProgress,
          },
          { onConflict: "companion_id,book_id" }
        );
      } catch (e) {
        console.error("Database upsert failed for progress:", e);
      }
    }
  };

  const feedCabbit = async () => {
    if (!companion) return;
    if (companion.carrotCoins < 5) return;

    const newCoins = companion.carrotCoins - 5;
    let newCuriosity = companion.curiosity + 5;
    let newInsightsCount = companion.insightsCount;

    if (newCuriosity >= 100) {
      newCuriosity = 0;
      newInsightsCount += 1;
    }

    const updatedCompanion: Companion = {
      ...companion,
      carrotCoins: newCoins,
      curiosity: newCuriosity,
      insightsCount: newInsightsCount,
      cabbitMood: "happy",
      cabbitLocation: "rug",
    };

    setCompanion(updatedCompanion);

    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(updatedCompanion));
    } catch (e) {
      console.error("Local save failed for feed:", e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("companions")
          .update({
            carrot_coins: newCoins,
            curiosity: newCuriosity,
            insights_count: newInsightsCount,
            cabbit_mood: "happy",
            cabbit_location: "rug",
          })
          .eq("id", companion.id);
      } catch (e) {
        console.error("Database update failed for feed:", e);
      }
    }
  };

  const toggleSleep = async () => {
    if (!companion) return;

    const currentlySleeping = companion.cabbitMood === "sleeping";
    const nextMood = currentlySleeping ? "idle" : "sleeping";
    const nextLocation = currentlySleeping ? "rug" : "bed";

    const updatedCompanion: Companion = {
      ...companion,
      cabbitMood: nextMood,
      cabbitLocation: nextLocation,
    };

    setCompanion(updatedCompanion);

    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(updatedCompanion));
    } catch (e) {
      console.error("Local save failed for sleep:", e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("companions")
          .update({
            cabbit_mood: nextMood,
            cabbit_location: nextLocation,
          })
          .eq("id", companion.id);
      } catch (e) {
        console.error("Database update failed for sleep:", e);
      }
    }
  };

  const addCoins = async (amount: number) => {
    if (!companion) return;

    const updatedCompanion: Companion = {
      ...companion,
      carrotCoins: companion.carrotCoins + amount,
    };

    setCompanion(updatedCompanion);

    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(updatedCompanion));
    } catch (e) {
      console.error("Local save failed for coins:", e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("companions")
          .update({
            carrot_coins: companion.carrotCoins + amount,
          })
          .eq("id", companion.id);
      } catch (e) {
        console.error("Database update failed for coins:", e);
      }
    }
  };

  const useInventoryItem = async (itemId: string) => {
    if (!companion) return;

    const itemIndex = companion.inventory.indexOf(itemId);
    if (itemIndex === -1) return; // Item not in inventory

    const newInventory = [...companion.inventory];
    newInventory.splice(itemIndex, 1);

    let newCuriosity = companion.curiosity;
    let newInsightsCount = companion.insightsCount;
    let mood = companion.cabbitMood;

    if (itemId === "carrot") {
      newCuriosity += 10;
      mood = "happy";
      if (newCuriosity >= 100) {
        newCuriosity = 0;
        newInsightsCount += 1;
      }
    }

    const updatedCompanion: Companion = {
      ...companion,
      inventory: newInventory,
      curiosity: newCuriosity,
      insightsCount: newInsightsCount,
      cabbitMood: mood,
    };

    setCompanion(updatedCompanion);

    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(updatedCompanion));
    } catch (e) {
      console.error("Local save failed for useInventoryItem:", e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("companions")
          .update({
            curiosity: newCuriosity,
            insights_count: newInsightsCount,
            cabbit_mood: mood,
          })
          .eq("id", companion.id);
      } catch (e) {
        console.error("Database update failed for useInventoryItem:", e);
      }
    }
  };

  const resetCompanion = async () => {
    const prevCompanionId = companion?.id;
    setCompanion(null);
    setIsQuestCompleted(false);
    setMemories([]);
    setBooks([]);
    setDraftObjects([]);
    setJournalEntries([]);
    setActiveItems(ITEMS);
    setActiveQuests(QUESTS);
    setActiveLocations(LOCATIONS);

    try {
      localStorage.removeItem(COMPANION_STORAGE_KEY);
      localStorage.removeItem(QUEST_STORAGE_KEY);
      localStorage.removeItem(MEMORIES_STORAGE_KEY);
      localStorage.removeItem(BOOKS_STATE_STORAGE_KEY);
      localStorage.removeItem("cabbits_drafts_v1");
      localStorage.removeItem("cabbits_approved_items_v1");
      localStorage.removeItem("cabbits_approved_quests_v1");
      localStorage.removeItem("cabbits_approved_locations_v1");
      localStorage.removeItem("cabbits_journal_v1");
    } catch (error) {
      console.error("Local reset failed:", error);
    }

    if (isSupabaseConfigured && supabase && prevCompanionId) {
      console.log(`Cabbits: Session companion '${prevCompanionId}' reference cleared.`);
    }
  };

  return (
    <CompanionContext.Provider
      value={{
        companion,
        isQuestCompleted,
        isLoading,
        isUsingSupabase: isSupabaseConfigured,
        memories,
        books,
        items: activeItems,
        quests: activeQuests,
        locations: activeLocations,
        draftObjects,
        journalEntries,
        completedQuestIds,
        showLevelUpAlert,
        setShowLevelUpAlert,
        createCompanion,
        completeQuest,
        resetCompanion,
        toggleFavoriteBook,
        updateBookProgress,
        feedCabbit,
        toggleSleep,
        addCoins,
        approveDraftObject,
        discardDraftObject,
        useInventoryItem,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  const context = useContext(CompanionContext);
  if (context === undefined) {
    throw new Error("useCompanion must be used within a CompanionProvider");
  }
  return context;
}
