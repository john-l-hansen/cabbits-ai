"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Companion, CompanionTemperament, CompanionMemory, Book, CompanionMood, CompanionLocation, Item, DraftObject, JournalEntry } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { runAgentSimulation } from "@/lib/agents/simulation";
import { DEFAULT_BOOKS } from "@/lib/data/books";
import { QUESTS, Quest } from "@/lib/data/quests";
import { ITEMS } from "@/lib/data/items";
import { LOCATIONS, Location } from "@/lib/data/locations";

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
  createCompanion: (name: string, temperament: CompanionTemperament) => Promise<void>;
  completeQuest: (userObservation: string, questId?: string) => Promise<void>;
  resetCompanion: () => Promise<void>;
  toggleFavoriteBook: (bookId: string) => Promise<void>;
  updateBookProgress: (bookId: string, progress: number) => Promise<void>;
  feedCabbit: () => Promise<void>;
  toggleSleep: () => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  approveDraftObject: (objectId: string) => Promise<void>;
  discardDraftObject: (objectId: string) => Promise<void>;
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
                const hasFirstQuestMemory = mappedMemories.some((m) => m.questId === "notice_one_thing");
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

          const savedCompanion = localStorage.getItem(COMPANION_STORAGE_KEY);
          const savedQuest = localStorage.getItem(QUEST_STORAGE_KEY);
          const savedMemories = localStorage.getItem(MEMORIES_STORAGE_KEY);
          const savedBooksState = localStorage.getItem(BOOKS_STATE_STORAGE_KEY);

          if (savedCompanion) {
            const parsed = JSON.parse(savedCompanion);
            const interests = parsed.interests || {};
            setCompanion({
              ...parsed,
              inventory: parsed.inventory || [],
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
      curiosity: 0,
      insightsCount: 0,
      carrotCoins: 128,
      cabbitMood: "idle",
      cabbitLocation: "rug",
      createdAt,
      inventory: [],
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

  const completeQuest = async (userObservation: string, questId: string = "notice_one_thing") => {
    if (!companion) return;

    setIsQuestCompleted(true);

    // Run the agent simulation pipeline
    const payload = runAgentSimulation(
      userObservation,
      companion.name,
      companion.temperament
    );

    setIsQuestCompleted(payload.isSafe);

    // Calculate curiosity rewards based on rating
    let points = 15;
    if (payload.evaluationRating === "Thoughtful") points = 50;
    else if (payload.evaluationRating === "Developing") points = 30;

    let newCuriosity = companion.curiosity + points;
    let newInsightsCount = companion.insightsCount;

    if (newCuriosity >= 100) {
      newCuriosity = 0;
      newInsightsCount += 1;
    }

    // Quest completions award carrot coins! (+30 coins)
    const coinReward = 30;

    // Check if quest awards a collectible item
    const questData = activeQuests[questId];
    const rewardItemId = questData?.rewardItemId;

    let newInventory = [...companion.inventory];
    if (rewardItemId && !newInventory.includes(rewardItemId)) {
      newInventory.push(rewardItemId);
    }

    const obsLower = userObservation.toLowerCase();
    const nextInterests = { ...(companion.interests || {}) };

    let matchedTopic: "mushroom" | "space" | "bug" | null = null;
    if (obsLower.includes("mushroom") || obsLower.includes("fungus") || obsLower.includes("toadstool") || obsLower.includes("spore")) {
      nextInterests.mushroom = (nextInterests.mushroom || 0) + 1;
      matchedTopic = "mushroom";
    } else if (obsLower.includes("star") || obsLower.includes("telescope") || obsLower.includes("sky") || obsLower.includes("moon") || obsLower.includes("constellation")) {
      nextInterests.space = (nextInterests.space || 0) + 1;
      matchedTopic = "space";
    } else if (obsLower.includes("bug") || obsLower.includes("insect") || obsLower.includes("butterfly") || obsLower.includes("firefly") || obsLower.includes("beetle")) {
      nextInterests.bug = (nextInterests.bug || 0) + 1;
      matchedTopic = "bug";
    }

    const { newQuests, newLocations } = injectReactiveQuests(nextInterests, activeQuests, activeLocations);
    setActiveQuests(newQuests);
    setActiveLocations(newLocations);

    // Save dynamic approved registers to local storage
    try {
      localStorage.setItem("cabbits_approved_quests_v1", JSON.stringify(newQuests));
      localStorage.setItem("cabbits_approved_locations_v1", JSON.stringify(newLocations));
    } catch (e) {
      console.error("Local save failed for active collections:", e);
    }

    const updatedCompanion: Companion = {
      ...companion,
      curiosity: newCuriosity,
      insightsCount: newInsightsCount,
      carrotCoins: companion.carrotCoins + coinReward,
      cabbitMood: "happy",
      inventory: newInventory,
      interests: nextInterests,
    };

    setCompanion(updatedCompanion);

    const memoryId = generateUUID();
    const createdAt = new Date().toISOString();
    const contentJson = JSON.stringify({
      userObservation: userObservation.trim(),
      routedSpecialist: payload.routedSpecialist,
      specialistFeedback: payload.specialistFeedback,
      evaluationRating: payload.evaluationRating,
      evaluationFeedback: payload.evaluationFeedback,
      companionReflection: payload.companionReflection,
      curiosityEarned: points,
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

    // Proposal Generator logic (propose draft item/quest)
    let proposedType: "item" | "quest" | null = null;
    let proposedObjectId = "";
    let proposedData: any = null;

    if (questId === "watch_ripples") {
      proposedType = "item";
      proposedObjectId = "moonlit_pearl";
      proposedData = {
        item: {
          id: "moonlit_pearl",
          name: "Moonlit Pearl",
          description: "A glowing white pearl found deep in the silt of Crescent Pond. Pip imagined this because of your water observations.",
          icon: "🔮",
          type: "collectible",
          locationOrigin: "Crescent Pond"
        },
        quest: {
          id: "pearl_hunt",
          title: "Seek the Moonlit Pearl",
          description: "Dive deep into the glowing silt of Crescent Pond to locate the mythical pearl Pip dreamed of.",
          placeholder: "I searched the sandy bottom of the pond near the lily pads and found the glowing sphere...",
          initialSaying: "“The pearl is down there! Let's search the glowing silt together.”",
          rewardItemId: "moonlit_pearl",
          isLocked: false,
          unlockCondition: "",
          locationId: "pond"
        },
        pipReason: `I imagined a glowing pearl hidden in the pond mud because of how you noticed the raindrop ripples expanding, ${companion.name}!`
      };
    } else if (questId === "count_flowers") {
      proposedType = "item";
      proposedObjectId = "clover_nectar";
      proposedData = {
        item: {
          id: "clover_nectar",
          name: "Clover Nectar",
          description: "A vial of sweet nectar collected from clover blooms. Pip imagined this because of your wildflower counting.",
          icon: "🧪",
          type: "collectible",
          locationOrigin: "Green Meadow"
        },
        quest: {
          id: "nectar_brew",
          title: "Harvest the Clover Nectar",
          description: "Help Pip squeeze the sweetest clover blooms in Green Meadow to distill a tiny vial of glowing nectar.",
          placeholder: "I selected five blooming purple clovers and carefully extracted the sweet nectar drop by drop...",
          initialSaying: "“Let's distill the clover blooms! Careful not to spill any drops.”",
          rewardItemId: "clover_nectar",
          isLocked: false,
          unlockCondition: "",
          locationId: "meadow"
        },
        pipReason: "I dreamed of gathering sweet nectar because of your beautiful observation counting the wildflower clusters in the field!"
      };
    } else if (questId === "notice_one_thing") {
      proposedType = "item";
      proposedObjectId = "mossy_bark";
      proposedData = {
        item: {
          id: "mossy_bark",
          name: "Mossy Bark",
          description: "A chunk of ancient oak bark thick with glowing green moss. Pip imagined this because of your acorn study.",
          icon: "🪵",
          type: "collectible",
          locationOrigin: "Oak Forest"
        },
        quest: {
          id: "bark_rubbing",
          title: "Study the Mossy Bark",
          description: "Take a charcoal rubbing of the ancient patterns engraved in the mossy oak bark of the Wise Owl's tree.",
          placeholder: "I held the parchment tight against the bark and shaded the ancient spiral grooves with charcoal...",
          initialSaying: "“The bark has ancient spirals! Let's take a charcoal rubbing together.”",
          rewardItemId: "mossy_bark",
          isLocked: false,
          unlockCondition: "",
          locationId: "forest"
        },
        pipReason: "I imagined copying ancient symbols from the tree bark because of your wonderful study of the hidden acorn stash!"
      };
    }

    let nextDrafts = [...draftObjects];

    if (proposedType && proposedObjectId && proposedData) {
      const alreadyProposed = draftObjects.some((d) => d.objectId === proposedObjectId) || 
                              newInventory.includes(proposedObjectId);

      if (!alreadyProposed) {
        const draftId = generateUUID();
        const draftCreatedAt = new Date().toISOString();
        const newDraft: DraftObject = {
          id: draftId,
          companionId: companion.id,
          type: proposedType,
          objectId: proposedObjectId,
          data: proposedData,
          status: "draft",
          createdAt: draftCreatedAt
        };

        nextDrafts = [newDraft, ...draftObjects];
        setDraftObjects(nextDrafts);

        try {
          localStorage.setItem("cabbits_drafts_v1", JSON.stringify(nextDrafts));
        } catch (e) {
          console.error("Local save failed for drafts:", e);
        }
      }
    }

    // Memory Synthesis Compiler
    let synthTopic = "";
    let synthSummary = "";
    let synthIcon = "";

    if (questId === "watch_ripples") {
      synthTopic = "Water Circles";
      synthSummary = "We studied how concentric ripples expand when raindrops hit Crescent Pond. Large drops transfer more kinetic energy, producing faster-traveling wave rings!";
      synthIcon = "💧";
    } else if (questId === "count_flowers") {
      synthTopic = "Meadow Flora";
      synthSummary = "We counted yellow buttercups clustered together in Green Meadow. They organize in clusters to optimize solar capture and share root resources.";
      synthIcon = "🌸";
    } else if (questId === "notice_one_thing") {
      synthTopic = "Acorn Stashes";
      synthSummary = "We searched the leaf litter under the ancient Oak tree. Acorn caches placed by squirrels near roots help oak saplings spread and take root.";
      synthIcon = "🐿️";
    } else if (questId === "pearl_hunt") {
      synthTopic = "Moonlit Minerals";
      synthSummary = "We recovered a glowing white pearl from the pond silt. Its luminescence comes from natural minerals absorbing twilight rays.";
      synthIcon = "🔮";
    } else if (questId === "nectar_brew") {
      synthTopic = "Distilled Elixirs";
      synthSummary = "We distilled clover blooms in the meadow. Condensing organic sugars preserves their nutritional value and stores energy.";
      synthIcon = "🧪";
    } else if (questId === "bark_rubbing") {
      synthTopic = "Tree Carvings";
      synthSummary = "We traced the spiral engravings on the ancient oak tree bark. These markings are records of changes or guideposts for travelers.";
      synthIcon = "🪵";
    }

    let updatedJournal = [...journalEntries];
    if (synthTopic && synthSummary && synthIcon) {
      const existingIdx = journalEntries.findIndex((j) => j.topic === synthTopic);
      const nowIso = new Date().toISOString();
      
      if (existingIdx > -1) {
        const updatedEntry = {
          ...journalEntries[existingIdx],
          summary: synthSummary,
          updatedAt: nowIso
        };
        updatedJournal[existingIdx] = updatedEntry;
      } else {
        const newEntry: JournalEntry = {
          id: generateUUID(),
          companionId: companion.id,
          topic: synthTopic,
          summary: synthSummary,
          icon: synthIcon,
          createdAt: nowIso,
          updatedAt: nowIso
        };
        updatedJournal = [newEntry, ...journalEntries];
      }

      setJournalEntries(updatedJournal);

      try {
        localStorage.setItem("cabbits_journal_v1", JSON.stringify(updatedJournal));
      } catch (e) {
        console.error("Local save failed for journal:", e);
      }
    }

    // Local Storage Cache
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
            curiosity: newCuriosity,
            insights_count: newInsightsCount,
            carrot_coins: companion.carrotCoins + coinReward,
            cabbit_mood: "happy",
            interests: nextInterests,
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

        // Insert new draft to DB if spawned
        const newlyCreatedDraft = nextDrafts.find((d) => d.objectId === proposedObjectId && d.status === "draft");
        if (newlyCreatedDraft) {
          await supabase.from("companion_draft_objects").insert({
            id: newlyCreatedDraft.id,
            companion_id: companion.id,
            type: newlyCreatedDraft.type,
            object_id: newlyCreatedDraft.objectId,
            data: newlyCreatedDraft.data,
            status: "draft",
            created_at: newlyCreatedDraft.createdAt
          });
        }

        // Insert/Upsert synthesized journal to DB
        if (synthTopic && synthSummary && synthIcon) {
          const entry = updatedJournal.find((j) => j.topic === synthTopic);
          if (entry) {
            await supabase.from("companion_journal").upsert({
              id: entry.id,
              companion_id: companion.id,
              topic: entry.topic,
              summary: entry.summary,
              icon: entry.icon,
              created_at: entry.createdAt,
              updated_at: entry.updatedAt
            }, { onConflict: "companion_id,topic" });
          }
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
