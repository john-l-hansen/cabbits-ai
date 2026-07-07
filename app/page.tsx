"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { getCompanionGreeting } from "@/lib/agents/dialogue";
import { useMainShell, useMainShellSidebar } from "@/components/layout/MainShell";
import { motion, AnimatePresence } from "framer-motion";

const LITERATURE_QUOTES = [
  { quote: "There is always light, if only we're brave enough to see it.", author: "Amanda Gorman" },
  { quote: "I would rather sit on a pumpkin and have it all to myself than be crowded on a velvet cushion.", author: "Henry David Thoreau" },
  { quote: "The power of finding beauty in the humblest things makes home happy and life lovely.", author: "Louisa May Alcott" },
  { quote: "Hope is the thing with feathers that perches in the soul.", author: "Emily Dickinson" },
  { quote: "The sun is but a morning star.", author: "Henry David Thoreau" }
];

const playWaterSound = () => {
  if (typeof window === "undefined") return;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  try {
    const ctx = new AudioContext();
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = lastOut * 0.9 + white * 0.1;
      lastOut = data[i];
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(2.0, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.5);
    filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 1.2);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 1.5);
  } catch (e) {
    console.error("Audio error:", e);
  }
};

interface TypedSpeechBubbleProps {
  text: string;
  name: string;
  onClose: () => void;
}

