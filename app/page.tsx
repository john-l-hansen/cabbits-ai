"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { getCompanionGreeting } from "@/lib/agents/dialogue";
import { MainShell, useMainShell } from "@/components/layout/MainShell";
import { motion, AnimatePresence } from "framer-motion";

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
        setTypedText((prev) => prev + text[idx]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 20); // typing speed
    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.div
      initial={{ scale: 0, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0, y: 30, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute bottom-28 bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-[16px] z-50 text-left select-none w-64"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="font-mono text-[9px] font-black uppercase tracking-wider text-[var(--neutral-400)] block">
        {name}
      </span>
      <p className="text-xs font-semibold text-black leading-normal mt-1 italic">
        "{typedText}"
      </p>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2.5 right-2.5 text-xxs font-extrabold text-[var(--neutral-400)] hover:text-black cursor-pointer bg-transparent border-none outline-none"
      >
        ✕
      </button>

      {/* Speech bubble tail pointer pointing down */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-black" />
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[3px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
    </motion.div>
  );
}

interface HomeSidebarProps {
  handleToggleSleep: () => Promise<void>;
  handleBowlClick: () => Promise<void>;
  handleBookshelfClick: () => void;
  handleCabbitClick: () => void;
}

function HomeSidebar({ handleToggleSleep, handleBowlClick, handleBookshelfClick, handleCabbitClick }: HomeSidebarProps) {
  const { companion } = useCompanion();

  if (!companion) return null;

  return (
    <div className="space-y-4 text-left">
      <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)] block">Points of Interest</span>
      <div className="flex flex-col gap-3">
        <button
          onClick={handleToggleSleep}
          className="w-full text-left p-3.5 chunky-button flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span>🛌</span>
            <span className="text-xs font-black">Bed</span>
          </div>
          <span className="text-[9px] font-black text-[var(--neutral-500)] uppercase">
            {companion.cabbitMood === "sleeping" ? "Wake" : "Sleep"}
          </span>
        </button>
        <button
          onClick={handleBowlClick}
          className="w-full text-left p-3.5 chunky-button flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span>🥣</span>
            <span className="text-xs font-black">Bowl</span>
          </div>
          <span className="text-[9px] font-black text-[var(--neutral-500)] uppercase">Feed Pip</span>
        </button>
        <button
          onClick={handleBookshelfClick}
          className="w-full text-left p-3.5 chunky-button flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span>📚</span>
            <span className="text-xs font-black">Bookshelf</span>
          </div>
          <span className="text-[9px] font-black text-[var(--neutral-500)] uppercase">Learn</span>
        </button>
        <button
          onClick={() => {
            alert("Hmm, this wardrobe is locked for now. Perhaps we will find clothes later!");
          }}
          className="w-full text-left p-3.5 chunky-button flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span>🚪</span>
            <span className="text-xs font-black">Wardrobe</span>
          </div>
          <span className="text-[9px] font-black text-red-600 uppercase">Locked</span>
        </button>
        <button
          onClick={handleCabbitClick}
          className="w-full text-left p-3.5 chunky-button flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span>🐰</span>
            <span className="text-xs font-black">Rug / Pip</span>
          </div>
          <span className="text-[9px] font-black text-[var(--neutral-500)] uppercase">Interact</span>
        </button>
      </div>
    </div>
  );
}

interface HomeContentProps {
  bubbleText: string;
  setBubbleText: (t: string) => void;
  isBubbleOpen: boolean;
  setIsBubbleOpen: (b: boolean) => void;
  zoomTransition: boolean;
  setZoomTransition: (z: boolean) => void;
  pipTile: { x: number; y: number };
  setPipTile: (t: { x: number; y: number }) => void;
  isHopping: boolean;
  setIsHopping: (b: boolean) => void;
  handleToggleSleep: () => Promise<void>;
  handleBowlClick: () => Promise<void>;
  handleBookshelfClick: () => void;
  handleCabbitClick: () => void;
}

