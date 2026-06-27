"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Companion, CompanionTemperament, CompanionMemory } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type CompanionContextType = {
  companion: Companion | null;
  isQuestCompleted: boolean;
  isLoading: boolean;
  isUsingSupabase: boolean;
  memories: CompanionMemory[];
  createCompanion: (name: string, temperament: CompanionTemperament) => Promise<void>;
  completeQuest: () => Promise<void>;
  resetCompanion: () => Promise<void>;
};

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

const COMPANION_STORAGE_KEY = "cabbits_companion_v1";
const QUEST_STORAGE_KEY = "cabbits_quest_completed_v1";
const MEMORIES_STORAGE_KEY = "cabbits_memories_v1";

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
              setCompanion({
                id: dbComp.id,
                name: dbComp.name,
                temperament: dbComp.temperament as CompanionTemperament,
                createdAt: dbComp.created_at,
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
            } else {
              // Companion not found in DB (e.g. database cleared), clean up local storage references
              localStorage.removeItem(COMPANION_STORAGE_KEY);
              localStorage.removeItem(QUEST_STORAGE_KEY);
              localStorage.removeItem(MEMORIES_STORAGE_KEY);
            }
          }
        } else {
          console.warn("Cabbits: Supabase environment variables missing. Falling back to local storage.");
          const savedCompanion = localStorage.getItem(COMPANION_STORAGE_KEY);
          const savedQuest = localStorage.getItem(QUEST_STORAGE_KEY);
          const savedMemories = localStorage.getItem(MEMORIES_STORAGE_KEY);

          if (savedCompanion) {
            setCompanion(JSON.parse(savedCompanion));
          }
          if (savedQuest) {
            setIsQuestCompleted(JSON.parse(savedQuest) === true);
          }
          if (savedMemories) {
            setMemories(JSON.parse(savedMemories));
          }
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
      createdAt,
    };

    setCompanion(newCompanion);
    setIsQuestCompleted(false);
    setMemories([]);

    // Local Storage Cache
    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(newCompanion));
      localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(false));
      localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify([]));
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

  const completeQuest = async () => {
    if (!companion) return;

    setIsQuestCompleted(true);

    const memoryId = generateUUID();
    const createdAt = new Date().toISOString();
    const content = `Notice one thing: Studied an object closely. ${companion.name} reflected that curiosity starts tiny.`;
    const questId = "notice_one_thing";

    const newMemory: CompanionMemory = {
      id: memoryId,
      companionId: companion.id,
      content,
      questId,
      createdAt,
    };

    const updatedMemories = [newMemory, ...memories];
    setMemories(updatedMemories);

    // Local Storage Cache
    try {
      localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(true));
      localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(updatedMemories));
    } catch (error) {
      console.error("Local save failed:", error);
    }

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("companion_memories").insert({
          id: memoryId,
          companion_id: companion.id,
          content,
          quest_id: questId,
          created_at: createdAt,
        });

        if (error) {
          console.error("Failed to save memory to Supabase:", error);
        } else {
          console.log("Cabbits: Persisted memory entry to Supabase.");
        }
      } catch (error) {
        console.error("Failed database client connection:", error);
      }
    }
  };

  const resetCompanion = async () => {
    const prevCompanionId = companion?.id;
    setCompanion(null);
    setIsQuestCompleted(false);
    setMemories([]);

    try {
      localStorage.removeItem(COMPANION_STORAGE_KEY);
      localStorage.removeItem(QUEST_STORAGE_KEY);
      localStorage.removeItem(MEMORIES_STORAGE_KEY);
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
        createCompanion,
        completeQuest,
        resetCompanion,
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