function TypedSpeechBubble({ text, name, onClose }: TypedSpeechBubbleProps) {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let idx = 0;
    setTypedText("");
    const interval = setInterval(() => {
      if (idx < text.length) {
        const nextChar = text[idx];
        setTypedText((prev) => prev + nextChar);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 20); // typing speed
    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.div
      initial={{ y: -30, opacity: 0, scale: 0.85 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -30, opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[580px] bg-[#f7f3e6] px-[24px] py-[20px] rounded-[12px] shadow-lg border border-black/5 z-50 flex gap-[12px] items-center justify-between pointer-events-auto select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-[2px] items-start text-left flex-1">
        <p className="font-['Nunito',sans-serif] font-black text-[#181818] text-[28px] leading-[1.25]">
          {name}:
        </p>
        <p className="font-normal text-[#474747] tracking-[0.02px] text-[20px] leading-[1.65]">
          {typedText}
        </p>
      </div>
      
      {/* Avatar Container - exactly size-[100px] per figma spec, centered zoomed graphic */}
      <div className="size-[100px] rounded-[999px] border border-black/10 bg-[#eae4d3] flex items-center justify-center overflow-hidden shrink-0 relative">
        <img 
          src="/assets/cabbit-idle-01.png" 
          alt={name} 
          className="w-full h-full object-contain scale-[1.95] origin-center" 
        />
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2.5 right-3 text-xs font-extrabold text-[#999999] hover:text-black cursor-pointer bg-transparent border-none outline-none"
      >
        ✕
      </button>
    </motion.div>
  );
}

interface HomeSidebarProps {}

function HomeSidebar() {
  const { companion } = useCompanion();

  if (!companion) return null;

  const getEnergySegments = () => {
    if (companion.cabbitMood === "sleeping") return 4;
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

  const getDots = (filled: number) => "●".repeat(filled) + "○".repeat(5 - filled);
  const getStars = (filled: number) => "★".repeat(filled) + "☆".repeat(5 - filled);
  const getEnergyBar = (filled: number) => "█".repeat(filled) + "░".repeat(4 - filled);

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-3">
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)] block">
          Home
        </span>
        <div className="bg-white border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full border-2 border-black bg-amber-100 flex items-center justify-center text-xl select-none">
              🐰
            </div>
            <h3 className="text-xl font-black text-black">{companion.name}</h3>
          </div>
          <div className="space-y-1.5 font-sans font-semibold text-xs text-[var(--neutral-500)]">
            <p>Hunger {getDots(getHungerSegments())}</p>
            <p>Mood {getStars(getMoodSegments())}</p>
            <p>Energy {getEnergyBar(getEnergySegments())}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HomeContentProps {
  bubbleText: string;
  setBubbleText: (t: string) => void;
  isBubbleOpen: boolean;
  setIsBubbleOpen: (b: boolean) => void;
  zoomTarget: string | null;
  setZoomTarget: (target: string | null) => void;
  pipTile: { x: number; y: number };
  setPipTile: (t: { x: number; y: number }) => void;
  isHopping: boolean;
  setIsHopping: (b: boolean) => void;
  handleToggleSleep: () => Promise<void>;
  handleBowlClick: () => Promise<void>;
  handleBookshelfClick: () => void;
  handleCabbitClick: () => void;
  screenFlash: boolean;
  setScreenFlash: (f: boolean) => void;
  showPing: boolean;
}

export function HomeContent({
  bubbleText,
  setBubbleText,
  isBubbleOpen,
  setIsBubbleOpen,
  zoomTarget,
  setZoomTarget,
  pipTile,
  setPipTile,
  isHopping,
  setIsHopping,
  handleToggleSleep,
  handleBowlClick,
  handleBookshelfClick,
  handleCabbitClick,
  screenFlash,
  setScreenFlash,
  showPing,
}: HomeContentProps) {
  const { companion, isLoading, quests, memories, journalEntries, completedQuestIds, showLevelUpAlert, setShowLevelUpAlert } = useCompanion();
  const { weather, setWeather } = useMainShell();
  const router = useRouter();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem("cabbits_onboarding_completed");
      if (!completed) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const handleFinishOnboarding = () => {
    localStorage.setItem("cabbits_onboarding_completed", "true");
    setShowOnboarding(false);
  };

  const onboardingSlides = [
    {
      title: "Welcome Explorer! 🌟",
      emoji: "🐰",
      description: `Welcome to Cabbits—a cozy space where logic meets life. You've just met your companion, ${companion?.name || "Pip"}! Let's take a quick look at how to grow together.`,
      tip: "Every action you take constructs a diary of memories for your cabbit."
    },
    {
      title: "1. The Bedroom Base 🏡",
      emoji: "🪴",
      description: "This room is your base of operations. Tap Pip to check stats, water the desk plant for cozy ambient sounds, sip warm tea for inspiring literature quotes, or click the Bed to let Pip rest.",
      tip: "Tip: Sleep mode can be instantly canceled by pressing the ESC key!"
    },
    {
      title: "2. Explore the Valley 🗺️",
      emoji: "🌍",
      description: "Click the 'Explore' tab in the navigation bar to open the Valley Map. Visit landmarks like the Little Bridge, Pip's Burrow, or the Secret Library to complete dynamic quests.",
      tip: "Quests challenge Pip's Logical, Verbal, and Practical abilities."
    },
    {
      title: "3. Bookshelf Stories 📖",
      emoji: "📚",
      description: "Go to the 'Bookshelf' to read logic-infused stories. Answer comprehension quiz questions at the end of stories to earn Carrot Coins and level up Pip!",
      tip: "Feed Pip carrots from the bowl on the floor to maintain energy!"
    },
    {
      title: "4. Your Backpack 🎒",
      emoji: "🎒",
      description: "The 'Inventory' page holds your companion's inventory. Here you can equip unique keepsakes (hats, collars, accessories) and inspect custom items crafted by NPCs!",
      tip: "Your keepsakes sync with your companion's rendering in 2D."
    }
  ];

  const handlePlantClick = () => {
    setIsBubbleOpen(true);
    setZoomTarget("plant");
    if (companion && companion.cabbitMood === "sleeping") {
      setBubbleText("Zzz... Pip is sleeping peacefully and cannot water the plant right now.");
      return;
    }
    playWaterSound();
    setBubbleText("Ah! Thank you for the water! 💧 The plant looks so happy now! 🌱");
  };


  const handleTableClick = () => {
    setIsBubbleOpen(true);
    setZoomTarget("tea");
    if (companion && companion.cabbitMood === "sleeping") {
      setBubbleText("Zzz... Pip is sleeping and shouldn't drink cocoa right now.");
      return;
    }
    const randIdx = Math.floor(Math.random() * LITERATURE_QUOTES.length);
    const selected = LITERATURE_QUOTES[randIdx];
    setBubbleText(`*sips warm tea* ☕ Here is a nice quote for you:\n"${selected.quote}" — ${selected.author}`);
  };

  // Initial greeting
  useEffect(() => {
    if (companion) {
      const hour = new Date().getHours();
      let timeOfDay: "morning" | "afternoon" | "evening" | "night" = "afternoon";
      if (hour >= 5 && hour < 12) timeOfDay = "morning";
      else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
      else if (hour >= 17 && hour < 21) timeOfDay = "evening";
      else timeOfDay = "night";

      const text = getCompanionGreeting(companion, weather, timeOfDay, journalEntries);
      setBubbleText(text);
    }
  }, [companion, weather, journalEntries]);

  if (isLoading || !companion) return null;

  const isQuestCompleted = (questId: string) => {
    return completedQuestIds.includes(questId);
  };

  const getActiveQuest = () => {
    const allQuests = Object.values(quests);
    const incomplete = allQuests.find((q) => !isQuestCompleted(q.id));
    return incomplete || allQuests[0] || null;
  };

  const getQuestProgress = () => {
    const allQuests = Object.values(quests);
    if (allQuests.length === 0) return 0;
    const completed = allQuests.filter((q) => isQuestCompleted(q.id)).length;
    return (completed / allQuests.length) * 100;
  };

  const activeQuest = getActiveQuest();
  const questProgress = getQuestProgress();

  const getPipSprite = () => {
    if (isHopping) return "/assets/pip_hop.png";
    if (pipTile.x === 0 && pipTile.y === 0) return "/assets/pip_sleep.png";
    if (pipTile.x === 0 && pipTile.y === 3) return "/assets/pip_eat.png";
    return "/assets/pip_idle.png";
  };

  const isCabbitIdle = getPipSprite() === "/assets/pip_idle.png";
  const showMainModel = isCabbitIdle || isHopping || companion.cabbitMood === "sleeping";


  return (
    <div className="flex-1 flex relative overflow-hidden h-full w-full bg-[var(--neutral-0)] select-none">
      {/* Weather Overlay Filters */}
      {weather === "rainy" && <div className="absolute inset-0 bg-[#4A607A]/10 pointer-events-none z-5" />}
      {weather === "snowy" && <div className="absolute inset-0 bg-[#A6C0D9]/10 pointer-events-none z-5" />}
      {companion.cabbitMood === "sleeping" && <div className="absolute inset-0 bg-[#1A1E29]/30 pointer-events-none z-5" />}

      <div
        className={`relative w-full h-full transition-all duration-[800ms] ease-out overflow-hidden ${
          !zoomTarget ? "scale-100 translate-x-0 translate-y-0" :
          zoomTarget === "bookshelf" ? "scale-120 -translate-x-[18%] translate-y-[10%]" :
          zoomTarget === "closet" ? "scale-[1.3] -translate-x-[36%] translate-y-[4%]" :
          zoomTarget === "profile" ? "scale-[1.3] -translate-x-[22%] translate-y-[18%]" :
          zoomTarget === "explore" ? "scale-120 translate-x-[4%] translate-y-[26%]" :
          zoomTarget === "plant" ? "scale-120 translate-x-[36%] -translate-y-[28%]" :
          zoomTarget === "tea" ? "scale-120 translate-x-[20%] -translate-y-[14%]" :
          zoomTarget === "bowl" ? "scale-[1.25] -translate-x-[28%] -translate-y-[16%]" :
          zoomTarget === "cabbit" ? "scale-[1.2] translate-x-0 -translate-y-[8%]" :
          zoomTarget === "bed" ? "scale-[1.25] translate-x-[22%] translate-y-[18%]" :
          zoomTarget === "calendar" ? "scale-[1.3] -translate-x-[6%] translate-y-[15%]" :
          "scale-100 translate-x-0 translate-y-0"
        }`}
      >
        <motion.div
          key={weather}
          initial={{ filter: "blur(16px)", scale: 0.97 }}
          animate={{ filter: "blur(0px)", scale: 1 }}
          transition={{ type: "spring", stiffness: 85, damping: 16 }}
          className="absolute inset-0 size-full"
        >
          {/* Top-Anchored dialogue Bubble */}
          <AnimatePresence>
            {isBubbleOpen && bubbleText && (
              <TypedSpeechBubble
                text={bubbleText}
                name={companion.name}
                onClose={() => {
                  setIsBubbleOpen(false);
                  setZoomTarget(null);
                }}
              />
            )}
          </AnimatePresence>

          {/* Clay Bedroom Background Image (Full Bleed) */}
          <img 
            src={
              weather === "rainy" ? "/assets/cozy_room_bg_rainy.png" :
              weather === "snowy" ? "/assets/cozy_room_bg_snowy.png" :
              weather === "night" ? "/assets/cozy_room_bg_night.png" :
              weather === "foggy" ? "/assets/cozy_room_bg_foggy.png" :
              "/assets/cozy_room_bg_sunny.png"
            } 
            alt="Bedroom Background" 
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0" 
          />

          {/* HITBOX OVERLAYS */}
          {/* Bed Hitbox */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setZoomTarget("bed");
              const cycle: ("sunny" | "rainy" | "snowy" | "night" | "foggy")[] = ["sunny", "rainy", "snowy", "night", "foggy"];
              const remaining = cycle.filter(w => w !== weather);
              const randomWeather = remaining[Math.floor(Math.random() * remaining.length)];
              if (setWeather) setWeather(randomWeather);
              setTimeout(() => { setZoomTarget(null); }, 1500);
            }}
            className="hitbox-overlay z-20"
            style={{ left: "5.08%", top: "23.58%", width: "25.44%", height: "31.3%" }}
            title="Change Background"
          />

          {/* Carrot Calendar Hitbox */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setZoomTarget("calendar");
              const cycle: ("sunny" | "rainy" | "snowy" | "night" | "foggy")[] = ["sunny", "rainy", "snowy", "night", "foggy"];
              const nextIdx = (cycle.indexOf(weather) + 1) % cycle.length;
              if (setWeather) setWeather(cycle[nextIdx]);
              setTimeout(() => { setZoomTarget(null); }, 1500);
            }}
            className="hitbox-overlay z-20"
            style={{ left: "53.5%", top: "27.5%", width: "5.5%", height: "12.0%" }}
            title="Calendar"
          />

          {/* Bookshelf Hitbox */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={handleBookshelfClick}
            className="hitbox-overlay z-20"
            style={{ left: "65.5%", top: "30.82%", width: "23.85%", height: "24.06%" }}
            title="Bookshelf"
          />

          {/* Door/Closet Hitbox */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setZoomTarget("closet");
              setTimeout(() => {
                setScreenFlash(true);
              }, 350);
              setTimeout(() => {
                router.push("/backpack");
              }, 600);
            }}
            className="hitbox-overlay z-20"
            style={{ left: "91.8%", top: "41.77%", width: "8.2%", height: "38.81%" }}
            title="Closet"
          />

          {/* Cabbit Portrait Hitbox */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setZoomTarget("profile");
              setTimeout(() => {
                setScreenFlash(true);
              }, 350);
              setTimeout(() => {
                router.push("/profile");
              }, 600);
            }}
            className="hitbox-overlay z-20"
            style={{ left: "77%", top: "28%", width: "7%", height: "10%" }}
            title="Cabbit Portrait"
          />

          {/* Plant Hitbox */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={handlePlantClick}
            className="hitbox-overlay z-20"
            style={{ left: "0%", top: "78.21%", width: "18.99%", height: "21.79%" }}
            title="Water Plant"
          />

          {/* Window Hitbox */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setZoomTarget("explore");
              setTimeout(() => {
                setScreenFlash(true);
              }, 350);
              setTimeout(() => {
                router.push("/explore");
              }, 600);
            }}
            className="hitbox-overlay z-20"
            style={{ left: "35%", top: "5%", width: "30%", height: "25%" }}
            title="Explore"
          />

          {/* Table & Mug Hitbox */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={handleTableClick}
            className="hitbox-overlay z-20"
            style={{ left: "25%", top: "65%", width: "20%", height: "25%" }}
            title="Drink Tea"
          />

          {/* Food Bowl Hitbox */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={handleBowlClick}
            className="hitbox-overlay z-20"
            style={{ left: "81%", top: "53%", width: "8%", height: "10%" }}
            title="Feed Pip"
          />

          {/* 3D ISOMETRIC PLAYGROUND CANVAS */}
          <div className="absolute inset-0 flex items-center justify-center isometric-stage z-10">
            
            <div className="relative w-[500px] h-[500px] isometric-grid-canvas">
              {/* Isometric 4x4 Grid Board (Invisible to keep companion positioning logic clean) */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 bg-transparent relative overflow-hidden" />

              {/* THE COMPANION BILLBOARD SPRITE */}
              <motion.div
                className="absolute flex items-center justify-center z-20"
                style={{
                  left: showMainModel ? `${(pipTile.x * 25) - 12.5}%` : `${pipTile.x * 25}%`,
                  top: showMainModel ? `${(pipTile.y * 25) - 12.5}%` : `${pipTile.y * 25}%`,
                  width: "25%",
                  height: "25%",
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  left: showMainModel ? `${(pipTile.x * 25) - 12.5}%` : `${pipTile.x * 25}%`,
                  top: showMainModel ? `${(pipTile.y * 25) - 12.5}%` : `${pipTile.y * 25}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                {/* Flat drop-shadow on the floor */}
                {!showMainModel && (
                  <div className="absolute inset-x-4 bottom-1 h-3 bg-black/20 rounded-full blur-[1.5px]" />
                )}

                <div className="isometric-billboard-sprite size-full flex items-center justify-center relative">

                  <motion.div
                    whileHover={{ y: -6, scaleY: 1.05, rotate: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    className="flex flex-col items-center select-none"
                  >
                    <motion.div
                      key={`${pipTile.x}-${pipTile.y}-${isHopping}`}
                      animate={{
                        y: [-16, 0],
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 12
                      }}
                      className="-translate-y-6"
                    >
                      <motion.div
                        animate={{
                          scaleY: [1, 1.04, 1],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={showMainModel ? "w-[240px] h-[240px] relative flex items-center justify-center" : "w-14 h-16 relative flex items-center justify-center"}
                      >
                        {showMainModel ? (
                          <>
                            <div className={companion.cabbitMood === "sleeping" ? "rotate-[-70deg] translate-x-[-10px] translate-y-[20px] scale-[0.8]" : ""}>
                              <div className="cabbit-sprite-idle w-[240px] h-[240px] bg-contain bg-center bg-no-repeat" />
                            </div>
                            {/* Padded, dynamic hitbox overlay covering the Cabbit in standing or sleeping modes */}
                            <div 
                              onClick={handleCabbitClick}
                              className="hitbox-overlay absolute z-30 cursor-pointer"
                              style={{
                                width: companion.cabbitMood === "sleeping" ? "190px" : "150px",
                                height: companion.cabbitMood === "sleeping" ? "130px" : "190px",
                                top: companion.cabbitMood === "sleeping" ? "80px" : "25px",
                                left: companion.cabbitMood === "sleeping" ? "15px" : "45px",
                                borderRadius: "32px",
                              }}
                              title={companion.name}
                            />
                          </>
                        ) : (
                          <>
                            <img 
                              src={getPipSprite()} 
                              alt="Pip" 
                              className="w-full h-full object-contain pixelated pointer-events-none" 
                              style={{ imageRendering: "pixelated" }}
                            />
                            <div 
                              onClick={handleCabbitClick}
                              className="hitbox-overlay absolute inset-0 z-30 cursor-pointer"
                              style={{ borderRadius: "12px" }}
                              title={companion.name}
                            />
                          </>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>

                </div>
              </motion.div>

            </div>

          </div>
        </motion.div>



        {/* Full-screen Flash/Fade Overlay */}
        <div 
          className={`absolute inset-0 bg-[#fefdf9] z-[9999] pointer-events-none transition-opacity duration-250 ${
            screenFlash ? "opacity-100" : "opacity-0"
          }`} 
        />

        {/* Level Up Celebration Clay Modal Overlay */}
        {showLevelUpAlert && companion && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white border-4 border-black rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col items-center select-none animate-bounce-in">
              <span className="text-5xl select-none animate-bounce mb-4">🎉</span>
              <h2 className="text-2xl font-black text-black uppercase tracking-tight">LEVEL UP!</h2>
              <p className="text-xxs font-bold text-emerald-600 uppercase tracking-widest mt-1">
                {companion.name} reached Level {companion.level}!
              </p>
              
              <div className="my-6 w-full rounded-2xl border-4 border-black bg-[#fefdf9] p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2.5">
                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-wider block">Stats Increased:</span>
                <div className="grid grid-cols-2 gap-3 text-xs font-black uppercase text-neutral-800">
                  <div className="flex items-center gap-1.5">
                    <span>❤️ Health:</span>
                    <span className="text-emerald-600">{companion.health}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🧠 Learning:</span>
                    <span className="text-emerald-600">{companion.learning}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🤝 Kindness:</span>
                    <span className="text-emerald-600">{companion.kindness}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>⚡ Energy:</span>
                    <span className="text-emerald-600">{companion.energy}</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-neutral-500 leading-relaxed max-w-[250px] mb-6 font-medium">
                With higher levels, {companion.name} develops deeper logic capacities and unlocks specialized NPC actions!
              </p>

              <button
                onClick={() => setShowLevelUpAlert(false)}
                className="w-full py-3.5 text-center font-black text-white bg-black hover:bg-neutral-900 transition-all cursor-pointer rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 text-xs uppercase tracking-wider"
              >
                Hooray!
              </button>
            </div>
          </div>
        )}

        {/* Onboarding Tour Overlay */}
        {showOnboarding && companion && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99998] flex items-center justify-center p-4">
            <div className="w-full max-w-[480px] bg-[#fdfaf2] border-4 border-black rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col items-center select-none relative animate-bounce-in">
              
              {/* Skip Tour Button */}
              <button 
                onClick={handleFinishOnboarding}
                className="absolute top-4 right-6 text-xs font-bold text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                Skip Tour
              </button>

              {/* Title & Badge */}
              <div className="mb-4 mt-2">
                <div className="border-2 border-black bg-amber-50 px-4 py-1.5 rounded-full inline-block font-extrabold uppercase tracking-widest text-[#181818] text-xs">
                  Cabbits Guide
                </div>
                <h3 className="text-xl font-black text-black uppercase tracking-tight mt-3">
                  {onboardingSlides[onboardingStep].title}
                </h3>
              </div>

              {/* Emoji Representation */}
              <div className="my-3 w-32 h-32 flex flex-col items-center justify-center border-4 border-black rounded-full bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-5xl select-none">
                  {onboardingSlides[onboardingStep].emoji}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed text-neutral-700 min-h-[72px] max-w-[380px] px-2 font-medium">
                {onboardingSlides[onboardingStep].description}
              </p>

              {/* Tips panel */}
              <div className="w-full rounded-xl border-2 border-black bg-[#fefdf9] p-3 text-left shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-3">
                <span className="text-[8px] font-black text-neutral-400 uppercase tracking-wider block">Companion Tip:</span>
                <p className="text-[10px] text-neutral-600 font-semibold leading-relaxed mt-0.5">
                  {onboardingSlides[onboardingStep].tip}
                </p>
              </div>

              {/* Indicator Dots */}
              <div className="flex gap-2 justify-center my-5">
                {onboardingSlides.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setOnboardingStep(idx)}
                    className={`w-2.5 h-2.5 rounded-full border border-black transition-all ${
                      onboardingStep === idx ? "bg-black scale-110" : "bg-neutral-200"
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Controls */}
              <div className="flex gap-3 w-full">
                {onboardingStep > 0 ? (
                  <button
                    onClick={() => setOnboardingStep(prev => prev - 1)}
                    className="flex-1 py-3 text-center font-black text-black bg-white hover:bg-neutral-50 transition-all cursor-pointer rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 text-xs uppercase tracking-wider"
                  >
                    Back
                  </button>
                ) : (
                  <div className="flex-1" />
                )}

                {onboardingStep < onboardingSlides.length - 1 ? (
                  <button
                    onClick={() => setOnboardingStep(prev => prev + 1)}
                    className="flex-1 py-3 text-center font-black text-white bg-black hover:bg-neutral-900 transition-all cursor-pointer rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 text-xs uppercase tracking-wider !bg-black !text-white"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleFinishOnboarding}
                    className="flex-1 py-3 text-center font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 text-xs uppercase tracking-wider !bg-emerald-600 !text-white"
                  >
                    Start Exploring! ✦
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function Home() {
  const { companion, isLoading, feedCabbit, toggleSleep } = useCompanion();
  const router = useRouter();
  const { setSidebarContent } = useMainShellSidebar();

  const [bubbleText, setBubbleText] = useState<string>("");
  const [isBubbleOpen, setIsBubbleOpen] = useState(false);
  const [showPing, setShowPing] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<string | null>(null);
  const [screenFlash, setScreenFlash] = useState(false);
  const [pipTile, setPipTile] = useState<{ x: number; y: number }>({ x: 2, y: 2 });
  const [isHopping, setIsHopping] = useState(false);

  useEffect(() => {
    setSidebarContent(<HomeSidebar />);
    return () => setSidebarContent(null);
  }, [setSidebarContent]);

  // Delay dialogue bubble entry and bookshelf action ping until blur transition settles
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBubbleOpen(true);
      setShowPing(true);
    }, 65);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleSleep = async () => {
    setIsBubbleOpen(true);
    setIsHopping(true);
    setZoomTarget("bed");
    
    // Hop target coordination
    const target = companion && companion.cabbitMood === "sleeping" ? { x: 2, y: 2 } : { x: 0, y: 0 };
    setPipTile(target);

    // Short hop delay
    setTimeout(async () => {
      setIsHopping(false);
      await toggleSleep();
      if (companion && companion.cabbitMood === "sleeping") {
        setBubbleText("Yawn... Good morning! Let's play!");
      } else {
        setBubbleText("Zzz... Good night!");
      }
    }, 600);
  };

  const handleBowlClick = async () => {
    setIsBubbleOpen(true);
    setZoomTarget("bowl");
    if (companion && companion.cabbitMood === "sleeping") {
      setBubbleText("Shh, I'm sleeping right now!");
      return;
    }
    if (companion && companion.carrotCoins < 5) {
      setBubbleText("Oh, we need more Carrot Coins! Let's complete a quest!");
      return;
    }
    setIsHopping(true);
    setPipTile({ x: 0, y: 3 });

    setTimeout(async () => {
      setIsHopping(false);
      await feedCabbit();
      setBubbleText("Yum! That carrot was delicious! 🥕");
      
      // Hop back to rug after feeding
      setTimeout(() => {
        setIsHopping(true);
        setPipTile({ x: 2, y: 2 });
        setTimeout(() => {
          setIsHopping(false);
        }, 600);
      }, 2500);
    }, 600);
  };

  const handleBookshelfClick = () => {
    setZoomTarget("bookshelf");
    setBubbleText("Let's go look at the books!");
    setTimeout(() => {
      setScreenFlash(true);
    }, 350);
    setTimeout(() => {
      router.push("/bookshelf");
    }, 600);
  };

  const handleCabbitClick = () => {
    setIsBubbleOpen(true);
    setZoomTarget("cabbit");
    if (companion && companion.cabbitMood === "sleeping") {
      setBubbleText("Zzz... Pip is sleeping peacefully.");
      return;
    }
    setBubbleText("Pip is happy to be here with you!");
  };

  // Sync Pip tile with sleeping state on load/change
  useEffect(() => {
    if (companion) {
      if (companion.cabbitMood === "sleeping") {
        setPipTile({ x: 0, y: 0 });
      } else {
        setPipTile({ x: 2, y: 2 });
      }
    }
  }, [companion?.cabbitMood]);

  // Wake companion with ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && companion && companion.cabbitMood === "sleeping") {
        handleToggleSleep();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [companion, handleToggleSleep]);

  if (isLoading || !companion) return null;

  return (
    <HomeContent 
      bubbleText={bubbleText} 
      setBubbleText={setBubbleText} 
      isBubbleOpen={isBubbleOpen} 
      setIsBubbleOpen={setIsBubbleOpen} 
      zoomTarget={zoomTarget} 
      setZoomTarget={setZoomTarget} 
      pipTile={pipTile}
      setPipTile={setPipTile}
      isHopping={isHopping}
      setIsHopping={setIsHopping}
      handleToggleSleep={handleToggleSleep}
      handleBowlClick={handleBowlClick}
      handleBookshelfClick={handleBookshelfClick}
      handleCabbitClick={handleCabbitClick}
      screenFlash={screenFlash}
      setScreenFlash={setScreenFlash}
      showPing={showPing}
    />
  );
}
