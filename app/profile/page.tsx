"use client";

import React, { useEffect, useState } from "react";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { useMainShellSidebar } from "@/components/layout/MainShell";
import { motion } from "framer-motion";
import { Item } from "@/types";

function ProfileSidebar() {
  const { companion } = useCompanion();

  if (!companion) return null;

  return (
    <div className="w-full text-left space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-black capitalize">{companion.name}</h2>
        <span className="text-lg">✏️</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-black text-black">Lv. {companion.level}</h3>
        <div className="h-4 bg-[var(--neutral-200)] border-2 border-black rounded-full overflow-hidden w-full relative">
          <div className="absolute top-0 left-0 h-full bg-[#4A6FA5]" style={{ width: `${(companion.xp / 800) * 100}%` }} />
        </div>
        <p className="text-center text-xs font-bold text-[var(--neutral-800)]">
          {companion.xp} / 800 XP
        </p>
      </div>

      <div className="p-5 chunky-panel bg-[#fefdf9] space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)]">
          Core Stats
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">❤️</span>
              <span className="text-sm font-bold text-[var(--neutral-800)]">Health</span>
            </div>
            <span className="text-sm font-black text-black">{companion.health}/120</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span className="text-sm font-bold text-[var(--neutral-800)]">Learning</span>
            </div>
            <span className="text-sm font-black text-black">{companion.learning}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍃</span>
              <span className="text-sm font-bold text-[var(--neutral-800)]">Kindness</span>
            </div>
            <span className="text-sm font-black text-black">{companion.kindness}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-bold text-[var(--neutral-800)]">Energy</span>
            </div>
            <span className="text-sm font-black text-black">{companion.energy}/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileContent() {
  const { companion, items } = useCompanion();
  const [activeTab, setActiveTab] = useState<"all" | "weapon" | "armor" | "accessory" | "star">("all");

  if (!companion) return null;

  const equipmentItems = companion.inventory
    .map(id => items[id])
    .filter((item): item is Item => !!item && item.type === "equipment");

  return (
    <motion.div
      initial={{ filter: "blur(16px)", scale: 0.97 }}
      animate={{ filter: "blur(0px)", scale: 1 }}
      transition={{ type: "spring", stiffness: 85, damping: 16 }}
      className="flex h-full w-full relative overflow-hidden bg-[#9ecae0]"
    >
      {/* Background Clouds */}
      <div className="absolute top-10 left-10 text-6xl opacity-70">☁️</div>
      <div className="absolute top-20 left-1/3 text-4xl opacity-70">☁️</div>
      <div className="absolute top-12 right-1/4 text-5xl opacity-70">☁️</div>

      {/* Center Stage: Cabbit on Island */}
      <div className="flex-1 flex flex-col items-center justify-end pb-12 relative z-10 translate-x-[40px]">
        <div className="relative flex items-center justify-center -mb-32">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="cabbit-sprite-idle w-[380px] h-[380px] bg-contain bg-center bg-no-repeat relative z-20 drop-shadow-xl"
          />
        </div>
        {/* Island Base */}
        <div className="w-[580px] h-[180px] bg-[#6ab04c] border-b-[24px] border-[#a07b50] rounded-[50%] shadow-[0_12px_0_rgba(0,0,0,0.2)] relative z-10 flex items-center justify-center">
           <div className="absolute inset-2 border-2 border-[#badc58] rounded-[50%] opacity-50"></div>
           <span className="absolute left-12 top-8 text-3xl">🌿</span>
           <span className="absolute right-16 bottom-8 text-2xl">🌼</span>
        </div>
        {/* Background Bushes behind island */}
        <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-[#5a9c3c] to-transparent opacity-20 pointer-events-none z-0"></div>
      </div>

      {/* Right Sidebar: Equipment Panel */}
      <motion.div 
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="w-[420px] h-full flex items-center p-6 relative z-20"
      >
        {/* Equipment Tab handle (decorative) */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-32 bg-[#4A6FA5] border-y-4 border-l-4 border-black rounded-l-2xl flex items-center justify-center shadow-[-4px_4px_0px_rgba(0,0,0,0.2)] z-30">
          <span className="text-white font-black text-xs -rotate-90 tracking-widest whitespace-nowrap">EQUIPMENT</span>
        </div>

        <div className="w-full h-[90%] chunky-panel bg-[#faedcd] flex flex-col relative z-40 p-5 space-y-4 shadow-[-8px_8px_0px_rgba(0,0,0,0.2)] overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <h2 className="text-xl font-black text-black">Equipment</h2>
            </div>
            <button className="w-8 h-8 bg-[#4A6FA5] text-white font-black rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer">
              X
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded-full font-black text-xs border-2 border-black transition-all ${activeTab === "all" ? "bg-[#4A6FA5] text-white shadow-[2px_2px_0px_black]" : "bg-white text-black hover:bg-neutral-100"}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab("weapon")}
              className={`px-3 py-1.5 rounded-full font-black text-xs border-2 border-black transition-all ${activeTab === "weapon" ? "bg-[#4A6FA5] text-white shadow-[2px_2px_0px_black]" : "bg-white text-black hover:bg-neutral-100"}`}
            >
              🗡️
            </button>
            <button 
              onClick={() => setActiveTab("armor")}
              className={`px-3 py-1.5 rounded-full font-black text-xs border-2 border-black transition-all ${activeTab === "armor" ? "bg-[#4A6FA5] text-white shadow-[2px_2px_0px_black]" : "bg-white text-black hover:bg-neutral-100"}`}
            >
              👕
            </button>
            <button 
              onClick={() => setActiveTab("accessory")}
              className={`px-3 py-1.5 rounded-full font-black text-xs border-2 border-black transition-all ${activeTab === "accessory" ? "bg-[#4A6FA5] text-white shadow-[2px_2px_0px_black]" : "bg-white text-black hover:bg-neutral-100"}`}
            >
              💍
            </button>
            <button 
              onClick={() => setActiveTab("star")}
              className={`px-3 py-1.5 rounded-full font-black text-xs border-2 border-black transition-all ${activeTab === "star" ? "bg-[#4A6FA5] text-white shadow-[2px_2px_0px_black]" : "bg-white text-black hover:bg-neutral-100"}`}
            >
              ⭐
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-2 pb-4">
            {equipmentItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {equipmentItems.map(item => (
                  <div key={item.id} className="chunky-panel bg-white p-3 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:-translate-y-1 hover:shadow-[6px_6px_0px_black] transition-all">
                    <div className="text-4xl drop-shadow-md">{item.icon}</div>
                    <span className="text-xs font-black text-[var(--neutral-900)] leading-tight">{item.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                <img 
                  src="/assets/bag-coming-soon.jpg" 
                  alt="Equipment Coming Soon" 
                  className="w-[180px] h-[180px] object-contain rounded-2xl border-4 border-black shadow-[4px_4px_0px_black] bg-white p-1"
                />
                <p className="text-[10px] leading-relaxed text-[var(--neutral-500)] font-black max-w-[200px] uppercase tracking-wider">
                  Collect equipment on your adventures to customize Pip's gear!
                </p>
              </div>
            )}
          </div>
          
          {/* Pagination Placeholder */}
          <div className="pt-2 flex items-center justify-between font-black text-[var(--neutral-500)] text-xs border-t border-[var(--neutral-300)]">
            <span className="cursor-pointer hover:text-black">{"<"}</span>
            <span>1 / 2</span>
            <span className="cursor-pointer hover:text-black">{">"}</span>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { setSidebarContent } = useMainShellSidebar();

  useEffect(() => {
    setSidebarContent(<ProfileSidebar />);
    return () => setSidebarContent(null);
  }, [setSidebarContent]);

  return <ProfileContent />;
}
