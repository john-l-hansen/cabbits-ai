"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { CabbitVectorPreview, parseKeepsake } from "@/components/companion/CabbitVectorPreview";
import { Item } from "@/types";

type WeatherType = "rainy" | "sunny" | "snowy" | "night" | "foggy";

const WEATHER_DETAILS: Record<WeatherType, { label: string; icon: string; temp: string }> = {
  rainy: { label: "Rainy", icon: "🌧️", temp: "18°C" },
  sunny: { label: "Sunny", icon: "☀️", temp: "24°C" },
  snowy: { label: "Snowy", icon: "❄️", temp: "-1°C" },
  night: { label: "Night", icon: "🌙", temp: "12°C" },
  foggy: { label: "Foggy", icon: "🌫️", temp: "15°C" },
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
  setWeather: (w: WeatherType) => void;
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

export interface MainShellSidebarContextType {
  sidebarContent: React.ReactNode;
  setSidebarContent: (content: React.ReactNode) => void;
}

export const MainShellSidebarContext = createContext<MainShellSidebarContextType | null>(null);

export function useMainShellSidebar() {
  const ctx = useContext(MainShellSidebarContext);
  if (!ctx) throw new Error("useMainShellSidebar must be used within MainShellSidebarProvider");
  return ctx;
}

export function MainShellSidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarContent, setSidebarContent] = useState<React.ReactNode>(null);
  return (
    <MainShellSidebarContext.Provider value={{ sidebarContent, setSidebarContent }}>
      {children}
    </MainShellSidebarContext.Provider>
  );
}

export function MainShell({ children }: { children: React.ReactNode }) {
  const { sidebarContent } = useMainShellSidebar();
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

  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize persistent HTML5 ambient audio player
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.loop = true;
        audioRef.current.volume = 0.25; // low background volume
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Update track selection depending on page location (reactivity)
  useEffect(() => {
    if (!audioRef.current) return;
    
    let targetSrc = "/assets/K02-06.mp3"; // Cozy room theme
    if (pathname === "/explore" || pathname === "/quest") {
      targetSrc = "/assets/ravenshadow-audio.mp3"; // Active exploration theme
    }
    
    const currentSrc = audioRef.current.src;
    if (!currentSrc.endsWith(targetSrc)) {
      audioRef.current.src = targetSrc;
      if (isMusicEnabled) {
        audioRef.current.play().catch(err => console.log("Autoplay blocked:", err));
      }
    }
  }, [pathname, isMusicEnabled]);

  // Handle manual playback toggle
  useEffect(() => {
    if (!audioRef.current) return;
    if (isMusicEnabled) {
      audioRef.current.play().catch(err => console.log("Playback blocked by browser:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isMusicEnabled]);

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

  // Global ESC shortcut navigation & overlays cancellation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeSheet !== "none") {
          setActiveSheet("none");
        } else if (showMailbox) {
          setShowMailbox(false);
        } else if (showSettings) {
          setShowSettings(false);
        } else if (pathname !== "/") {
          router.push("/");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSheet, showMailbox, showSettings, pathname, router]);

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
    const cycle: WeatherType[] = ["sunny", "rainy", "snowy", "night", "foggy"];
    const nextIdx = (cycle.indexOf(weather) + 1) % cycle.length;
    setWeather(cycle[nextIdx]);
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

  const user = typeof window !== "undefined" && localStorage.getItem("cabbits_user") ? JSON.parse(localStorage.getItem("cabbits_user")!) : null;
  const userName = user ? (user.username || user.email.split("@")[0]) : "Alex Morgan";

  return (
    <MainShellContext.Provider value={{ weather, timeStr, setWeather }}>
      <main className="h-screen w-screen relative overflow-hidden bg-[var(--neutral-0)] font-sans select-none flex flex-col">
        
        {/* TOP BAR */}
        <header className="p-[24px] border-b-2 border-black flex items-center justify-between bg-[#fefdf9] shrink-0 z-10 select-none">
          <div className="flex items-center gap-[8px]">
            <p className="[word-break:break-word] font-sans font-bold leading-[1.65] not-italic relative shrink-0 text-[16px] text-[#181818] tracking-[0.5px] whitespace-nowrap">
              {timeStr}
            </p>
            <button
              onClick={handleWeatherClick}
              className="bg-transparent border-none p-1 flex items-center justify-center text-lg cursor-pointer hover:scale-110 active:scale-90 transition-transform outline-none"
            >
              <span>{WEATHER_DETAILS[weather].icon}</span>
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#181818]">
              <span>🪙</span>
              <span>{companion.carrotCoins}</span>
            </div>

            <button
              onClick={() => setShowMailbox(true)}
              className="relative bg-transparent border-none p-1.5 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all outline-none"
            >
              <span className="text-lg">✉️</span>
              {hasUnread && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 hover:opacity-80 active:scale-97 cursor-pointer transition-all outline-none bg-transparent border-none"
              >
                <span className="text-[16px] font-sans font-bold tracking-[0.5px] text-[#181818] capitalize leading-[1.65]">
                  {userName}
                </span>
                <div className="h-[32px] w-[32px] rounded-full border border-black bg-[#e5e5e5] flex items-center justify-center text-xs font-bold uppercase select-none">
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
                    <input
                      type="checkbox"
                      checked={isMusicEnabled}
                      onChange={(e) => setIsMusicEnabled(e.target.checked)}
                      className="accent-[var(--neutral-1000)] cursor-pointer"
                    />
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
              {/* Section 1: Companion Status */}
              <div className="space-y-[12px] w-full">
                
                <div className="bg-[var(--neutral-0)] border-4 border-black p-[16px] space-y-[12px] w-full rounded-md">
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
                <div className="space-y-4">
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
        <div className="fixed bottom-[48px] left-[calc(50%+140px)] -translate-x-1/2 flex gap-[20px] items-center z-40 select-none">
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
          <Link 
            href="/profile" 
            className={`flex flex-col items-center justify-center w-[90px] h-[90px] rounded-full border-4 border-black transition-all cursor-pointer select-none ${
              pathname === "/profile" && activeSheet === "none" 
                ? "bg-black text-white shadow-[1px_1px_0px_black] translate-x-[3px] translate-y-[3px]" 
                : "bg-[#f7f3e6] text-[#181818] shadow-[4px_4px_0px_black] hover:scale-105 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_black]"
            }`}
          >
            <span className="text-2xl select-none">🐰</span>
            <span className="text-[11px] font-extrabold uppercase mt-1 tracking-tight">Profile</span>
          </Link>
        </div>
      </main>
    </MainShellContext.Provider>
  );
}
