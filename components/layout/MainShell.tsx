"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { CabbitVectorPreview, parseKeepsake } from "@/components/companion/CabbitVectorPreview";
import { Item } from "@/types";

type WeatherType = "rainy" | "sunny" | "snowy";

const WEATHER_DETAILS: Record<WeatherType, { label: string; icon: string; temp: string }> = {
  rainy: { label: "Rainy", icon: "🌧️", temp: "18°C" },
  sunny: { label: "Sunny", icon: "☀️", temp: "24°C" },
  snowy: { label: "Snowy", icon: "❄️", temp: "-1°C" },
};

const MOCK_LETTERS = [
  {
    id: "welcome",
    sender: "Orchestrator",
    subject: "Your learning journey begins!",
    content: "Welcome to Cabbits! Tap on the bookshelf to select stories, or click the quest card to complete daily check-ins.",
    date: "Today",
    time: "9:41 AM",
    paragraphs: [
      "Welcome to Cabbits! We are so excited to have you here.",
      "Your journey as a nature explorer starts today. Head over to the bookshelf in your room to pick your first lesson.",
      "As you explore and learn, you will unlock new locations, meet interesting characters, and earn rewards.",
      "Remember: every small observation matters.",
      "Good luck, explorer!"
    ]
  },
  {
    id: "botany",
    sender: "Botany Specialist",
    subject: "Studying plants closely",
    content: "I reviewed your green plant observation. Remember, leaves have structured veins that transport water. Keep looking!",
    date: "1 day ago",
    time: "3:15 PM",
    paragraphs: [
      "Greetings, junior botanist!",
      "I reviewed your first green plant observation from the Meadow. Remember, leaves have structured vascular bundles (veins) that transport water.",
      "Pay close attention to vein patterns on different leaves during your quest. Parallel or webbed?",
      "Keep up the diligent observation!",
      "Warmly, the Botany Specialist"
    ]
  },
];

interface MainShellContextType {
  weather: WeatherType;
  timeStr: string;
}

const MainShellContext = createContext<MainShellContextType | null>(null);

export function useMainShell() {
  const ctx = useContext(MainShellContext);
  if (!ctx) throw new Error("useMainShell must be used within MainShell");
  return ctx;
}

const SegmentedMeter = ({ max = 5, filled, type }: { max?: number; filled: number; type: "energy" | "hunger" | "mood" }) => (
  <div className="segmented-meter w-full mt-1">
    {Array.from({ length: max }).map((_, idx) => {
      const active = idx < filled;
      return (
        <div
          key={idx}
          className={`segmented-cell ${
            active ? `active-${type}` : ""
          }`}
        />
      );
    })}
  </div>
);

