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
  const { companion } = useCompanion();

  if (!companion) return null;

  return (
    <motion.div
      initial={{ filter: "blur(16px)", scale: 0.97 }}
      animate={{ filter: "blur(0px)", scale: 1 }}
      transition={{ type: "spring", stiffness: 85, damping: 16 }}
      className="flex h-full w-full relative overflow-hidden bg-[#9ecae0]"
    >
      {/* Profile Background Image */}
      <img 
        src="/assets/profile-bg.png?v=1" 
        alt="Profile Background" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* Center Stage: Cabbit on Island (Centered vertically) */}
      <div className="flex-1 flex flex-col items-center justify-center pt-16 relative z-10 translate-x-[40px]">
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
        <div className="w-full h-[90%] chunky-panel bg-[#faedcd] flex flex-col relative z-40 p-5 space-y-4 shadow-[-8px_8px_0px_rgba(0,0,0,0.2)] overflow-hidden">
          {/* Centered Bag Illustration */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <img 
              src="/assets/bag-coming-soon.png" 
              alt="Equipment Coming Soon" 
              className="w-[360px] h-[360px] object-contain"
            />
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
