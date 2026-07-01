"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { CompanionOrb } from "@/components/companion/CompanionOrb";
import { CompanionMood } from "@/types";
import { Patrick_Hand } from "next/font/google";
import { ITEMS, Item } from "@/lib/data/items";

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Custom types for weather states
type WeatherType = "rainy" | "sunny" | "snowy";

const WEATHER_DETAILS: Record<WeatherType, { label: string; icon: string; temp: string }> = {
  rainy: { label: "Rainy", icon: "🌧️", temp: "18°C" },
  sunny: { label: "Sunny", icon: "☀️", temp: "24°C" },
  snowy: { label: "Snowy", icon: "❄️", temp: "-1°C" },
};

// Simulated letters inside the Mailbox
const MOCK_LETTERS = [
  {
    id: "welcome",
    sender: "Orchestrator",
    subject: "Your learning journey begins!",
    content: "Welcome to Cabbits! Tap on the bookshelf to select stories, or click the quest card to complete daily check-ins.",
    date: "Today",
  },
  {
    id: "botany",
    sender: "Botany Specialist",
    subject: "Studying plants closely",
    content: "I reviewed your green plant observation. Remember, leaves have structured veins that transport water. Keep looking!",
    date: "1 day ago",
  },
];

export default function Home() {
  const {
    companion,
    isQuestCompleted,
    isLoading,
    memories,
    books,
    resetCompanion,
    feedCabbit,
    toggleSleep,
    addCoins,
  } = useCompanion();

  const router = useRouter();

  // Local state
  const [timeStr, setTimeStr] = useState("10:30 AM");
  const [weather, setWeather] = useState<WeatherType>("rainy");
  const [bubbleText, setBubbleText] = useState<string>("");
  const [activeSheet, setActiveSheet] = useState<"none" | "explore" | "inventory" | "profile">("none");
  const [showMailbox, setShowMailbox] = useState(false);
  const [readLetters, setReadLetters] = useState<string[]>([]);
  const [zoomTransition, setZoomTransition] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Time Tick Hook
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

  // Redirect if companion is not created
  useEffect(() => {
    if (!isLoading && !companion) {
      router.replace("/companion/new");
    }
  }, [isLoading, companion, router]);

  // Hash listener to open drawers on redirect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleHash = () => {
        const hash = window.location.hash;
        if (hash === "#inventory") setActiveSheet("inventory");
        else if (hash === "#profile") setActiveSheet("profile");
      };
      handleHash();
      window.addEventListener("hashchange", handleHash);
      return () => window.removeEventListener("hashchange", handleHash);
    }
  }, [companion]);

  // Set default initial dialog bubble
  useEffect(() => {
    if (companion) {
      if (companion.cabbitMood === "sleeping") {
        setBubbleText("Zzz... dreaming of carrots...");
      } else if (companion.cabbitMood === "happy") {
        setBubbleText("Mmm, thank you! I love snacks!");
      } else {
        setBubbleText(`Hi! Let's read a story together today!`);
      }
    }
  }, [companion]);

  if (isLoading || !companion) {
    return (
      <main className="min-h-screen px-6 py-8 flex items-center justify-center bg-[#F9F7F0]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <CompanionOrb mood="idle" />
          <p className="text-sm text-black/40">Entering room...</p>
        </div>
      </main>
    );
  }

  // Weather toggle
  const handleWeatherClick = () => {
    if (weather === "rainy") setWeather("sunny");
    else if (weather === "sunny") setWeather("snowy");
    else setWeather("rainy");
  };

  // Cabbit click dialogues
  const handleCabbitClick = () => {
    if (companion.cabbitMood === "sleeping") {
      setBubbleText("Zzz... warm blankets...");
      return;
    }

    const gentleLines = [
      "I'm so glad we are reading together.",
      "Let's take a slow breath. Ready?",
      "Can we read 'The Missing Acorns' tonight?",
    ];
    const curiousLines = [
      "I wonder what stars do during the daytime.",
      "If we study a coin closely, what does it show?",
      "What lies beyond the valley hills?",
    ];
    const playfulLines = [
      "Let's hop around the rug! Bounce bounce!",
      "I'm feeling extra energetic!",
      "Feed me a carrot snack, pretty please! 🥕",
    ];
    const focusedLines = [
      "I am ready to solve a hard logic puzzle.",
      "Let's sit down and inspect our bookmarks.",
      "Practice makes us better and wiser.",
    ];

    let pool = gentleLines;
    if (companion.temperament === "curious") pool = curiousLines;
    else if (companion.temperament === "playful") pool = playfulLines;
    else if (companion.temperament === "focused") pool = focusedLines;

    const randomLine = pool[Math.floor(Math.random() * pool.length)];
    setBubbleText(randomLine);
  };

  // Feed trigger wrapper
  const handleBowlClick = async () => {
    if (companion.cabbitMood === "sleeping") {
      setBubbleText("Shh, I'm sleeping right now!");
      return;
    }
    if (companion.carrotCoins < 5) {
      setBubbleText("Oh, we need more Carrot Coins! Let's complete a quest!");
      return;
    }
    await feedCabbit();
    setBubbleText("Yum! That carrot was delicious! 🥕");
  };

  // Bookshelf click wrapper (zooms & routes)
  const handleBookshelfClick = () => {
    setZoomTransition(true);
    setBubbleText("Let's go look at the books!");
    setTimeout(() => {
      router.push("/bookshelf");
    }, 600); // 600ms
  };

  const hasUnread = MOCK_LETTERS.length > readLetters.length;

  return (
    <main className={`min-h-screen bg-[#E5DDC8] p-4 flex justify-center items-center ${patrickHand.className}`}>
      {/* PHONE/VIEWPORT FRAME */}
      <section className="relative w-full max-w-sm h-[calc(100vh-2rem)] min-h-[580px] rounded-[2.5rem] border-[6px] border-black/80 bg-[#FAF7F0] shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* ROOM FILTER OVERLAYS */}
        {weather === "rainy" && <div className="absolute inset-0 bg-[#4A607A]/15 pointer-events-none z-10" />}
        {weather === "snowy" && <div className="absolute inset-0 bg-[#A6C0D9]/10 pointer-events-none z-10" />}
        {companion.cabbitMood === "sleeping" && <div className="absolute inset-0 bg-[#1A1E29]/40 pointer-events-none z-10" />}

        {/* TIME & WEATHER HEADER */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-center z-20">
          <div className="flex gap-1">
            <div className="bg-[#FAF7F0]/90 border border-black/10 shadow-3xs rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm font-semibold">
              <span>☀️</span>
              <span>{timeStr}</span>
            </div>
            
            <button
              onClick={handleWeatherClick}
              className="bg-[#FAF7F0]/90 border border-black/10 shadow-3xs rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-95 transition-all"
            >
              <span>{WEATHER_DETAILS[weather].icon}</span>
              <span>
                {WEATHER_DETAILS[weather].label} {WEATHER_DETAILS[weather].temp}
              </span>
            </button>
          </div>

          <div className="flex gap-1.5">
            <div className="bg-[#FAF7F0]/90 border border-black/10 shadow-3xs rounded-full px-3 py-1.5 flex items-center gap-1 text-sm font-semibold">
              <span className="text-amber-500">🪙</span>
              <span>{companion.carrotCoins}</span>
            </div>

            <button
              onClick={() => setShowMailbox(true)}
              className="relative bg-[#FAF7F0]/90 border border-black/10 shadow-3xs rounded-full p-2 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
            >
              <span>✉️</span>
              {hasUnread && (
                <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* COZY ROOM CANVAS */}
        <div
          className={`relative flex-1 bg-cover bg-center transition-transform duration-700 ${
            zoomTransition ? "scale-125 translate-x-12 -translate-y-8" : "scale-100"
          }`}
          style={{ backgroundImage: "url(/assets/cozy_room_bg.png)" }}
        >
          {/* HOTSPOT 1: Bookshelf (Right side coordinate blocks) */}
          <div
            onClick={handleBookshelfClick}
            className="absolute top-[25%] right-[5%] w-[35%] h-[40%] cursor-pointer group rounded-2xl animate-pulse border border-dashed border-black/5 hover:border-black/30"
          >
            <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 transition-colors rounded-2xl flex items-center justify-center">
              <span className="text-[10px] bg-black/75 text-white px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity uppercase font-sans tracking-wider">
                Bookshelf 📖
              </span>
            </div>
          </div>

          {/* HOTSPOT 2: Bed (Left side coordinate blocks) */}
          <div
            onClick={toggleSleep}
            className="absolute top-[40%] left-[10%] w-[45%] h-[30%] cursor-pointer group rounded-2xl border border-dashed border-black/0 hover:border-black/20"
          >
            <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors rounded-2xl flex items-center justify-center">
              <span className="text-[10px] bg-black/75 text-white px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity uppercase font-sans tracking-wider">
                {companion.cabbitMood === "sleeping" ? "Wake Up ☀️" : "Sleep 💤"}
              </span>
            </div>
          </div>

          {/* HOTSPOT 3: Food Bowl (Bottom right coordinate blocks) */}
          <div
            onClick={handleBowlClick}
            className="absolute bottom-[20%] right-[10%] w-[20%] h-[15%] cursor-pointer group rounded-full border border-dashed border-black/0 hover:border-black/20"
          >
            <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/15 transition-colors rounded-full flex items-center justify-center">
              <span className="text-[10px] bg-black/75 text-white px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity uppercase font-sans tracking-wider">
                Feed 🥕
              </span>
            </div>
          </div>

          {/* HOTSPOT 4: Window (Top center background coordinates) */}
          <div
            onClick={handleWeatherClick}
            className="absolute top-[22%] left-[35%] w-[30%] h-[15%] cursor-pointer group rounded-xl"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-xl flex items-center justify-center">
              <span className="text-[9px] bg-black/75 text-white px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity uppercase font-sans tracking-wider">
                Weather 🌧️
              </span>
            </div>
          </div>

          {/* CABBIT BUNNY SPRITE & SPEECH BUBBLE */}
          {/* Sprite position changes dynamically based on location */}
          <div
            className={`absolute transition-all duration-700 z-20 flex flex-col items-center ${
              companion.cabbitLocation === "bed"
                ? "top-[42%] left-[20%]"
                : companion.cabbitLocation === "table"
                ? "bottom-[30%] left-[20%]"
                : "top-[50%] left-[30%]"
            }`}
          >
            {/* Dialogue Bubble */}
            {bubbleText && (
              <div className="relative mb-2 bg-[#FAF7F0] border-2 border-black/80 px-3 py-1.5 rounded-2xl shadow-3xs max-w-[10rem] text-xs font-semibold leading-4 animate-scale-up">
                <p className="text-black/85">{bubbleText}</p>
                <div className="absolute bottom-[-6px] left-[45%] w-2 h-2 bg-[#FAF7F0] border-r-2 border-b-2 border-black/80 transform rotate-45" />
              </div>
            )}

            {/* Bunny Avatar click wrapper */}
            <div
              onClick={handleCabbitClick}
              className={`relative cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                companion.cabbitMood === "sleeping" ? "rotate-90 origin-bottom" : ""
              }`}
            >
              {/* Animated sleeping indicator */}
              {companion.cabbitMood === "sleeping" && (
                <span className="absolute -top-4 left-6 text-xs text-[#FAF7F0] font-sans font-bold animate-bounce select-none">
                  💤
                </span>
              )}
              {/* Dynamic Bunny Image asset */}
              <img
                src="/assets/cabbit_sprite.png"
                alt={companion.name}
                className="h-28 w-28 object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION TABS */}
        <nav className="bg-[#FAF7F0] border-t-4 border-black/80 px-2 py-3.5 flex justify-around items-center z-30">
          <button
            onClick={() => setActiveSheet("none")}
            className={`flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 transition-all ${
              activeSheet === "none" ? "text-amber-750 bg-amber-50/50 px-2 py-0.5 rounded-xl border border-amber-900/10 shadow-3xs" : "text-black/55"
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs font-bold">Home</span>
          </button>

          <Link
            href="/explore"
            className="flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 transition-all text-black/55"
          >
            <span className="text-xl">🌍</span>
            <span className="text-xs font-bold">Explore</span>
          </Link>

          <Link
            href="/bookshelf"
            className="flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 transition-all text-black/55"
          >
            <span className="text-xl">📖</span>
            <span className="text-xs font-bold">Learn</span>
          </Link>

          <button
            onClick={() => setActiveSheet("inventory")}
            className={`flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 transition-all ${
              activeSheet === "inventory" ? "text-amber-750 bg-amber-50/50 px-2 py-0.5 rounded-xl border border-amber-900/10 shadow-3xs" : "text-black/55"
            }`}
          >
            <span className="text-xl">🎒</span>
            <span className="text-xs font-bold">Bag</span>
          </button>

          <button
            onClick={() => setActiveSheet("profile")}
            className={`flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 transition-all ${
              activeSheet === "profile" ? "text-amber-750 bg-amber-50/50 px-2 py-0.5 rounded-xl border border-amber-900/10 shadow-3xs" : "text-black/55"
            }`}
          >
            <span className="text-xl">🐰</span>
            <span className="text-xs font-bold">Profile</span>
          </button>
        </nav>

        {/* 4. MAILBOX OVERLAY MODAL */}
        {showMailbox && (
          <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6">
            <div className="w-full max-w-xs rounded-3xl border-4 border-black bg-[#FCFBF7] p-5 shadow-lg space-y-4 animate-scale-up">
              <div className="flex justify-between items-center pb-2 border-b border-black/10">
                <h3 className="text-lg font-bold">Mailbox</h3>
                <button
                  onClick={() => setShowMailbox(false)}
                  className="text-sm font-bold text-black/40 hover:text-black cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-3 max-h-[14rem] overflow-y-auto">
                {MOCK_LETTERS.map((letter) => {
                  const isRead = readLetters.includes(letter.id);
                  return (
                    <div
                      key={letter.id}
                      onClick={() => {
                        if (!isRead) setReadLetters([...readLetters, letter.id]);
                        setBubbleText(`Message: ${letter.content}`);
                        setShowMailbox(false);
                      }}
                      className={`p-3 rounded-2xl border-2 border-black/60 shadow-3xs cursor-pointer hover:bg-black/5 transition-all ${
                        isRead ? "bg-white/40 opacity-70" : "bg-[#FAF7F0]"
                      }`}
                    >
                      <div className="flex justify-between text-xxs font-bold text-black/40 uppercase">
                        <span>{letter.sender}</span>
                        <span>{letter.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-black/85 mt-0.5">{letter.subject}</h4>
                      <p className="text-[11px] text-black/65 truncate mt-1">{letter.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 5. EXPLORE SHEET (SLIDE UP) */}
        {activeSheet === "explore" && (
          <div className="absolute inset-0 z-30 bg-black/30 backdrop-blur-3xs flex flex-col justify-end">
            <div className="bg-[#FCFBF7] border-t-4 border-black/80 rounded-t-[2rem] p-5 shadow-lg space-y-4 animate-slide-up max-h-[70%] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-black/10">
                <h3 className="text-lg font-bold">Explore Map</h3>
                <button
                  onClick={() => setActiveSheet("none")}
                  className="text-xs font-bold text-black/40 hover:text-black cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="relative p-4 rounded-3xl bg-[#ECE7D6] border-2 border-black/40 flex flex-col gap-4 text-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/50">Quest Map Milestones</h4>
                
                <div className="flex flex-col gap-3 text-left">
                  <div className="flex items-center gap-3 bg-white/60 p-2.5 rounded-2xl border border-black/5">
                    <span className="text-lg">✔️</span>
                    <div>
                      <h5 className="text-xs font-bold text-black/80">Quest 1: Notice One Thing</h5>
                      <p className="text-xxs text-black/45 uppercase tracking-wide">COMPLETED</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/30 p-2.5 rounded-2xl border border-black/5 opacity-60">
                    <span className="text-lg">🔒</span>
                    <div>
                      <h5 className="text-xs font-bold text-black/60">Quest 2: Secret Library</h5>
                      <p className="text-xxs text-black/40 uppercase tracking-wide">Locked (Read books to open)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/30 p-2.5 rounded-2xl border border-black/5 opacity-60">
                    <span className="text-lg">🔒</span>
                    <div>
                      <h5 className="text-xs font-bold text-black/60">Quest 3: Meadow Patterns</h5>
                      <p className="text-xxs text-black/40 uppercase tracking-wide">Locked</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. BAG / INVENTORY SHEET (SLIDE UP) */}
        {activeSheet === "inventory" && (
          <div className="absolute inset-0 z-30 bg-black/30 backdrop-blur-3xs flex flex-col justify-end">
            <div className="bg-[#FCFBF7] border-t-4 border-black/80 rounded-t-[2rem] p-5 shadow-lg space-y-4 animate-slide-up max-h-[70%] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-black/10">
                <h3 className="text-lg font-bold">Backpack</h3>
                <button
                  onClick={() => setActiveSheet("none")}
                  className="text-xs font-bold text-black/40 hover:text-black cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* Items Inventory Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Carrot Snack */}
                <div className="p-3 bg-[#FAF7F0] border-2 border-black/60 rounded-2xl flex flex-col items-center text-center space-y-1">
                  <span className="text-3xl">🥕</span>
                  <h4 className="text-xs font-bold">Carrot Snacks</h4>
                  <p className="text-[10px] text-black/55 leading-4">Spends 5 coins to feed Pip.</p>
                  <button
                    onClick={handleBowlClick}
                    className="w-full bg-[var(--accent-dark)] text-white text-xs font-bold py-1.5 rounded-full hover:brightness-110 active:scale-95 cursor-pointer transition-all"
                  >
                    Feed 🥕
                  </button>
                </div>

                {/* Coin Bag */}
                <div className="p-3 bg-[#FAF7F0] border-2 border-black/60 rounded-2xl flex flex-col items-center text-center space-y-1">
                  <span className="text-3xl">🪙</span>
                  <h4 className="text-xs font-bold">Carrot Coins</h4>
                  <p className="text-[10px] text-black/55 leading-4">Earned from reading books and completing quests.</p>
                  <button
                    onClick={() => addCoins(5)}
                    className="w-full border border-black/10 text-xs font-bold py-1.5 rounded-full hover:bg-black/5 active:scale-95 cursor-pointer transition-all"
                  >
                    Collect +5
                  </button>
                </div>
              </div>

              {/* Collectible Items */}
              <div className="pt-2.5 border-t border-black/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/40 mb-2">Collectible Items</h4>
                {!companion.inventory || companion.inventory.length === 0 ? (
                  <p className="text-[11px] text-black/40 italic leading-normal">
                    No collectibles found yet. Explore land pins on the map to earn items!
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {companion.inventory.map((itemId) => {
                      const item = ITEMS[itemId];
                      if (!item) return null;
                      return (
                        <button
                          key={itemId}
                          onClick={() => setSelectedItem(item)}
                          className="p-2 bg-[#FAF7F0] border-2 border-black/40 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-black/5 active:scale-95 transition-all"
                        >
                          <span className="text-2xl select-none">{item.icon}</span>
                          <span className="text-[9px] font-bold text-black/80 mt-1 truncate w-full">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dynamic Reading List summary */}
              <div className="pt-2.5 border-t border-black/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/40 mb-2">Book Progress</h4>
                <div className="space-y-2">
                  {books.map((b) => (
                    <div key={b.id} className="flex justify-between items-center text-xs font-medium">
                      <span>{b.title}</span>
                      <span className="text-black/50">{b.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. PROFILE SHEET (SLIDE UP) */}
        {activeSheet === "profile" && (
          <div className="absolute inset-0 z-30 bg-black/30 backdrop-blur-3xs flex flex-col justify-end">
            <div className="bg-[#FCFBF7] border-t-4 border-black/80 rounded-t-[2rem] p-5 shadow-lg space-y-4 animate-slide-up max-h-[70%] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-black/10">
                <h3 className="text-lg font-bold">Companion Profile</h3>
                <button
                  onClick={() => setActiveSheet("none")}
                  className="text-xs font-bold text-black/40 hover:text-black cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* Bio summary */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border-2 border-black/30">
                  <div className="scale-75 shrink-0 -mt-2">
                    <CompanionOrb mood="idle" curiosity={companion.curiosity} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold leading-tight">{companion.name}</h4>
                    <p className="text-xxs uppercase tracking-wider text-[var(--accent-dark)] font-bold">{companion.temperament} companion</p>
                    <p className="text-[10px] text-black/40 font-medium">Joined {new Date(companion.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-3 p-3 bg-[#FAF7F0] border-2 border-black/40 rounded-2xl">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xxs font-bold uppercase tracking-wider text-black/40">
                      <span>Curiosity Gauge</span>
                      <span>{companion.curiosity}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${companion.curiosity}%` }}
                        className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs font-bold pt-1 border-t border-black/5">
                    <span>Insights Gathered:</span>
                    <span>✨ {companion.insightsCount}</span>
                  </div>

                  <div className="flex justify-between text-xs font-bold">
                    <span>Carrot Coins:</span>
                    <span>🪙 {companion.carrotCoins}</span>
                  </div>
                </div>

                {/* Reset session button */}
                <button
                  onClick={() => {
                    if (confirm("Reset companion? This will delete all local progress.")) {
                      resetCompanion();
                      router.replace("/companion/new");
                    }
                  }}
                  className="w-full rounded-full border border-red-200 bg-red-50 py-3.5 text-center font-bold text-red-600 cursor-pointer hover:bg-red-100/50 active:scale-95 transition-all text-xs"
                >
                  Reset Companion
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ITEM DETAILS POPUP OVERLAY */}
        {selectedItem && (
          <div className="absolute inset-0 z-45 bg-black/45 backdrop-blur-3xs flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-[#FAF7F0] border-4 border-black rounded-[2rem] p-6 w-full max-w-[280px] shadow-2xl relative text-center space-y-4">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-xs font-bold text-black/45 hover:text-black cursor-pointer"
              >
                ✕
              </button>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-dark)]">
                  Item Discovery
                </span>
                <div className="mx-auto h-16 w-16 bg-white border-2 border-black/60 rounded-full flex items-center justify-center text-3xl shadow-3xs animate-bounce mt-2 select-none">
                  {selectedItem.icon}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-black/85 leading-tight">{selectedItem.name}</h3>
                <span className="text-[9px] uppercase tracking-wider text-black/40 font-bold block mt-0.5">
                  Origin: {selectedItem.locationOrigin}
                </span>
              </div>
              <p className="text-xs text-black/65 leading-relaxed leading-normal">{selectedItem.description}</p>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full rounded-full bg-[var(--accent-dark)] py-2.5 text-center font-bold text-white shadow-sm hover:brightness-110 active:scale-95 transition-all text-xs cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