export function MainShell({ children, sidebarContent }: { children: React.ReactNode; sidebarContent?: React.ReactNode }) {
  const {
    companion,
    isLoading,
    books,
    items,
    draftObjects,
    journalEntries,
    resetCompanion,
    approveDraftObject,
    discardDraftObject,
  } = useCompanion();

  const router = useRouter();
  const pathname = usePathname();

  // Global Shell States
  const [timeStr, setTimeStr] = useState("10:30 AM");
  const [weather, setWeather] = useState<WeatherType>("sunny");
  const [activeSheet, setActiveSheet] = useState<"none" | "inventory" | "profile">("none");
  const [showMailbox, setShowMailbox] = useState(false);
  const [readLetters, setReadLetters] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<any>(null);

  // Drawer inner states
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [profileSubTab, setProfileSubTab] = useState<"info" | "dreams">("info");
  const [backpackSubTab, setBackpackSubTab] = useState<"items" | "journal">("items");
  const [selectedJournal, setSelectedJournal] = useState<any>(null);

  const [customs, setCustoms] = useState<{
    earStyle: "floppy" | "pointy" | "round";
    eyeStyle: "wide" | "sleepy" | "sparkle";
    furColor: string;
    keepsake: string;
  }>({
    earStyle: "pointy",
    eyeStyle: "wide",
    furColor: "cream",
    keepsake: "",
  });

  // Time Tick
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Support opening profile slideover on load if URL has sheet=profile
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sheet = params.get("sheet");
      if (sheet === "profile") {
        setActiveSheet("profile");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Load customizations
  useEffect(() => {
    const saved = localStorage.getItem("cabbits_customizations");
    if (saved) {
      try {
        setCustoms(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [companion]);

  if (isLoading || !companion) {
    return (
      <main className="h-screen w-screen px-6 py-8 flex items-center justify-center bg-[var(--neutral-50)]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="text-4xl">🐰</div>
          <p className="text-sm text-[var(--neutral-500)]">Loading interface...</p>
        </div>
      </main>
    );
  }

  const handleWeatherClick = () => {
    if (weather === "rainy") setWeather("sunny");
    else if (weather === "sunny") setWeather("snowy");
    else setWeather("rainy");
  };

  const handleResetSession = () => {
    if (confirm("Reset current companion details and restart customizer?")) {
      resetCompanion();
      router.push("/login");
    }
  };

  const hasUnread = MOCK_LETTERS.length > readLetters.length;

  const getEnergyStatus = () => {
    if (companion.cabbitMood === "sleeping") return "████ (Resting)";
    if (companion.cabbitMood === "hungry") return "█░░░ (Low)";
    return "███░ (Good)";
  };

  const getEnergySegments = () => {
    if (companion.cabbitMood === "sleeping") return 5;
    if (companion.cabbitMood === "hungry") return 1;
    return 3;
  };

  const getHungerSegments = () => {
    if (companion.cabbitMood === "hungry") return 2;
    return 4;
  };

  const getMoodSegments = () => {
    if (companion.cabbitMood === "sleeping") return 2;
    if (companion.cabbitMood === "happy") return 5;
    return 4;
  };

  const getHungerStatus = () => {
    if (companion.cabbitMood === "hungry") return "●●○○○";
    return "●●●●○";
  };

  const getMoodStatus = () => {
    if (companion.cabbitMood === "happy") return "★★★★★";
    if (companion.cabbitMood === "idle") return "★★★★☆";
    if (companion.cabbitMood === "sleeping") return "★★★☆☆";
    return "★★☆☆☆";
  };

  return (
    <MainShellContext.Provider value={{ weather, timeStr }}>
      <main className="h-screen w-screen relative overflow-hidden bg-[var(--neutral-0)] font-sans select-none flex flex-col">
        
        {/* TOP BAR */}
        <header className="h-[48px] border-b border-[var(--neutral-200)] px-[24px] flex items-center justify-between bg-[var(--neutral-0)] shrink-0 z-10 select-none">
          <div className="flex items-center gap-[12px]">
            <span className="text-[14px] font-semibold text-[var(--neutral-900)] tracking-[0.07px]">Cabbits OS</span>
            <div className="h-4 w-px bg-[var(--neutral-300)]" />
            <button
              onClick={handleWeatherClick}
              className="bg-[var(--neutral-0)] border border-[var(--neutral-300)] rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-bold text-[var(--neutral-900)] cursor-pointer hover:border-[var(--neutral-1000)] transition-all outline-none"
            >
              <span>{WEATHER_DETAILS[weather].icon}</span>
              <span>{WEATHER_DETAILS[weather].label} {WEATHER_DETAILS[weather].temp}</span>
              <span className="text-[10px] text-[var(--neutral-400)]">({timeStr})</span>
            </button>
          </div>

          <div className="flex items-center gap-5">
            <div className="bg-[var(--neutral-0)] border border-[var(--neutral-300)] rounded-full px-3.5 py-1 flex items-center gap-1.5 text-xs font-extrabold text-[var(--neutral-900)]">
              <span>🪙</span>
              <span>{companion.carrotCoins}</span>
            </div>

            <button
              onClick={() => setShowMailbox(true)}
              className="relative bg-[var(--neutral-0)] border border-[var(--neutral-300)] rounded-full p-2 flex items-center justify-center cursor-pointer hover:border-[var(--neutral-1000)] active:scale-95 transition-all outline-none"
            >
              <span>✉️</span>
              {hasUnread && (
                <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 hover:opacity-80 active:scale-97 cursor-pointer transition-all outline-none"
              >
                <span className="text-[14px] font-normal tracking-[0.014px] text-[var(--neutral-900)]">
                  {typeof window !== "undefined" && localStorage.getItem("cabbits_user") ? JSON.parse(localStorage.getItem("cabbits_user")!).email : "Explorer"}
                </span>
                <div className="h-[28px] w-[28px] rounded-full border border-[var(--neutral-1000)] bg-[var(--neutral-200)] flex items-center justify-center text-xs font-bold uppercase select-none">
                  {companion.name.slice(0, 2)}
                </div>
              </button>

              {showSettings && (
                <div className="absolute right-0 top-10 w-56 rounded-xl border-2 border-[var(--neutral-1000)] bg-[var(--neutral-0)] p-3 shadow-lg z-50 animate-scale-up space-y-2 text-left">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-400)] block mb-1">
                    System Settings
                  </span>
                  
                  <label className="flex items-center justify-between text-xs text-[var(--neutral-700)] cursor-pointer hover:bg-[var(--neutral-55)] p-1.5 rounded-md select-none">
                    <span>Cozy Ambient Music</span>
                    <input type="checkbox" defaultChecked className="accent-[var(--neutral-1000)] cursor-pointer" />
                  </label>
                  <label className="flex items-center justify-between text-xs text-[var(--neutral-700)] cursor-pointer hover:bg-[var(--neutral-55)] p-1.5 rounded-md select-none">
                    <span>Show Blueprint Grid</span>
                    <input type="checkbox" defaultChecked className="accent-[var(--neutral-1000)] cursor-pointer" />
                  </label>

                  <hr className="border-[var(--neutral-200)]" />

                  <button
                    onClick={() => {
                      setShowSettings(false);
                      handleResetSession();
                    }}
                    className="w-full text-left text-xs font-bold text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 cursor-pointer"
                  >
                    Reset Session
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      localStorage.removeItem("cabbits_user");
                      router.push("/login");
                    }}
                    className="w-full text-left text-xs font-bold text-[var(--neutral-700)] hover:text-black p-1.5 rounded-md hover:bg-[var(--neutral-50)] cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTAINER SHELL */}
        <div className="flex-1 flex overflow-hidden relative w-full">
          {/* LEFT SIDEBAR: Controls & Stats */}
          <aside className="w-[280px] border-r-4 border-black flex flex-col justify-between bg-[var(--neutral-0)] shrink-0 p-[20px] z-10 overflow-y-auto select-none">
            <div className="space-y-[24px] w-full">
              {/* Back Navigation */}
              {pathname !== "/" && (
                <button
                  onClick={() => router.push("/")}
                  className="text-[10px] font-black uppercase tracking-[0.5px] text-[var(--neutral-500)] hover:text-black flex items-center gap-1.5 cursor-pointer outline-none bg-transparent border-none shrink-0"
                >
                  ← Home
                </button>
              )}

              {/* Section 1: Companion Status */}
              <div className="space-y-[12px] w-full">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)] block">Your Companion</span>
                <div className="bg-[var(--neutral-0)] border-4 border-black p-[16px] space-y-[12px] w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
                  <div className="flex items-center gap-[12px] w-full pb-2 border-b border-[var(--neutral-200)]">
                    <div className="h-[40px] w-[40px] rounded-full border-2 border-black bg-[var(--neutral-50)] flex items-center justify-center text-lg select-none">
                      🐰
                    </div>
                    <span className="text-[20px] font-black text-black leading-[1.3] truncate uppercase tracking-tight">{companion.name}</span>
                  </div>
                  
                  <div className="text-[10px] font-black tracking-wider text-[var(--neutral-500)] space-y-[8px] uppercase">
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>Hunger</span>
                        <span className="text-black">{getHungerSegments()}/5</span>
                      </div>
                      <SegmentedMeter filled={getHungerSegments()} type="hunger" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>Mood</span>
                        <span className="text-black">{getMoodSegments()}/5</span>
                      </div>
                      <SegmentedMeter filled={getMoodSegments()} type="mood" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>Energy</span>
                        <span className="text-black">{getEnergySegments()}/5</span>
                      </div>
                      <SegmentedMeter filled={getEnergySegments()} type="energy" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable elements after change based on context */}
              {sidebarContent && (
                <div className="w-full pt-4 border-t border-[var(--neutral-200)]">
                  {sidebarContent}
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 flex overflow-hidden relative w-full bg-[var(--neutral-50)]">
            {children}
            
            {/* DRAWERS PANEL SLIDEOVER */}
            {activeSheet !== "none" && (
              <div className="fixed inset-y-0 right-0 w-96 bg-[var(--neutral-0)] border-l-2 border-l-[var(--neutral-1000)] shadow-2xl z-40 p-6 flex flex-col justify-between animate-slide-left pt-20">
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex justify-between items-center pb-3 border-b border-[var(--neutral-200)]">
                    <h3 className="text-lg font-black text-[var(--neutral-900)] tracking-tight">
                      {activeSheet === "inventory" ? "Backpack Cargo" : `${companion.name}'s Profile`}
                    </h3>
                    <button
                      onClick={() => {
                        setActiveSheet("none");
                        setSelectedItem(null);
                        setSelectedJournal(null);
                      }}
                      className="text-xs font-bold text-[var(--neutral-500)] hover:text-[var(--neutral-900)] cursor-pointer"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto py-4 min-h-0">
                    {/* DRAWER 1: INVENTORY (Mainly deprecated since full backpack page but keeping for fallback) */}
                    {activeSheet === "inventory" && (
                      <div className="space-y-4">
                        <div className="flex gap-2 p-1 bg-[var(--neutral-50)] rounded-full border border-[var(--neutral-300)]">
                          <button
                            onClick={() => {
                              setBackpackSubTab("items");
                              setSelectedItem(null);
                            }}
                            className={`flex-1 py-1 rounded-full font-bold text-[10px] uppercase cursor-pointer transition-all ${
                              backpackSubTab === "items" ? "bg-[var(--neutral-1000)] text-white shadow-3xs" : "text-[var(--neutral-500)] hover:text-[var(--neutral-900)]"
                            }`}
                          >
                            Collectibles
                          </button>
                          <button
                            onClick={() => {
                              setBackpackSubTab("journal");
                              setSelectedJournal(null);
                            }}
                            className={`flex-1 py-1 rounded-full font-bold text-[10px] uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                              backpackSubTab === "journal" ? "bg-[var(--neutral-1000)] text-white shadow-3xs" : "text-[var(--neutral-500)] hover:text-[var(--neutral-900)]"
                            }`}
                          >
                            <span>Pip's Journal</span>
                            {journalEntries.length > 0 && (
                              <span className="bg-[var(--neutral-1000)] text-white rounded-full text-[9px] h-4 min-w-4 px-1 flex items-center justify-center font-bold border border-white">
                                {journalEntries.length}
                              </span>
                            )}
                          </button>
                        </div>
                        {/* Drawer Backpack contents are handled via app/backpack/page.tsx predominantly now */}
                        <div className="text-center p-4 text-xs text-[var(--neutral-500)]">
                          <Link href="/backpack" className="underline text-blue-500" onClick={() => setActiveSheet("none")}>Open Full Backpack</Link>
                        </div>
                      </div>
                    )}

                    {/* DRAWER 2: COMPANION PROFILE */}
                    {activeSheet === "profile" && (
                      <div className="space-y-4">
                        <div className="flex gap-2 p-1 bg-[var(--neutral-50)] rounded-full border border-[var(--neutral-300)]">
                          <button
                            onClick={() => setProfileSubTab("info")}
                            className={`flex-1 py-1 rounded-full font-bold text-[10px] uppercase cursor-pointer transition-all ${
                              profileSubTab === "info" ? "bg-[var(--neutral-1000)] text-white shadow-3xs" : "text-[var(--neutral-500)] hover:text-[var(--neutral-900)]"
                            }`}
                          >
                            Stats & Badges
                          </button>
                          <button
                            onClick={() => setProfileSubTab("dreams")}
                            className={`flex-1 py-1 rounded-full font-bold text-[10px] uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                              profileSubTab === "dreams" ? "bg-[var(--neutral-1000)] text-white shadow-3xs" : "text-[var(--neutral-500)] hover:text-[var(--neutral-900)]"
                            }`}
                          >
                            <span>Dream Log</span>
                            {draftObjects.length > 0 && (
                              <span className="bg-amber-500 text-white rounded-full text-[9px] h-4 min-w-4 px-1 flex items-center justify-center font-bold">
                                {draftObjects.length}
                              </span>
                            )}
                          </button>
                        </div>

                        {profileSubTab === "info" ? (
                          <div className="space-y-4">
                            <div className="text-center space-y-1.5">
                              <CabbitVectorPreview
                                earStyle={customs.earStyle}
                                eyeStyle={customs.eyeStyle}
                                furColor={customs.furColor}
                                keepsakeText={customs.keepsake}
                              />
                              <h4 className="text-lg font-black text-[var(--neutral-900)] leading-tight">{companion.name}</h4>
                              <p className="text-[10px] font-bold text-[var(--neutral-500)] uppercase tracking-wide">
                                Temperament: {companion.temperament}
                              </p>
                            </div>

                            <div className="border border-[var(--neutral-200)] rounded-2xl p-4 bg-[var(--neutral-50)] space-y-2 text-left">
                              <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-500)]">Companion Status</span>
                              <div className="text-xxs font-bold text-[var(--neutral-500)] space-y-1.5 uppercase tracking-wide">
                                <div className="flex justify-between">
                                  <span>Hunger</span>
                                  <span className="font-extrabold text-[var(--neutral-900)]">{getHungerStatus()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Mood</span>
                                  <span className="font-extrabold text-[var(--neutral-900)]">{getMoodStatus()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Energy</span>
                                  <span className="font-extrabold text-[var(--neutral-900)]">{getEnergyStatus()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="border border-[var(--neutral-200)] rounded-2xl p-4 bg-[var(--neutral-50)] space-y-3">
                              <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-500)]">Milestone stats</span>
                              <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="p-2 border border-[var(--neutral-300)] bg-[var(--neutral-0)] rounded-xl">
                                  <span className="text-lg">✨</span>
                                  <h6 className="text-[10px] font-bold text-[var(--neutral-500)] uppercase mt-0.5">Insights</h6>
                                  <p className="text-sm font-black text-[var(--neutral-900)]">{companion.insightsCount}</p>
                                </div>
                                <div className="p-2 border border-[var(--neutral-300)] bg-[var(--neutral-0)] rounded-xl">
                                  <span className="text-lg">🎒</span>
                                  <h6 className="text-[10px] font-bold text-[var(--neutral-500)] uppercase mt-0.5">Items Owned</h6>
                                  <p className="text-sm font-black text-[var(--neutral-900)]">{companion.inventory?.length || 0}</p>
                                </div>
                              </div>
                            </div>

                            {customs.keepsake && (
                              <div className="border border-[var(--neutral-200)] rounded-2xl p-4 bg-[var(--neutral-50)] space-y-2 text-left">
                                <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-500)]">Equipped Keepsake</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl select-none">{parseKeepsake(customs.keepsake).emoji}</span>
                                  <div>
                                    <h5 className="text-xs font-bold text-[var(--neutral-900)]">{parseKeepsake(customs.keepsake).title}</h5>
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--neutral-400)]">
                                      {parseKeepsake(customs.keepsake).slot}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)]">Pip's Dream Log Proposals</span>
                            <p className="text-[11px] leading-relaxed text-[var(--neutral-500)]">
                              Review drafts proposed by {companion.name} after completed observations.
                            </p>
                            {draftObjects.length === 0 ? (
                              <div className="p-8 text-center bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-2xl">
                                <span className="text-3xl select-none">💭</span>
                                <p className="text-xs text-[var(--neutral-500)] italic mt-2">
                                  No draft items proposed yet. Complete landmark quests to trigger dreams!
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                                {draftObjects.map((draft) => (
                                  <div key={draft.id} className="p-3 bg-[var(--neutral-50)] border border-[var(--neutral-300)] rounded-2xl space-y-3 relative text-left">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">
                                        Type: {draft.type}
                                      </span>
                                      <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        PROPOSED
                                      </span>
                                    </div>
                                    <div>
                                      <h5 className="text-xs font-black text-[var(--neutral-900)] uppercase">{draft.data.title || draft.objectId}</h5>
                                      <p className="text-[11px] text-[var(--neutral-700)] mt-1 leading-normal">
                                        {draft.data.description || "Draft details pending review."}
                                      </p>
                                    </div>
                                    <div className="flex gap-2 border-t border-[var(--neutral-200)] pt-2.5">
                                      <button onClick={() => approveDraftObject(draft.objectId)} className="flex-1 rounded-full bg-[var(--neutral-1000)] py-1.5 text-center text-[10px] font-black text-white hover:bg-[var(--neutral-900)] cursor-pointer">
                                        Approve & Add
                                      </button>
                                      <button onClick={() => discardDraftObject(draft.objectId)} className="flex-1 rounded-full border border-[var(--neutral-300)] bg-transparent py-1.5 text-center text-[10px] font-black text-[var(--neutral-500)] hover:bg-[var(--neutral-50)] cursor-pointer">
                                        Discard
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--neutral-200)] shrink-0 space-y-2">
                  <button onClick={handleResetSession} className="w-full text-center text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer py-1 select-none">
                    Reset Companion Session
                  </button>
                  <p className="text-[9px] text-[var(--neutral-400)] text-center leading-normal">
                    This clears authentication credentials and customizations cache.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MAILBOX OVERLAY MODAL */}
        {showMailbox && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-3xl border border-[var(--neutral-200)] bg-[var(--neutral-0)] p-6 shadow-xl space-y-4 animate-scale-up text-left">
              {!selectedLetter ? (
                <>
                  <div className="flex justify-between items-center pb-3 border-b border-[var(--neutral-200)]">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[var(--neutral-900)]">Mailbox</h3>
                    <button onClick={() => setShowMailbox(false)} className="text-xs font-bold text-[var(--neutral-500)] hover:text-[var(--neutral-900)] cursor-pointer flex items-center gap-1">
                      <span>✕</span> Close
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[22rem] overflow-y-auto pr-1">
                    {MOCK_LETTERS.map((letter) => {
                      const isRead = readLetters.includes(letter.id);
                      return (
                        <div
                          key={letter.id}
                          onClick={() => {
                            if (!isRead) setReadLetters([...readLetters, letter.id]);
                            setSelectedLetter(letter);
                          }}
                          className={`p-4 rounded-2xl border border-[var(--neutral-200)] hover:border-black cursor-pointer transition-all ${
                            isRead ? "bg-white opacity-70" : "bg-[var(--neutral-50)]"
                          }`}
                        >
                          <div className="flex justify-between text-[9px] font-bold text-[var(--neutral-500)] uppercase tracking-wide">
                            <span>{letter.sender}</span>
                            <span>{letter.date}</span>
                          </div>
                          <h4 className="text-xs font-bold text-[var(--neutral-900)] mt-1">{letter.subject}</h4>
                          <p className="text-[10px] text-[var(--neutral-500)] truncate mt-1 leading-relaxed">{letter.content}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center pb-3 border-b border-[var(--neutral-200)]">
                    <button onClick={() => setSelectedLetter(null)} className="text-xs font-bold text-[var(--neutral-500)] hover:text-black cursor-pointer">← Back</button>
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--neutral-400)]">Message Detail</span>
                    <button onClick={() => { setSelectedLetter(null); setShowMailbox(false); }} className="text-xs font-bold text-[var(--neutral-500)] hover:text-[var(--neutral-900)] cursor-pointer">✕ Close</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full border border-[var(--neutral-200)] bg-[var(--neutral-50)] flex items-center justify-center text-xs font-bold uppercase select-none">
                        {selectedLetter.sender.slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[var(--neutral-900)] leading-tight">{selectedLetter.sender}</h4>
                        <p className="text-[9px] text-[var(--neutral-400)] font-bold uppercase tracking-wide">{selectedLetter.date}, {selectedLetter.time}</p>
                      </div>
                    </div>
                    <span className="bg-[var(--neutral-200)] text-[9px] font-black text-[var(--neutral-500)] px-2 py-0.5 rounded-sm uppercase tracking-wider">Official</span>
                  </div>
                  <hr className="border-[var(--neutral-200)]" />
                  <div>
                    <h2 className="text-sm font-black text-black leading-tight">{selectedLetter.subject}</h2>
                  </div>
                  <div className="space-y-2.5 max-h-[16rem] overflow-y-auto pr-1 text-xxs leading-relaxed text-[var(--neutral-700)]">
                    {selectedLetter.paragraphs.map((p: string, i: number) => <p key={i}>{p}</p>)}
                  </div>
                  <hr className="border-[var(--neutral-200)]" />
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-6 w-6 rounded-full border border-[var(--neutral-200)] bg-[var(--neutral-50)] flex items-center justify-center text-[10px] select-none">✉️</div>
                    <div className="text-left">
                      <span className="text-[10px] font-black text-[var(--neutral-900)] block">The {selectedLetter.sender}</span>
                      <div className="h-0.5 w-12 bg-black mt-0.5 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FLOATING BOTTOM NAV BAR */}
        <div className="fixed bottom-[48px] left-[calc(50%+140px)] -translate-x-1/2 flex gap-[20px] items-center z-40 select-none animate-fade-in">
          {/* Button 1: Home */}
          <button 
            onClick={() => { setActiveSheet("none"); router.push("/"); }} 
            className={`flex flex-col items-center justify-center w-[90px] h-[90px] rounded-full border-4 border-black transition-all cursor-pointer select-none ${
              pathname === "/" && activeSheet === "none" 
                ? "bg-black text-white shadow-[1px_1px_0px_black] translate-x-[3px] translate-y-[3px]" 
                : "bg-[#f7f3e6] text-[#181818] shadow-[4px_4px_0px_black] hover:scale-105 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_black]"
            }`}
          >
            <span className="text-2xl select-none">🏠</span>
            <span className="text-[11px] font-extrabold uppercase mt-1 tracking-tight">Home</span>
          </button>

          {/* Button 2: Explore */}
          <Link 
            href="/explore" 
            className={`flex flex-col items-center justify-center w-[90px] h-[90px] rounded-full border-4 border-black transition-all cursor-pointer select-none ${
              pathname === "/explore" && activeSheet === "none" 
                ? "bg-black text-white shadow-[1px_1px_0px_black] translate-x-[3px] translate-y-[3px]" 
                : "bg-[#f7f3e6] text-[#181818] shadow-[4px_4px_0px_black] hover:scale-105 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_black]"
            }`}
          >
            <span className="text-2xl select-none">🌍</span>
            <span className="text-[11px] font-extrabold uppercase mt-1 tracking-tight">Explore</span>
          </Link>

          {/* Button 3: Learn */}
          <Link 
            href="/bookshelf" 
            className={`flex flex-col items-center justify-center w-[90px] h-[90px] rounded-full border-4 border-black transition-all cursor-pointer select-none ${
              pathname === "/bookshelf" && activeSheet === "none" 
                ? "bg-black text-white shadow-[1px_1px_0px_black] translate-x-[3px] translate-y-[3px]" 
                : "bg-[#f7f3e6] text-[#181818] shadow-[4px_4px_0px_black] hover:scale-105 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_black]"
            }`}
          >
            <span className="text-2xl select-none">📖</span>
            <span className="text-[11px] font-extrabold uppercase mt-1 tracking-tight">Learn</span>
          </Link>

          {/* Button 4: Inventory */}
          <Link 
            href="/backpack" 
            className={`flex flex-col items-center justify-center w-[90px] h-[90px] rounded-full border-4 border-black transition-all cursor-pointer select-none ${
              pathname === "/backpack" && activeSheet === "none" 
                ? "bg-black text-white shadow-[1px_1px_0px_black] translate-x-[3px] translate-y-[3px]" 
                : "bg-[#f7f3e6] text-[#181818] shadow-[4px_4px_0px_black] hover:scale-105 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_black]"
            }`}
          >
            <span className="text-2xl select-none">🎒</span>
            <span className="text-[11px] font-extrabold uppercase mt-1 tracking-tight">Inventory</span>
          </Link>

          {/* Button 5: Profile */}
          <button 
            onClick={() => setActiveSheet(activeSheet === "profile" ? "none" : "profile")} 
            className={`flex flex-col items-center justify-center w-[90px] h-[90px] rounded-full border-4 border-black transition-all cursor-pointer select-none ${
              activeSheet === "profile" 
                ? "bg-black text-white shadow-[1px_1px_0px_black] translate-x-[3px] translate-y-[3px]" 
                : "bg-[#f7f3e6] text-[#181818] shadow-[4px_4px_0px_black] hover:scale-105 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_black]"
            }`}
          >
            <span className="text-2xl select-none">🐰</span>
            <span className="text-[11px] font-extrabold uppercase mt-1 tracking-tight">Profile</span>
          </button>
        </div>
      </main>
    </MainShellContext.Provider>
  );
}
