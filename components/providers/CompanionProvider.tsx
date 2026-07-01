"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Companion, CompanionTemperament, CompanionMemory, Book, CompanionMood, CompanionLocation } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { runAgentSimulation } from "@/lib/agents/simulation";
import { DEFAULT_BOOKS } from "@/lib/data/books";
import { QUESTS } from "@/lib/data/quests";

type CompanionContextType = {
  companion: Companion | null;
  isQuestCompleted: boolean;
  isLoading: boolean;
  isUsingSupabase: boolean;
  memories: CompanionMemory[];
  books: Book[];
  createCompanion: (name: string, temperament: CompanionTemperament) => Promise<void>;
  completeQuest: (userObservation: string, questId?: string) => Promise<void>;
  resetCompanion: () => Promise<void>;
  toggleFavoriteBook: (bookId: string) => Promise<void>;
  updateBookProgress: (bookId: string, progress: number) => Promise<void>;
  feedCabbit: () => Promise<void>;
  toggleSleep: () => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
};

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

const COMPANION_STORAGE_KEY = "cabbits_companion_v1";
const QUEST_STORAGE_KEY = "cabbits_quest_completed_v1";
const MEMORIES_STORAGE_KEY = "cabbits_memories_v1";
const BOOKS_STATE_STORAGE_KEY = "cabbits_books_state_v1";