export function HomeContent({
  bubbleText,
  setBubbleText,
  isBubbleOpen,
  setIsBubbleOpen,
  zoomTransition,
  setZoomTransition,
  pipTile,
  setPipTile,
  isHopping,
  setIsHopping,
  handleToggleSleep,
  handleBowlClick,
  handleBookshelfClick,
  handleCabbitClick,
}: HomeContentProps) {
  const { companion, isLoading, quests, memories, journalEntries } = useCompanion();
  const { weather } = useMainShell();

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

  const getActiveQuest = () => {
    const list = ["notice_one_thing", "watch_ripples", "count_flowers", "wise_owl", "tidy_tunnel", "decipher_rune"];
    const incomplete = list.find(id => !isQuestCompleted(id));
    return incomplete ? quests[incomplete] : quests["notice_one_thing"];
  };

  const getQuestProgress = () => {
    const list = ["notice_one_thing", "watch_ripples", "count_flowers", "wise_owl", "tidy_tunnel", "decipher_rune"];
    const completed = list.filter(id => isQuestCompleted(id)).length;
    return (completed / list.length) * 100;
  };

  const activeQuest = getActiveQuest();
  const questProgress = getQuestProgress();

  const getPipSprite = () => {
    if (isHopping) return "/assets/pip_hop.png";
    if (pipTile.x === 0 && pipTile.y === 0) return "/assets/pip_sleep.png";
    if (pipTile.x === 0 && pipTile.y === 3) return "/assets/pip_eat.png";
    return "/assets/pip_idle.png";
  };

  return (
    <div className="flex-1 flex relative overflow-hidden h-full w-full bg-[var(--neutral-0)] select-none">
      {/* Weather Overlay Filters */}
      {weather === "rainy" && <div className="absolute inset-0 bg-[#4A607A]/10 pointer-events-none z-5" />}
      {weather === "snowy" && <div className="absolute inset-0 bg-[#A6C0D9]/10 pointer-events-none z-5" />}
      {companion.cabbitMood === "sleeping" && <div className="absolute inset-0 bg-[#1A1E29]/30 pointer-events-none z-5" />}

      {/* Room Container (Full Bleed View Version) */}
      <div
        className={`relative w-full h-full transition-all duration-700 overflow-hidden ${
          zoomTransition ? "scale-110 translate-x-12 -translate-y-6" : "scale-100"
        }`}
      >
        {/* Clay Bedroom Background Image (Full Bleed) */}
        <img 
          src="/assets/cozy_room_bg.png" 
          alt="Bedroom Background" 
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0" 
        />

        {/* 3D ISOMETRIC PLAYGROUND CANVAS */}
        <div className="absolute inset-0 flex items-center justify-center isometric-stage z-10">
          
          <div className="relative w-[500px] h-[500px] isometric-grid-canvas">
            
            {/* Isometric 4x4 Grid Board */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 border-4 border-black bg-white/5 relative overflow-hidden">
              {Array.from({ length: 16 }).map((_, i) => {
                const x = i % 4;
                const y = Math.floor(i / 4);
                const isRug = x === 2 && y === 2;
                return (
                  <div
                    key={i}
                    className="border border-[var(--neutral-200)] relative flex items-center justify-center"
                  >
                    {isRug && (
                      /* Flat Rug on the floor (2D) */
                      <div className="absolute inset-2 bg-[var(--neutral-300)] rounded-full border-2 border-black border-dashed" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* HOTSPOT 1: Bed at (0, 0) */}
            <div
              className="absolute pointer-events-auto"
              style={{ left: "0%", top: "0%", width: "25%", height: "25%", transformStyle: "preserve-3d" }}
            >
              <div className="isometric-billboard-sprite size-full flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, rotateY: 5, y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={handleToggleSleep}
                  className="chunky-button p-3 flex flex-col items-center justify-center text-center group relative -translate-y-8"
                  style={{ width: "90px", height: "90px" }}
                >
                  <span className="text-3xl select-none group-hover:animate-bounce">🛏️</span>
                  <span className="text-[10px] font-black text-black mt-1">Bed</span>
                  <span className="text-[8px] font-bold text-[var(--neutral-500)] uppercase mt-0.5">
                    {companion.cabbitMood === "sleeping" ? "Wake" : "Sleep"}
                  </span>
                </motion.button>
              </div>
            </div>

            {/* HOTSPOT 2: Bookshelf at (3, 0) */}
            <div
              className="absolute pointer-events-auto"
              style={{ left: "75%", top: "0%", width: "25%", height: "25%", transformStyle: "preserve-3d" }}
            >
              <div className="isometric-billboard-sprite size-full flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.03, rotate: 2, y: -6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={handleBookshelfClick}
                  className="chunky-button p-3 flex flex-col items-center justify-center text-center group relative -translate-y-12"
                  style={{ width: "70px", height: "120px" }}
                >
                  <span className="text-3xl select-none group-hover:rotate-6 transition-transform">📚</span>
                  <span className="text-[10px] font-black text-black mt-2 leading-tight">Bookshelf</span>
                  <span className="text-[8px] font-bold text-[var(--neutral-500)] uppercase mt-1">Learn</span>
                </motion.button>
              </div>
            </div>

            {/* HOTSPOT 3: Wardrobe at (3, 3) */}
            <div
              className="absolute pointer-events-auto"
              style={{ left: "75%", top: "75%", width: "25%", height: "25%", transformStyle: "preserve-3d" }}
            >
              <div className="isometric-billboard-sprite size-full flex items-center justify-center">
                <motion.button
                  whileHover={{ scaleX: 1.05, y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => {
                    setIsBubbleOpen(true);
                    setBubbleText("Hmm, this wardrobe is locked for now. Perhaps we will find clothes later!");
                  }}
                  className="chunky-button p-3 flex flex-col items-center justify-center text-center group relative -translate-y-12"
                  style={{ width: "70px", height: "120px" }}
                >
                  <span className="text-3xl select-none group-hover:scale-105 transition-transform">🚪</span>
                  <span className="text-[10px] font-black text-black mt-2 leading-tight">Wardrobe</span>
                  <span className="text-[8px] font-bold text-red-600 uppercase mt-1">Locked</span>
                </motion.button>
              </div>
            </div>

            {/* HOTSPOT 4: Food Bowl at (0, 3) */}
            <div
              className="absolute pointer-events-auto"
              style={{ left: "0%", top: "75%", width: "25%", height: "25%", transformStyle: "preserve-3d" }}
            >
              <div className="isometric-billboard-sprite size-full flex items-center justify-center">
                <motion.button
                  whileHover={{ rotate: [-2, 2, -2, 0], scale: 1.06, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={handleBowlClick}
                  className="chunky-button p-2 flex flex-col items-center justify-center text-center group relative -translate-y-6"
                  style={{ width: "80px", height: "80px" }}
                >
                  <span className="text-2xl select-none group-hover:scale-110 transition-transform">🥣</span>
                  <span className="text-[10px] font-black text-black mt-1">Bowl</span>
                  <span className="text-[8px] font-bold text-[var(--neutral-500)] uppercase mt-0.5">Feed</span>
                </motion.button>
              </div>
            </div>

            {/* THE COMPANION BILLBOARD SPRITE */}
            <motion.div
              className="absolute flex items-center justify-center z-20"
              style={{
                left: `${pipTile.x * 25}%`,
                top: `${pipTile.y * 25}%`,
                width: "25%",
                height: "25%",
                transformStyle: "preserve-3d",
              }}
              animate={{
                left: `${pipTile.x * 25}%`,
                top: `${pipTile.y * 25}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
            >
              {/* Flat drop-shadow on the floor */}
              <div className="absolute inset-x-4 bottom-1 h-3 bg-black/20 rounded-full blur-[1.5px]" />

              <div className="isometric-billboard-sprite size-full flex items-center justify-center relative">
                
                {/* Tactics RPG Double Border Dialog Bubble */}
                <AnimatePresence>
                  {isBubbleOpen && bubbleText && (
                    <TypedSpeechBubble
                      text={bubbleText}
                      name={companion.name}
                      onClose={() => setIsBubbleOpen(false)}
                    />
                  )}
                </AnimatePresence>

                {/* Pixel Pip character asset */}
                <motion.div
                  onClick={handleCabbitClick}
                  whileHover={{ y: -6, scaleY: 1.05, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  className="cursor-pointer flex flex-col items-center select-none"
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
                      className="w-14 h-16 relative flex items-center justify-center"
                    >
                      <img 
                        src={getPipSprite()} 
                        alt="Pip" 
                        className="w-full h-full object-contain pixelated pointer-events-none" 
                        style={{ imageRendering: "pixelated" }}
                      />
                    </motion.div>
                  </motion.div>

                  <div className="absolute bottom-2 bg-[var(--neutral-1000)] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm select-none border border-black">
                    {companion.name}
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>

        </div>

        {/* FLOATING DAILY QUEST CARD (Pinned to Top-Right of view) */}
        <div className="absolute right-8 top-8 w-[180px] chunky-panel p-4 flex flex-col gap-2 pointer-events-none select-none z-25 animate-fade-in bg-white">
          <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-500)]">Active Tracker</span>
          <h5 className="text-xxs font-extrabold text-[var(--neutral-900)] truncate mt-0.5">{activeQuest.title}</h5>
          <div className="h-2 bg-[var(--neutral-200)] border border-black rounded-none overflow-hidden w-full">
            <div className="h-full bg-[var(--neutral-1000)]" style={{ width: `${questProgress}%` }} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Home() {
  const { companion, isLoading, feedCabbit, toggleSleep } = useCompanion();
  const router = useRouter();

  const [bubbleText, setBubbleText] = useState<string>("");
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [zoomTransition, setZoomTransition] = useState(false);
  const [pipTile, setPipTile] = useState<{ x: number; y: number }>({ x: 2, y: 2 });
  const [isHopping, setIsHopping] = useState(false);

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

  if (isLoading || !companion) return null;

  const handleToggleSleep = async () => {
    setIsBubbleOpen(true);
    setIsHopping(true);
    
    // Hop target coordination
    const target = companion.cabbitMood === "sleeping" ? { x: 2, y: 2 } : { x: 0, y: 0 };
    setPipTile(target);

    // Short hop delay
    setTimeout(async () => {
      setIsHopping(false);
      await toggleSleep();
      if (companion.cabbitMood === "sleeping") {
        setBubbleText("Yawn... Good morning! Let's play!");
      } else {
        setBubbleText("Zzz... Good night!");
      }
    }, 600);
  };

  const handleBowlClick = async () => {
    setIsBubbleOpen(true);
    if (companion.cabbitMood === "sleeping") {
      setBubbleText("Shh, I'm sleeping right now!");
      return;
    }
    if (companion.carrotCoins < 5) {
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
    setZoomTransition(true);
    setBubbleText("Let's go look at the books!");
    setTimeout(() => {
      router.push("/bookshelf");
    }, 600);
  };

  const handleCabbitClick = () => {
    setIsBubbleOpen(true);
    if (companion.cabbitMood === "sleeping") {
      setBubbleText("Zzz... Pip is sleeping peacefully.");
      return;
    }
    setBubbleText("Pip is happy to be here with you!");
  };

  return (
    <MainShell sidebarContent={
      <HomeSidebar 
        handleToggleSleep={handleToggleSleep}
        handleBowlClick={handleBowlClick}
        handleBookshelfClick={handleBookshelfClick}
        handleCabbitClick={handleCabbitClick}
      />
    }>
      <HomeContent 
        bubbleText={bubbleText} 
        setBubbleText={setBubbleText} 
        isBubbleOpen={isBubbleOpen} 
        setIsBubbleOpen={setIsBubbleOpen} 
        zoomTransition={zoomTransition} 
        setZoomTransition={setZoomTransition} 
        pipTile={pipTile}
        setPipTile={setPipTile}
        isHopping={isHopping}
        setIsHopping={setIsHopping}
        handleToggleSleep={handleToggleSleep}
        handleBowlClick={handleBowlClick}
        handleBookshelfClick={handleBookshelfClick}
        handleCabbitClick={handleCabbitClick}
      />
    </MainShell>
  );
}
