"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { Location } from "@/lib/data/locations";
import { Quest } from "@/lib/data/quests";
import { getLandmarkComment } from "@/lib/agents/dialogue";
import { MainShell, useMainShell } from "@/components/layout/MainShell";

const locationExtraMetadata: Record<string, {
  pointsOfInterest: string[];
  characters: string[];
  items: string[];
}> = {
  pond: {
    pointsOfInterest: ["Golden Lilies", "Center Ripples", "East Grove"],
    characters: ["Moss (Cabbit)", "Elder Frog"],
    items: ["Swan Feather"],
  },
  meadow: {
    pointsOfInterest: ["Buttercup Patch", "Purple Clover Clusters", "Hummingbird Nest"],
    characters: ["Pip (Cabbit)"],
    items: ["Glowing Lantern"],
  },
  forest: {
    pointsOfInterest: ["Ancient Oak Tree", "High Perch Branch", "Whispering Undergrowth"],
    characters: ["Wise Owl", "Moss (Cabbit)"],
    items: ["Silver Acorn", "Old Feather"],
  },
  burrow: {
    pointsOfInterest: ["Warm Lantern Entrance", "Lichen Storage Shelf", "Comfortable Tunnels"],
    characters: ["Pip (Cabbit)"],
    items: ["Sweet Carrot", "Glowing Lichen Jar"],
  },
  library: {
    pointsOfInterest: ["Ivy Stone Walls", "Forgotten Lore Shelves", "Glowing Rune Tablet"],
    characters: ["Elder Owl"],
    items: ["Deciphered Rune Key"],
  },
};

interface ExploreStateProps {
  selectedLoc: string | null;
  setSelectedLoc: (id: string | null) => void;
  activeQuestId: string | null;
  setActiveQuestId: (id: string | null) => void;
}

