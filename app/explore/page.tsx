"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { Quest, Location } from "@/types";
import { getLandmarkComment } from "@/lib/agents/dialogue";
import { useMainShell, useMainShellSidebar } from "@/components/layout/MainShell";
import { motion } from "framer-motion";

const locationExtraMetadata: Record<string, {
  pointsOfInterest: string[];
  characters: string[];
  items: string[];
}> = {
  pond: {
    pointsOfInterest: ["Blue Dome Door", "Lily Pads", "Garden Bench"],
    characters: ["Moss (Cabbit)", "Elder Frog"],
    items: ["Swan Feather"],
  },
  meadow: {
    pointsOfInterest: ["Buttercup Patch", "Purple Clover Clusters", "Hummingbird Nest"],
    characters: ["Pip (Cabbit)"],
    items: ["Glowing Lantern"],
  },
  forest: {
    pointsOfInterest: ["River Bed", "Bridge", "River"],
    characters: ["Wise Owl", "Moss (Cabbit)"],
    items: ["Silver Acorn", "Old Feather"],
  },
  burrow: {
    pointsOfInterest: ["Music Alcove", "Storage Shelf", "Living Room TV"],
    characters: ["Pip (Cabbit)"],
    items: ["Sweet Carrot", "Glowing Lichen Jar"],
  },
  library: {
    pointsOfInterest: ["Ivy Stone Walls", "Forgotten Lore Shelves", "Glowing Rune Tablet"],
    characters: ["Elder Owl"],
    items: ["Deciphered Rune Key"],
  },
};

const locationBackgrounds: Record<string, string> = {
  burrow: "/assets/map_burrow_bg.png",
  pond: "/assets/map_pond_bg.png",
  meadow: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
  forest: "/assets/map_little_bridge_bg.png",
  library: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
};

