"use client";

import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function DesignSystemPage() {
  const [selectedNav, setSelectedNav] = useState("home");
  const [isPressing, setIsPressing] = useState(false);

  return (
    <main className="min-h-screen bg-[#FFF1D6] p-8 font-sans text-[#442515]">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-[#F7DFAE] pb-6">
          <div>
            <span className="text-xxs font-black uppercase tracking-widest text-[#754728]">Design System</span>
            <h1 className="text-3xl font-black text-[#442515] mt-1 font-fredoka">Cabbits UI Catalog</h1>
          </div>
          <Link href="/login" className="px-5 py-2.5 text-xs font-bold bg-[#FFF9ED] border-2 border-[#F7DFAE] rounded-xl hover:bg-white transition-all shadow-sm text-[#754728]">
            ← Return to App
          </Link>
        </header>

        {/* SECTION 1: COLOR SYSTEM */}
        <section className="space-y-6">
          <h2 className="text-xl font-black font-fredoka">1. Color Palette Tokens</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Core Neutrals */}
            <div className="bg-[#FFF9ED] border border-[#F7DFAE] rounded-2xl p-4 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-black text-[#754728] uppercase">Neutrals</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-black/10 bg-[#FFF9ED]" />
                <div className="text-xs">
                  <p className="font-bold">cream-50</p>
                  <p className="text-[10px] text-gray-500">#FFF9ED</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-black/10 bg-[#FFF1D6]" />
                <div className="text-xs">
                  <p className="font-bold">cream-100</p>
                  <p className="text-[10px] text-gray-500">#FFF1D6</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-black/10 bg-[#F7DFAE]" />
                <div className="text-xs">
                  <p className="font-bold">cream-200</p>
                  <p className="text-[10px] text-gray-500">#F7DFAE</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-black/10 bg-[#442515]" />
                <div className="text-xs">
                  <p className="font-bold">cocoa-700</p>
                  <p className="text-[10px] text-gray-500">#442515</p>
                </div>
              </div>
            </div>

            {/* Honey & Woods */}
            <div className="bg-[#FFF9ED] border border-[#F7DFAE] rounded-2xl p-4 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-black text-[#754728] uppercase">Honey & Woods</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F7C66D]" />
                <div className="text-xs">
                  <p className="font-bold">honey-100</p>
                  <p className="text-[10px] text-gray-500">#F7C66D</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#EFA43B]" />
                <div className="text-xs">
                  <p className="font-bold">honey-300</p>
                  <p className="text-[10px] text-gray-500">#EFA43B</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#B9691E]" />
                <div className="text-xs">
                  <p className="font-bold">caramel-500</p>
                  <p className="text-[10px] text-gray-500">#B9691E</p>
                </div>
              </div>
            </div>

            {/* Greens & Blues */}
            <div className="bg-[#FFF9ED] border border-[#F7DFAE] rounded-2xl p-4 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-black text-[#754728] uppercase">Garden & Water</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#A8C94B]" />
                <div className="text-xs">
                  <p className="font-bold">leaf-300</p>
                  <p className="text-[10px] text-gray-500">#A8C94B</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#6E9B24]" />
                <div className="text-xs">
                  <p className="font-bold">leaf-500</p>
                  <p className="text-[10px] text-gray-500">#6E9B24</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#9CC9E7]" />
                <div className="text-xs">
                  <p className="font-bold">sky-300</p>
                  <p className="text-[10px] text-gray-500">#9CC9E7</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#356B9A]" />
                <div className="text-xs">
                  <p className="font-bold">sky-700</p>
                  <p className="text-[10px] text-gray-500">#356B9A</p>
                </div>
              </div>
            </div>

            {/* Accents */}
            <div className="bg-[#FFF9ED] border border-[#F7DFAE] rounded-2xl p-4 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-black text-[#754728] uppercase">Accents</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F5A61B]" />
                <div className="text-xs">
                  <p className="font-bold">sun-500</p>
                  <p className="text-[10px] text-gray-500">#F5A61B</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FF9B3D]" />
                <div className="text-xs">
                  <p className="font-bold">carrot-400</p>
                  <p className="text-[10px] text-gray-500">#FF9B3D</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F56C3A]" />
                <div className="text-xs">
                  <p className="font-bold">coral-500</p>
                  <p className="text-[10px] text-gray-500">#F56C3A</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: SURFACES */}
        <section className="space-y-6">
          <h2 className="text-xl font-black font-fredoka">2. Tactile Surfaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Standard Card Surface */}
            <div className="cab-card p-6 flex flex-col justify-between min-h-[160px]">
              <div>
                <span className="text-[10px] font-black text-[#754728] uppercase tracking-wider">Default Surface (.cab-card)</span>
                <h3 className="text-lg font-black mt-2 leading-tight">Handmolded Status Card</h3>
                <p className="text-xs text-[#754728] mt-1 leading-relaxed">
                  Creamy background `#FFF9ED`, custom radius, and a warm low-opacity caramel drop shadow.
                </p>
              </div>
            </div>

            {/* Speech Bubble Surface */}
            <div className="cab-bubble min-h-[160px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-[#754728] uppercase tracking-wider">Pip Reflects (.cab-bubble)</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F56C3A] animate-pulse" />
                </div>
                <p className="text-xs text-[#442515] italic font-semibold leading-relaxed">
                  “The weather here in Crescent Valley is so quiet today. Shall we look closer at the water ripples in the pond?”
                </p>
              </div>
              <div className="text-[9px] font-black uppercase text-[#754728] mt-4">
                Companion Speech Bubble
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: BUTTONS & INTERACTION STATES */}
        <section className="space-y-6">
          <h2 className="text-xl font-black font-fredoka">3. Interactivity & Snappy Press States</h2>
          <div className="bg-[#FFF9ED] border border-[#F7DFAE] rounded-3xl p-6 space-y-6">
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Default Button */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-[#754728] uppercase">Default</span>
                <button className="cab-button bg-white text-[#442515] border-2 border-black/10 py-3 text-xs font-bold cursor-pointer">
                  Submit Item
                </button>
              </div>

              {/* Primary Themed Button */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-[#754728] uppercase">Primary Blue</span>
                <button className="cab-button bg-[#609DCC] text-white border-2 border-black/10 py-3 text-xs font-bold cursor-pointer">
                  Begin Quest
                </button>
              </div>

              {/* Press Easing Animation (Framer Motion) */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-[#754728] uppercase">Active Easing</span>
                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  className="cab-button bg-[#FF9B3D] text-white border-2 border-black/10 py-3 text-xs font-bold cursor-pointer"
                >
                  Interactive Press
                </motion.button>
              </div>

              {/* Disabled Button */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-[#754728] uppercase">Disabled</span>
                <button disabled className="cab-button bg-neutral-200 border-2 border-black/5 text-neutral-400 py-3 text-xs font-bold cursor-not-allowed">
                  Locked Action
                </button>
              </div>

            </div>

            {/* Bottom Nav Mockup */}
            <div className="pt-4 border-t border-[#F7DFAE] space-y-3">
              <span className="text-[10px] font-black text-[#754728] uppercase tracking-wider block">Bottom Navigation Selected State Recipe</span>
              <div className="max-w-md mx-auto bg-white border-2 border-black/5 rounded-[30px] p-2 flex justify-between gap-2 shadow-sm">
                {(["home", "explore", "profile"] as const).map((tab) => {
                  const active = selectedNav === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setSelectedNav(tab)}
                      className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-[24px] cursor-pointer transition-all ${
                        active 
                          ? "bg-[#9CC9E7] text-[#356B9A] shadow-inner font-extrabold" 
                          : "text-[#754728] hover:bg-[#FFF9ED]"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