function ExploreSidebar({ selectedLoc, setSelectedLoc, activeQuestId, setActiveQuestId }: ExploreStateProps) {
  const { companion, memories, quests, locations } = useCompanion();

  const isQuestCompleted = (questId: string) => {
    return memories.some((m) => {
      if (m.questId === questId) return true;
      try {
        const parsed = JSON.parse(m.content);
        return parsed.questId === questId;
      } catch (e) {
        return false;
      }
    });
  };

  const evaluateLockStatus = (quest: Quest) => {
    if (!companion) return true;
    if (!quest.isLocked) return false;
    if (quest.id === "wise_owl" || quest.id === "tidy_tunnel") {
      return companion.insightsCount < 1;
    }
    if (quest.id === "decipher_rune") {
      return companion.insightsCount < 2;
    }
    return true;
  };

  if (!companion) return null;

  const activeDetails = selectedLoc ? locations[selectedLoc] : null;
  const locationQuests = activeDetails
    ? activeDetails.questIds.map((id) => quests[id]).filter(Boolean)
    : [];

  return (
    <div className="w-full text-left">
      {!selectedLoc ? (
        /* VIEW 1: Locations List */
        <div className="space-y-4">
          <span className="text-[10px] font-semibold tracking-[0.5px] text-[var(--neutral-500)] uppercase block">Locations</span>
          <div className="space-y-2">
            {Object.values(locations).map((loc) => {
              const active = selectedLoc === loc.id;
              const hasReactiveQuest = loc.questIds.some(id => id.startsWith("special_") && !isQuestCompleted(id));
              const displayName = loc.name.replace("Crescent ", "").replace("Green ", "").replace("Pip's ", "");
              
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLoc(loc.id)}
                  className={`w-full text-left p-3.5 flex items-center gap-3 transition-all cursor-pointer chunky-button ${
                    active 
                      ? "bg-[var(--neutral-50)] shadow-none translate-x-[2px] translate-y-[2px]" 
                      : hasReactiveQuest 
                      ? "border-dashed border-amber-500 bg-amber-50/20" 
                      : ""
                  }`}
                >
                  <div className="h-8 w-8 rounded-full border border-[var(--neutral-300)] bg-[var(--neutral-50)] flex items-center justify-center text-xs select-none shrink-0">
                    {loc.pinEmoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-[var(--neutral-900)] truncate">
                        {displayName}
                      </h4>
                      {hasReactiveQuest && <span className="text-xxs animate-pulse">✨</span>}
                    </div>
                    <p className="text-[10px] text-[var(--neutral-500)] truncate mt-0.5 font-medium">
                      {loc.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: Selected Location Quests */
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setSelectedLoc(null)}
              className="text-[10px] font-extrabold uppercase tracking-[0.5px] text-[var(--neutral-500)] hover:text-black flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none text-left"
            >
              ← Locations overview
            </button>
            <div className="min-w-0 text-left pt-1">
              <h3 className="text-sm font-bold text-[var(--neutral-900)] leading-tight">
                {activeDetails?.name.replace("Crescent ", "").replace("Green ", "").replace("Pip's ", "")}
              </h3>
              <span className="text-[9px] font-extrabold text-[var(--neutral-400)] uppercase block mt-0.5 tracking-wider">
                Landmark Quests
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {locationQuests.map((q) => {
              const completed = isQuestCompleted(q.id);
              const locked = evaluateLockStatus(q);
              const active = activeQuestId === q.id;
              const isReactive = q.id.startsWith("special_");

              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestId(q.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-2.5 transition-all cursor-pointer chunky-button ${
                    active 
                      ? "bg-[var(--neutral-50)] shadow-none translate-x-[2px] translate-y-[2px]" 
                      : isReactive 
                      ? "border-dashed border-amber-500 bg-amber-50/20" 
                      : ""
                  }`}
                >
                  <span className="text-xs shrink-0 mt-0.5">
                    {completed ? "✔️" : locked ? "🔒" : "✨"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-[var(--neutral-900)] leading-snug">{q.title}</h5>
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider block mt-1 ${
                      isReactive ? "text-amber-600 animate-pulse" : "text-[var(--neutral-400)]"
                    }`}>
                      {isReactive ? "✨ REACTIVE QUEST ✨" : (completed ? "COMPLETED" : locked ? "LOCKED" : "AVAILABLE")}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function ExploreContent({ selectedLoc, setSelectedLoc, activeQuestId, setActiveQuestId }: ExploreStateProps) {
  const { companion, isLoading, memories, quests, locations } = useCompanion();
  const router = useRouter();

  // Consume global layout context
  const { weather } = useMainShell();

  // Redirect if companion is not created
  useEffect(() => {
    if (!isLoading && !companion) {
      router.replace("/login");
    }
  }, [isLoading, companion, router]);

  // Update selected quest when location changes
  useEffect(() => {
    if (selectedLoc) {
      const loc = locations[selectedLoc];
      if (loc && loc.questIds.length > 0) {
        const incomplete = loc.questIds.find(id => !isQuestCompleted(id));
        setActiveQuestId(incomplete || loc.questIds[0]);
      } else {
        setActiveQuestId(null);
      }
    } else {
      setActiveQuestId(null);
    }
  }, [selectedLoc, locations]);

  if (isLoading || !companion) return null;

  const isQuestCompleted = (questId: string) => {
    return memories.some((m) => {
      if (m.questId === questId) return true;
      try {
        const parsed = JSON.parse(m.content);
        return parsed.questId === questId;
      } catch (e) {
        return false;
      }
    });
  };

  const evaluateLockStatus = (quest: Quest) => {
    if (!companion) return true;
    if (!quest.isLocked) return false;
    if (quest.id === "wise_owl" || quest.id === "tidy_tunnel") {
      return companion.insightsCount < 1;
    }
    if (quest.id === "decipher_rune") {
      return companion.insightsCount < 2;
    }
    return true;
  };

  const activeDetails = selectedLoc ? locations[selectedLoc] : null;
  const activeQuest = activeQuestId ? quests[activeQuestId] : null;

  const getObjectives = (qId: string): string[] => {
    const maps: Record<string, string[]> = {
      notice_one_thing: ["Search the east grove", "Check near the old oak", "Return the acorn to Elder Owl"],
      watch_ripples: ["Study waves near golden lilies", "Count concentric water rings", "Observe wind ripple directions"],
      count_flowers: ["Find yellow buttercups", "Count purple clovers in clusters", "Note petal geometries"],
      wise_owl: ["Climb high branch", "Answer the owl's riddle", "Receive forest history insight"],
      tidy_tunnel: ["Sweep tunnel pine needles", "Organize glowing lichen jars", "Light entrance lantern"],
      decipher_rune: ["Examine ancient stone tablet", "Translate rune characters", "Reveal hidden library message"],
    };
    return maps[qId] || ["Explore the landmark area", "Log your observations in the journal", "Return to your companion"];
  };

  return (
    <div className="flex-1 flex flex-col bg-[var(--neutral-50)] relative h-full w-full">
      {/* STATE A: NO LOCATION SELECTED -> Render Blueprint Map */}
      {!selectedLoc && (
        <div className="flex-1 flex flex-col relative overflow-hidden pb-16">
          {/* Background Map Image (Handcrafted Felt/Cardboard Map) */}
          <div className="absolute inset-0 select-none pointer-events-none z-0">
            <img 
              src="/assets/cabbits_overhead_map.png" 
              alt="Valley Map" 
              className="w-full h-full object-cover opacity-95" 
            />
            {/* Subtle paper grain texture overlay */}
            <div className="absolute inset-0 bg-black/5 mix-blend-multiply opacity-30 pointer-events-none" />
          </div>



          {/* Locations Absolute Pins */}
          {Object.values(locations).map((loc) => {
            const hasReactiveQuest = loc.questIds.some(id => id.startsWith("special_") && !isQuestCompleted(id));
            const displayName = loc.name.replace("Crescent ", "").replace("Green ", "").replace("Pip's ", "");
            
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLoc(loc.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10"
                style={{ top: loc.top, left: loc.left }}
              >
                <div className="absolute -top-10 bg-[var(--neutral-1000)] text-white text-[9px] font-black px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all font-sans tracking-wider pointer-events-none shadow-sm whitespace-nowrap">
                  {loc.name}
                </div>
                
                <div className={`h-4 w-4 rounded-full border-2 bg-[var(--neutral-0)] transition-all group-hover:scale-125 active:scale-90 ${
                  hasReactiveQuest 
                    ? "border-amber-500 bg-amber-50/20 animate-pulse ring-4 ring-amber-400/30" 
                    : "border-[var(--neutral-900)]"
                }`} />
                
                <span className="text-[10px] font-semibold tracking-[0.5px] uppercase mt-1 flex items-center gap-0.5 text-[color:var(--neutral-900)]">
                  {hasReactiveQuest && <span className="text-amber-600 animate-pulse">✨</span>}
                  {displayName}
                  {hasReactiveQuest && <span className="text-amber-600 animate-pulse">✨</span>}
                </span>
              </button>
            );
          })}


        </div>
      )}

      {/* STATE B: LOCATION SELECTED -> Render integrated Quest Details Panel */}
      {selectedLoc && activeDetails && (
        <div className="flex-1 flex overflow-hidden animate-fade-in bg-[var(--neutral-0)] pb-16">
          {/* Left panel: Illustration, Landmark Metadata, and Rewards */}
          <div className="flex-1 border-r-4 border-black p-6 flex flex-col gap-6 bg-[var(--neutral-0)] overflow-y-auto">
            {/* Atmospheric bubble */}
            <div className="flex gap-3 chunky-panel p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative shrink-0">
              <div className="h-10 w-10 bg-[var(--neutral-0)] border border-[var(--neutral-200)] rounded-full flex items-center justify-center text-xl shrink-0 select-none">
                🐰
              </div>
              <div className="text-left min-w-0">
                <span className="text-[9px] font-bold text-[var(--neutral-500)] uppercase tracking-wide">
                  {companion.name} reflects
                </span>
                <p className="text-xs font-medium text-[var(--neutral-700)] mt-0.5 leading-normal italic">
                  {getLandmarkComment(selectedLoc, companion, weather)}
                </p>
              </div>
            </div>

            {/* Quest Illustration placeholder */}
            <div className="h-48 chunky-panel border-dashed border-black/45 bg-[var(--neutral-50)] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden select-none shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {/* Crossed wireframe lines */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full stroke-[var(--neutral-200)]" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="0" x2="100%" y2="100%" strokeDasharray="4 4" />
                  <line x1="0" y1="100%" x2="100%" y2="0" strokeDasharray="4 4" />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="h-14 w-14 rounded-full border border-dashed border-[var(--neutral-400)] bg-[var(--neutral-0)] flex items-center justify-center text-3xl shadow-3xs mb-2 animate-pulse">
                  {selectedLoc === "pond" ? "🌊" : selectedLoc === "meadow" ? "🌸" : selectedLoc === "forest" ? "🌲" : selectedLoc === "burrow" ? "🏠" : "📚"}
                </div>
                <h4 className="text-xs font-black text-[var(--neutral-900)] uppercase tracking-wide">
                  {activeDetails.name} Illustration
                </h4>
                <p className="text-[10px] text-[var(--neutral-500)] max-w-xs mt-1 leading-normal font-medium">
                  Explore the coordinates of {activeDetails.name} to observe patterns and complete logs.
                </p>
              </div>
            </div>

            {/* Landmark Directory Details */}
            {selectedLoc && locationExtraMetadata[selectedLoc] && (
              <div className="grid grid-cols-2 gap-4 text-left chunky-panel p-4 bg-[var(--neutral-50)] select-none shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-400)] block">
                    Points of Interest
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {locationExtraMetadata[selectedLoc].pointsOfInterest.map((poi, idx) => (
                      <span key={idx} className="bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none text-[9px] font-black text-[var(--neutral-700)]">
                        📍 {poi}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-400)] block">
                    Characters Present
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {locationExtraMetadata[selectedLoc].characters.map((char, idx) => (
                      <span key={idx} className="bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none text-[9px] font-black text-[var(--neutral-700)]">
                        👤 {char}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-400)] block">
                        Items Found Here
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {locationExtraMetadata[selectedLoc].items.map((item, idx) => (
                          <span key={idx} className="bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none text-[9px] font-black text-[var(--neutral-700)]">
                            📦 {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-400)] block">
                        Atmosphere
                      </span>
                      <span className="bg-white border border-[var(--neutral-200)] px-2 py-0.5 rounded text-[9px] font-extrabold text-[var(--neutral-700)] inline-block">
                        {weather === "sunny" ? "☀️ Sunny (18°C)" : weather === "rainy" ? "🌧️ Rainy (12°C)" : "❄️ Snowy (-2°C)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rewards section */}
            <div className="space-y-3 shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)] block text-left">Rewards on Completion</span>
              <div className="grid grid-cols-3 gap-3">
                <div className="chunky-panel p-3 text-center bg-[var(--neutral-50)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-lg">⭐</span>
                  <p className="text-xs font-bold text-[var(--neutral-900)] mt-1">+80 XP</p>
                </div>
                <div className="chunky-panel p-3 text-center bg-[var(--neutral-50)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-lg">🪙</span>
                  <p className="text-xs font-bold text-[var(--neutral-900)] mt-1">+15 Coins</p>
                </div>
                <div className="chunky-panel p-3 text-center bg-[var(--neutral-50)] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-lg">🏅</span>
                  <p className="text-xs font-bold text-[var(--neutral-900)] mt-1">Badge</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Details and Action */}
          <div className="w-80 p-6 flex flex-col justify-between bg-[var(--neutral-50)] shrink-0 text-left border-l-4 border-black overflow-y-auto">
            {/* Active Quest info */}
            {activeQuest ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-500)]">Active Quest</span>
                  <button
                    onClick={() => setSelectedLoc(null)}
                    className="text-xxs font-extrabold uppercase text-[var(--neutral-400)] hover:text-[var(--neutral-900)]"
                  >
                    ✕ Close
                  </button>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full text-white text-[9px] font-black px-2.5 py-0.5 uppercase tracking-wider inline-block ${
                      activeQuest.id.startsWith("special_") ? "bg-amber-600 animate-pulse border-2 border-black text-white" : "bg-black border-2 border-black text-white"
                    }`}>
                      {isQuestCompleted(activeQuest.id) ? "COMPLETED" : evaluateLockStatus(activeQuest) ? "LOCKED" : "IN PROGRESS"}
                    </span>
                    {activeQuest.id.startsWith("special_") && (
                      <span className="rounded-full border border-dashed border-amber-500 text-amber-700 text-[9px] font-black px-2.5 py-0.5 uppercase tracking-wider inline-block bg-amber-50/20">
                        ✨ REACTIVE QUEST ✨
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-[var(--neutral-900)] leading-tight mt-2">
                    {activeQuest.title}
                  </h2>
                  <span className="text-[10px] text-[var(--neutral-500)] font-medium mt-1 block">
                    Landmark: {activeDetails.name}
                  </span>
                </div>

                <hr className="border-[var(--neutral-200)]" />

                {/* Description */}
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-500)] block mb-1">Description</span>
                  <p className="text-xs leading-relaxed text-[var(--neutral-750)]">
                    {activeQuest.description}
                  </p>
                </div>

                {/* Objectives */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-500)] block mb-1">Objectives</span>
                  <div className="space-y-1.5">
                    {getObjectives(activeQuest.id).map((obj, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[var(--neutral-700)]">
                        <span className="text-[var(--neutral-400)]">○</span>
                        <span className="font-medium">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-[var(--neutral-500)] text-xs">
                Select a quest from the list to view details.
              </div>
            )}

            {/* CTAs */}
            <div className="pt-6 border-t border-[var(--neutral-200)] space-y-2 mt-6">
              {activeQuest && !isQuestCompleted(activeQuest.id) && !evaluateLockStatus(activeQuest) ? (
                <button
                  onClick={() => {
                    router.push(`/quest?questId=${activeQuest.id}`);
                  }}
                  className={`w-full py-3.5 text-xs text-white cursor-pointer chunky-button \${
                    activeQuest.id.startsWith("special_") 
                      ? "bg-amber-600 hover:bg-amber-700 animate-pulse border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" 
                      : "bg-black hover:bg-neutral-900 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  Explore Location →
                </button>
              ) : activeQuest && evaluateLockStatus(activeQuest) ? (
                <div className="w-full chunky-panel bg-[var(--neutral-100)] py-3.5 text-center font-black text-[var(--neutral-500)] text-xs border-dashed border-black/45 shadow-none select-none">
                  🔒 {activeQuest.unlockCondition}
                </div>
              ) : (
                <div className="w-full chunky-panel bg-[var(--neutral-100)] py-3.5 text-center font-black text-[var(--neutral-500)] text-xs border-dashed border-black/45 shadow-none select-none">
                  ✓ All Available Quests Complete
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Global Shell Wrapper
export default function ExplorePage() {
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);

  return (
    <MainShell sidebarContent={<ExploreSidebar selectedLoc={selectedLoc} setSelectedLoc={setSelectedLoc} activeQuestId={activeQuestId} setActiveQuestId={setActiveQuestId} />}>
      <ExploreContent selectedLoc={selectedLoc} setSelectedLoc={setSelectedLoc} activeQuestId={activeQuestId} setActiveQuestId={setActiveQuestId} />
    </MainShell>
  );
}