const poiPositions: Record<string, { top: string; left: string }[]> = {
  pond: [
    { top: "35%", left: "25%" },
    { top: "50%", left: "55%" },
    { top: "40%", left: "80%" },
  ],
  meadow: [
    { top: "45%", left: "20%" },
    { top: "30%", left: "50%" },
    { top: "60%", left: "75%" },
  ],
  forest: [
    { top: "30%", left: "30%" },
    { top: "45%", left: "70%" },
    { top: "65%", left: "40%" },
  ],
  burrow: [
    { top: "35%", left: "20%" },
    { top: "25%", left: "62%" },
    { top: "58%", left: "45%" },
  ],
  library: [
    { top: "40%", left: "25%" },
    { top: "30%", left: "65%" },
    { top: "60%", left: "50%" },
  ],
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
    ? activeDetails.questIds.map((id: string) => quests[id]).filter(Boolean)
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
              const hasReactiveQuest = loc.questIds.some((id: string) => id.startsWith("special_") && !isQuestCompleted(id));
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
            {locationQuests.map((q: Quest) => {
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
  const { companion, isLoading, memories, quests, locations, completedQuestIds } = useCompanion();
  const router = useRouter();

  // Consume global layout context
  const { weather } = useMainShell();

  const [selectedPoi, setSelectedPoi] = useState<string | null>(null);

  // Redirect if companion is not created
  useEffect(() => {
    if (!isLoading && !companion) {
      router.replace("/login");
    }
  }, [isLoading, companion, router]);

  // Clear selected POI when location changes
  useEffect(() => {
    setSelectedPoi(null);
  }, [selectedLoc]);

  if (isLoading || !companion) return null;

  const isQuestCompleted = (questId: string) => {
    return completedQuestIds.includes(questId);
  };

  const evaluateLockStatus = (quest: Quest) => {
    if (!companion) return true;
    return false;
  };

  const activeDetails = selectedLoc ? locations[selectedLoc] : null;
  const activeQuest = selectedPoi
    ? Object.values(quests).find((q) => q.locationId === selectedLoc && q.poiId === selectedPoi)
    : null;

  const getObjectives = (qId: string): string[] => {
    const maps: Record<string, string[]> = {
      notice_one_thing: ["Search the east grove", "Check near the old oak", "Return the acorn to Elder Owl"],
      watch_ripples: ["Study waves near golden lilies", "Count concentric water rings", "Observe wind ripple directions"],
      count_flowers: ["Find yellow buttercups", "Count purple clovers in clusters", "Note petal geometries"],
      wise_owl: ["Climb high branch", "Answer the owl's riddle", "Receive forest history insight"],
      tidy_tunnel: ["Sweep tunnel pine needles", "Organize glowing lichen jars", "Light entrance lantern"],
      decipher_rune: ["Examine ancient stone tablet", "Translate rune characters", "Reveal hidden library message"],
      forest_oak: ["Examine smooth river pebbles", "Sort stones by composition", "Collect river bed samples"],
      forest_perch: ["Inspect wooden walkway planks", "Test handrail bridge stability", "Calculate bridge truss load"],
      forest_undergrowth: ["Observe water current flow speed", "Track floating leaves", "Check for river obstructions"],
      burrow_entrance: ["Inspect piano keys", "Tune acoustic guitar strings", "Adjust warm alcove string lights"],
      burrow_lichen: ["Clean dust off shelves", "Label plant species tags", "Arrange potted ferns and books"],
      burrow_tunnels: ["Check retro TV composite cables", "Plug in game console", "Tune antenna signal channels"],
    };
    return maps[qId] || ["Explore the landmark area", "Log your observations in the journal", "Return to your companion"];
  };

  return (
    <div className="flex-1 flex flex-col bg-[var(--neutral-50)] relative h-full w-full">
      {/* STATE A: NO LOCATION SELECTED -> Render Blueprint Map */}
      {!selectedLoc && (
        <div className="flex-1 flex flex-col relative overflow-hidden pb-16">
          {/* Background Map Image (Handcrafted Felt/Cardboard Map) */}
          <motion.div
            initial={{ filter: "blur(16px)", scale: 0.97 }}
            animate={{ filter: "blur(0px)", scale: 1 }}
            transition={{ type: "spring", stiffness: 85, damping: 16 }}
            className="absolute inset-0 select-none pointer-events-none z-0 size-full"
          >
            <img 
              src="/assets/cabbits_overhead_map.png" 
              alt="Valley Map" 
              className="w-full h-full object-cover opacity-95" 
            />
            {/* Subtle paper grain texture overlay */}
            <div className="absolute inset-0 bg-black/5 mix-blend-multiply opacity-30 pointer-events-none" />
          </motion.div>



          {/* Locations Absolute Pins */}
          {Object.values(locations).map((loc) => {
            const hasReactiveQuest = loc.questIds.some((id: string) => id.startsWith("special_") && !isQuestCompleted(id));
            const displayName = loc.name.replace("Crescent ", "").replace("Green ", "").replace("Pip's ", "");
            const active = selectedLoc === loc.id;
            
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLoc(loc.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10"
                style={{ top: loc.top, left: loc.left }}
              >
                {/* Pin Circle with Inner Dot */}
                <div className={`w-8 h-8 rounded-full border-[4px] border-[#181818] bg-white flex items-center justify-center relative shadow-sm transition-all group-hover:scale-110 active:scale-95 ${
                  hasReactiveQuest ? "ring-4 ring-amber-400/30 animate-pulse" : ""
                }`}>
                  <div className="w-2.5 h-2.5 bg-[#181818] rounded-full" />
                </div>
                
                {/* Custom Label Pill (Pond, Oak Forest, etc.) */}
                <div className={`mt-2 px-3 py-1 font-fredoka font-black text-[12px] uppercase tracking-wider border-2 border-black transition-all ${
                  active 
                    ? "bg-[#181818] text-[#fefdf9] shadow-none translate-x-[2px] translate-y-[2px]" 
                    : hasReactiveQuest 
                    ? "bg-amber-100 text-amber-900 border-dashed border-amber-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" 
                    : "bg-[#fefdf9] text-[#181818] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                }`}>
                  <span className="flex items-center gap-1 select-none">
                    {hasReactiveQuest && <span className="text-amber-600 animate-pulse">✨</span>}
                    {displayName}
                  </span>
                </div>
              </button>
            );
          })}


        </div>
      )}

      {/* STATE B: LOCATION SELECTED -> Render integrated Quest Details Panel */}
      {selectedLoc && activeDetails && (
        <div className="flex-1 flex overflow-hidden relative size-full pb-16 animate-fade-in">
          {/* Location Background Image or Pattern */}
          <div className="absolute inset-0 select-none pointer-events-none z-0 size-full">
            {locationBackgrounds[selectedLoc]?.endsWith(".png") ? (
              <img 
                src={locationBackgrounds[selectedLoc]} 
                alt={activeDetails.name} 
                className="w-full h-full object-cover opacity-95" 
              />
            ) : (
              <div 
                className="w-full h-full opacity-90"
                style={{ background: locationBackgrounds[selectedLoc] || "var(--neutral-50)" }}
              />
            )}
            {/* Subtle paper grain texture overlay */}
            <div className="absolute inset-0 bg-black/5 mix-blend-multiply opacity-30 pointer-events-none" />
          </div>

          {/* Floating dialogue Reflection Bubble */}
          <div className="absolute top-6 left-6 w-[340px] z-20 bg-[#f7f3e6] px-4 py-3 rounded-2xl shadow-lg border border-black/5 flex gap-3 items-center text-left pointer-events-auto select-none">
            <div className="h-8 w-8 rounded-full border-2 border-black bg-white flex items-center justify-center text-sm shrink-0 select-none">
              🐰
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[8px] font-black text-[var(--neutral-500)] uppercase tracking-wider block">
                {companion.name} reflects
              </span>
              <p className="text-[10px] leading-relaxed font-semibold text-[var(--neutral-700)] italic mt-0.5 line-clamp-3">
                {getLandmarkComment(selectedLoc, companion, weather)}
              </p>
            </div>
          </div>

          {/* POI Absolute Pins */}
          {poiPositions[selectedLoc] && locationExtraMetadata[selectedLoc] && (
            <>
              {locationExtraMetadata[selectedLoc].pointsOfInterest.map((poi, idx) => {
                const pos = poiPositions[selectedLoc][idx];
                if (!pos) return null;
                const poiQuest = Object.values(quests).find(q => q.locationId === selectedLoc && q.poiId === poi);
                const completed = poiQuest ? isQuestCompleted(poiQuest.id) : false;
                const active = selectedPoi === poi;
                return (
                  <button
                    key={poi}
                    onClick={() => setSelectedPoi(poi)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 cursor-pointer"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    {/* Pin Circle */}
                    <div className={`w-8 h-8 rounded-full border-[4px] border-[#181818] flex items-center justify-center relative shadow-sm transition-all group-hover:scale-110 ${
                      active ? "bg-black text-white" : completed ? "bg-emerald-100" : "bg-white"
                    }`}>
                      <span className="text-xs">{completed ? "✔️" : "📍"}</span>
                    </div>
                    
                    {/* Label Pill */}
                    <div className={`mt-2 px-2.5 py-0.5 font-fredoka font-black text-[9px] uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none whitespace-nowrap transition-all ${
                      active ? "bg-black text-[#fefdf9]" : completed ? "bg-emerald-100 text-emerald-900" : "bg-[#fefdf9] text-[#181818]"
                    }`}>
                      {poi}
                    </div>
                  </button>
                );
              })}
            </>
          )}

          {/* Floating Quest details Card (Pinned to Right) */}
          <div className="absolute right-6 top-6 bottom-6 w-[280px] bg-white chunky-panel p-5 z-20 flex flex-col justify-between overflow-y-auto text-left pointer-events-auto">
            {activeQuest ? (
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)]">Active Quest</span>
                    <button
                      onClick={() => { setSelectedPoi(null); setSelectedLoc(null); }}
                      className="text-xs font-extrabold uppercase text-[var(--neutral-400)] hover:text-[var(--neutral-900)] cursor-pointer"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-full text-white text-[10px] font-black px-2.5 py-0.5 uppercase tracking-wider inline-block ${
                        isQuestCompleted(activeQuest.id) ? "bg-black border-2 border-black" : evaluateLockStatus(activeQuest) ? "bg-neutral-400 border-2 border-neutral-400" : "bg-black border-2 border-black"
                      }`}>
                        {isQuestCompleted(activeQuest.id) ? "COMPLETED" : evaluateLockStatus(activeQuest) ? "LOCKED" : "AVAILABLE"}
                      </span>
                      {activeQuest.id.startsWith("special_") && (
                        <span className="rounded-full border border-dashed border-amber-500 text-amber-700 text-[10px] font-black px-2.5 py-0.5 uppercase tracking-wider inline-block bg-amber-50/20">
                          ✨ REACTIVE ✨
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-black leading-snug uppercase mt-2">{activeQuest.title}</h3>
                    <span className="text-[11px] text-[var(--neutral-500)] font-semibold mt-0.5 block">
                      Landmark: {activeDetails?.name || activeQuest.poiId}
                    </span>
                  </div>

                  <hr className="border-[var(--neutral-200)]" />

                  {/* Description */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)] block mb-1">Description</span>
                    <p className="text-[12px] leading-relaxed text-[var(--neutral-700)] font-semibold">
                      {activeQuest.description}
                    </p>
                  </div>

                  {/* Objectives */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)] block mb-1">Objectives</span>
                    <div className="space-y-1.5">
                      {getObjectives(activeQuest.id).map((obj, i) => (
                        <div key={i} className="flex gap-2 items-center text-[12px] font-semibold text-[var(--neutral-700)]">
                          <span className="text-xs text-[var(--neutral-400)]">○</span>
                          <span className="truncate">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-auto">
                  <hr className="border-[var(--neutral-200)]" />
                  
                  {/* Action button */}
                  {isQuestCompleted(activeQuest.id) ? (
                    <div className="w-full chunky-panel bg-[var(--neutral-100)] py-3 text-center font-black text-[var(--neutral-500)] text-xs border-dashed border-black/45 shadow-none select-none uppercase">
                      Quest Completed ✔️
                    </div>
                  ) : evaluateLockStatus(activeQuest) ? (
                    <div className="w-full chunky-panel bg-[var(--neutral-100)] py-3.5 text-center font-black text-[var(--neutral-500)] text-xs border-dashed border-black/45 shadow-none select-none uppercase">
                      🔒 {activeQuest.unlockCondition}
                    </div>
                  ) : (
                    <button
                      onClick={() => router.push(`/quest?questId=${activeQuest.id}`)}
                      className={`w-full py-3.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer chunky-button !bg-black hover:!bg-neutral-900 !text-white`}
                    >
                      Begin Quest →
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 gap-3">
                <span className="text-2xl select-none">📍</span>
                <p className="text-xs font-black text-black uppercase tracking-wider">Select a Landmark</p>
                <p className="text-xs text-[var(--neutral-500)] leading-relaxed max-w-[200px]">
                  Tap one of the three landmark pins on the map to inspect its active quest!
                </p>
              </div>
            )}
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

  // Close location details with ESC instead of navigating away
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedLoc) {
        setSelectedLoc(null);
        // Prevent further handling that might navigate away
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener('keydown', handleEsc, true);
    return () => window.removeEventListener('keydown', handleEsc, true);
  }, [selectedLoc]);

  const { setSidebarContent } = useMainShellSidebar();

  useEffect(() => {
    setSidebarContent(
      <ExploreSidebar 
        selectedLoc={selectedLoc} 
        setSelectedLoc={setSelectedLoc} 
        activeQuestId={activeQuestId} 
        setActiveQuestId={setActiveQuestId} 
      />
    );
    return () => setSidebarContent(null);
  }, [selectedLoc, activeQuestId, setSidebarContent]);

  return (
    <ExploreContent selectedLoc={selectedLoc} setSelectedLoc={setSelectedLoc} activeQuestId={activeQuestId} setActiveQuestId={setActiveQuestId} />
  );
}
