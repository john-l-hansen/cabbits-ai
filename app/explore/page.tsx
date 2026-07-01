"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { CompanionOrb } from "@/components/companion/CompanionOrb";
import { Patrick_Hand } from "next/font/google";
import { LOCATIONS, Location } from "@/lib/data/locations";
import { QUESTS, Quest } from "@/lib/data/quests";

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function ExplorePage() {
  const { companion, isLoading, memories } = useCompanion();
  const router = useRouter();

  const [timeStr, setTimeStr] = useState("10:30 AM");
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);

  // Redirect if companion is not created
  useEffect(() => {
    if (!isLoading && !companion) {
      router.replace("/companion/new");
    }
  }, [isLoading, companion, router]);

  // Tick time timer
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !companion) {
    return (
      <main className="min-h-screen px-6 py-8 flex items-center justify-center bg-[#F9F7F0]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <CompanionOrb mood="idle" />
          <p className="text-sm text-black/40">Loading map...</p>
        </div>
      </main>
    );
  }

  // Check if a quest is completed based on companion memories
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

  // Evaluate dynamic lock status based on companion progress
  const evaluateLockStatus = (quest: Quest) => {
    if (!quest.isLocked) return false;
    if (quest.id === "wise_owl" || quest.id === "tidy_tunnel") {
      return companion.insightsCount < 1;
    }
    if (quest.id === "decipher_rune") {
      return companion.insightsCount < 2;
    }
    return true;
  };

  const activeDetails = selectedLoc ? LOCATIONS[selectedLoc] : null;

  // Retrieve quest entities linked to this location
  const locationQuests = activeDetails
    ? activeDetails.questIds.map((id) => QUESTS[id]).filter(Boolean)
    : [];

  // Find the primary launchable quest in the active location
  const primaryQuest = locationQuests.find(
    (q) => !evaluateLockStatus(q) && !isQuestCompleted(q.id)
  );

  return (
    <main className={`min-h-screen bg-[#E5DDC8] p-4 flex justify-center items-center ${patrickHand.className}`}>
      {/* PHONE/VIEWPORT FRAME */}
      <section className="relative w-full max-w-sm h-[calc(100vh-2rem)] min-h-[580px] rounded-[2.5rem] border-[6px] border-black/80 bg-[#FAF7F0] shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* TIME & WEATHER HEADER */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-center z-20">
          <div className="bg-[#FAF7F0]/90 border border-black/10 shadow-3xs rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm font-semibold">
            <span>☀️</span>
            <span>{timeStr}</span>
          </div>

          <div className="bg-[#FAF7F0]/90 border border-black/10 shadow-3xs rounded-full px-3 py-1.5 flex items-center gap-1 text-sm font-semibold">
            <span className="text-amber-500">🪙</span>
            <span>{companion.carrotCoins}</span>
          </div>
        </div>

        {/* MAP CANVAS */}
        <div
          className="relative flex-1 bg-cover bg-center"
          style={{ backgroundImage: "url(/assets/cabbits_overhead_map.png)" }}
        >
          {Object.values(LOCATIONS).map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLoc(loc.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer animate-fade-in"
              style={{ top: loc.top, left: loc.left }}
            >
              <span className="absolute -top-6 text-[10px] bg-black/75 text-white px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-sans tracking-wide pointer-events-none whitespace-nowrap">
                {loc.name}
              </span>
              <div className={`h-8 w-8 rounded-full border-2 border-black flex items-center justify-center text-sm transition-all ${
                selectedLoc === loc.id ? "bg-amber-300 scale-110 shadow-xs" : "bg-white/90 hover:bg-white"
              }`}>
                {loc.pinEmoji}
              </div>
            </button>
          ))}
        </div>

        {/* BOTTOM NAV BAR */}
        <nav className="bg-[#FAF7F0] border-t-4 border-black/80 px-2 py-3.5 flex justify-around items-center z-30">
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 transition-all text-black/55"
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs font-bold">Home</span>
          </Link>

          <button
            className="flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 transition-all text-amber-700 bg-amber-50/50 px-2 py-0.5 rounded-xl border border-amber-900/10 shadow-3xs"
          >
            <span className="text-xl">🌍</span>
            <span className="text-xs font-bold">Explore</span>
          </button>

          <Link
            href="/bookshelf"
            className="flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 transition-all text-black/55"
          >
            <span className="text-xl">📖</span>
            <span className="text-xs font-bold">Learn</span>
          </Link>

          <Link
            href="/#inventory"
            className="flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 transition-all text-black/55"
          >
            <span className="text-xl">🎒</span>
            <span className="text-xs font-bold">Bag</span>
          </Link>

          <Link
            href="/#profile"
            className="flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 transition-all text-black/55"
          >
            <span className="text-xl">🐰</span>
            <span className="text-xs font-bold">Profile</span>
          </Link>
        </nav>

        {/* LOCATION DETAILS SLIDING BOTTOM SHEET */}
        {selectedLoc && activeDetails && (
          <div className="absolute inset-x-0 bottom-[68px] z-30 bg-[#FCFBF7] border-t-4 border-black/80 rounded-t-[2rem] p-5 shadow-lg space-y-4 animate-slide-up max-h-[50%] overflow-y-auto">
            <div className="flex justify-between items-center pb-1 border-b border-black/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-dark)]">
                  Quest Location
                </span>
                <h3 className="text-lg font-bold leading-tight mt-0.5">{activeDetails.name}</h3>
              </div>
              <button
                onClick={() => setSelectedLoc(null)}
                className="text-xs font-bold text-black/40 hover:text-black cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs leading-5 text-black/65">{activeDetails.description}</p>

            {/* Quests Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-black/40">Quests Here</h4>
              
              <div className="space-y-2">
                {locationQuests.map((q) => {
                  const completed = isQuestCompleted(q.id);
                  const locked = evaluateLockStatus(q);

                  return (
                    <div
                      key={q.id}
                      className={`flex items-center gap-3 p-2.5 rounded-2xl border-2 border-black/40 shadow-3xs ${
                        completed ? "bg-emerald-50/40 opacity-70" : locked ? "bg-black/5 opacity-60" : "bg-white"
                      }`}
                    >
                      <span className="text-sm shrink-0">
                        {completed ? "✔️" : locked ? "🔒" : "✨"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-black/80 truncate">{q.title}</h5>
                        <p className="text-[10px] text-black/40 uppercase tracking-wide">
                          {completed ? "COMPLETED" : locked ? `LOCKED (${q.unlockCondition})` : "AVAILABLE"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Launch Active Quest button */}
            {primaryQuest ? (
              <button
                onClick={() => {
                  router.push(`/quest?questId=${primaryQuest.id}`);
                }}
                className="w-full rounded-full bg-[var(--accent-dark)] py-3.5 text-center font-bold text-white shadow-sm hover:brightness-110 cursor-pointer active:scale-95 transition-all text-xs"
              >
                Explore This Location
              </button>
            ) : (
              <div className="rounded-full bg-black/10 py-3.5 text-center font-bold text-black/40 text-xs select-none">
                All Available Quests Complete
              </div>
            )}
          </div>
        )}

      </section>
    </main>
  );
}