// Safe cross-platform UUID generator for PostgreSQL UUID fields
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
              });

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
              // Companion not found in DB (e.g. database cleared), clean up local storage references
              localStorage.removeItem(COMPANION_STORAGE_KEY);
              localStorage.removeItem(QUEST_STORAGE_KEY);
              localStorage.removeItem(MEMORIES_STORAGE_KEY);
              localStorage.removeItem(BOOKS_STATE_STORAGE_KEY);
            }
          }
        } else {
          console.warn("Cabbits: Supabase environment variables missing. Falling back to local storage.");
          const savedCompanion = localStorage.getItem(COMPANION_STORAGE_KEY);
          const savedQuest = localStorage.getItem(QUEST_STORAGE_KEY);
          const savedMemories = localStorage.getItem(MEMORIES_STORAGE_KEY);
          const savedBooksState = localStorage.getItem(BOOKS_STATE_STORAGE_KEY);

          if (savedCompanion) {
            const parsed = JSON.parse(savedCompanion);
            setCompanion({
              ...parsed,
              inventory: parsed.inventory || [],
            });
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
    };

    setCompanion(newCompanion);
    setIsQuestCompleted(false);
    setMemories([]);
    
    // Reset books collection
    const freshBooks = DEFAULT_BOOKS.map((b) => ({ ...b, progress: 0, isFavorite: false } as Book));
    setBooks(freshBooks);

    // Local Storage Cache
    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(newCompanion));
      localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(false));
      localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(BOOKS_STATE_STORAGE_KEY, JSON.stringify([]));
    } catch (error) {
      console.error("Local save failed:", error);
    }

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("companions").insert({
          id: compId,
          name: newCompanion.name,
          temperament: newCompanion.temperament,
          curiosity: 0,
          insights_count: 0,
          carrot_coins: 128,
          cabbit_mood: "idle",
          cabbit_location: "rug",
          created_at: newCompanion.createdAt,
        });

        if (error) {
          console.error("Failed to persist companion to Supabase:", error);
        } else {
          console.log(`Cabbits: Persisted companion '${name}' to Supabase.`);
        }
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
    const questData = QUESTS[questId];
    const rewardItemId = questData?.rewardItemId;

    let newInventory = [...companion.inventory];
    if (rewardItemId && !newInventory.includes(rewardItemId)) {
      newInventory.push(rewardItemId);
    }

    const updatedCompanion: Companion = {
      ...companion,
      curiosity: newCuriosity,
      insightsCount: newInsightsCount,
      carrotCoins: companion.carrotCoins + coinReward,
      cabbitMood: "happy",
      inventory: newInventory,
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
        // Update companion's fields
        await supabase
          .from("companions")
          .update({
            curiosity: newCuriosity,
            insights_count: newInsightsCount,
            carrot_coins: companion.carrotCoins + coinReward,
            cabbit_mood: "happy",
          })
          .eq("id", companion.id);

        const { error: memError } = await supabase.from("companion_memories").insert({
          id: memoryId,
          companion_id: companion.id,
          content: contentJson,
          quest_id: questId,
          created_at: createdAt,
        });

        if (memError) {
          console.error("Failed to save memory to Supabase:", memError);
        }

        // Save companion item if new
        if (rewardItemId) {
          const { error: itemError } = await supabase.from("companion_items").insert({
            companion_id: companion.id,
            item_id: rewardItemId,
          });
          if (itemError) {
            console.warn("Failed to persist companion item to Supabase:", itemError);
          }
        }
      } catch (error) {
        console.error("Failed database client connection:", error);
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

    // Local Storage Cache
    try {
      const serializable = updatedBooks.map((b) => ({ id: b.id, progress: b.progress, isFavorite: b.isFavorite }));
      localStorage.setItem(BOOKS_STATE_STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.error("Local save failed for book favorite toggle:", e);
    }

    // Persist to Supabase if configured
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
        console.log("Cabbits: Upserted book favorite in Supabase.");
      } catch (e) {
        console.error("Database upsert failed for book favorite:", e);
      }
    }
  };

  const updateBookProgress = async (bookId: string, newProgress: number) => {
    if (!companion) return;

    const targetBook = books.find((b) => b.id === bookId);
    const prevProgress = targetBook?.progress ?? 0;
    if (prevProgress === newProgress) return;

    // Fill curiosity when finishing a chapter / advancing progress!
    let curiosityReward = 0;
    let coinReward = 0;
    if (newProgress > prevProgress) {
      curiosityReward = 20;
      coinReward = 15; // Completing book sections awards +15 carrot coins!
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

    // Local Storage Cache
    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(updatedCompanion));
      const serializable = updatedBooks.map((b) => ({ id: b.id, progress: b.progress, isFavorite: b.isFavorite }));
      localStorage.setItem(BOOKS_STATE_STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.error("Local save failed for progress:", e);
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
        console.log("Cabbits: Upserted book progress in Supabase.");
      } catch (e) {
        console.error("Database upsert failed for book progress:", e);
      }
    }
  };

  const feedCabbit = async () => {
    if (!companion) return;
    if (companion.carrotCoins < 5) return; // Need at least 5 coins

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

    // Local Storage Cache
    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(updatedCompanion));
    } catch (e) {
      console.error("Local save failed for feed:", e);
    }

    // Persist to Supabase if configured
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
        console.log("Cabbits: Saved fed status in Supabase.");
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

    // Local Storage Cache
    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(updatedCompanion));
    } catch (e) {
      console.error("Local save failed for sleep toggle:", e);
    }

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("companions")
          .update({
            cabbit_mood: nextMood,
            cabbit_location: nextLocation,
          })
          .eq("id", companion.id);
        console.log("Cabbits: Saved sleep toggle in Supabase.");
      } catch (e) {
        console.error("Database update failed for sleep toggle:", e);
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

    // Local Storage Cache
    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(updatedCompanion));
    } catch (e) {
      console.error("Local save failed for coins add:", e);
    }

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("companions")
          .update({
            carrot_coins: companion.carrotCoins + amount,
          })
          .eq("id", companion.id);
      } catch (e) {
        console.error("Database update failed for coins add:", e);
      }
    }
  };

  const resetCompanion = async () => {
    const prevCompanionId = companion?.id;
    setCompanion(null);
    setIsQuestCompleted(false);
    setMemories([]);
    setBooks([]);

    try {
      localStorage.removeItem(COMPANION_STORAGE_KEY);
      localStorage.removeItem(QUEST_STORAGE_KEY);
      localStorage.removeItem(MEMORIES_STORAGE_KEY);
      localStorage.removeItem(BOOKS_STATE_STORAGE_KEY);
    } catch (error) {
      console.error("Local reset failed:", error);
    }

    if (isSupabaseConfigured && supabase && prevCompanionId) {
      console.log(`Cabbits: Session companion '${prevCompanionId}' reference cleared locally.`);
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
        createCompanion,
        completeQuest,
        resetCompanion,
        toggleFavoriteBook,
        updateBookProgress,
        feedCabbit,
        toggleSleep,
        addCoins,
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
