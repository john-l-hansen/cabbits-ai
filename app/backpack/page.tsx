"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { Item } from "@/types";
import { MainShell } from "@/components/layout/MainShell";

type SortOption = "newest" | "alphabetical";

interface BackpackStateProps {
  activeCategory: "all" | "consumables" | "quest" | "care" | "materials" | "collections";
  setActiveCategory: (cat: "all" | "consumables" | "quest" | "care" | "materials" | "collections") => void;
  sortOption: SortOption;
  setSortOption: (opt: SortOption) => void;
}

function BackpackSidebar({ activeCategory, setActiveCategory, sortOption, setSortOption }: BackpackStateProps) {
  const { companion, items } = useCompanion();

  if (!companion) return null;

  const companionInventory = companion.inventory || [];
  const inventoryItems = companionInventory
    .map((id) => items[id])
    .filter((item): item is Item => !!item);

  const consumables = inventoryItems.filter(item => item.type === "consumable");
  const collectibles = inventoryItems.filter(item => item.type === "collectible");

  return (
    <div className="w-full text-left space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-black">Backpack</h2>
        <p className="text-xxs font-bold text-[var(--neutral-500)]">
          Your stored inventory goods.
        </p>
      </div>

      <hr className="border-[var(--neutral-200)]" />

      {/* Navigation list */}
      <div className="space-y-2">
        <nav className="flex flex-col gap-1">
          {/* All Items */}
          <button
            onClick={() => setActiveCategory("all")}
            className={`w-full flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all chunky-button ${
              activeCategory === "all"
                ? "bg-[var(--neutral-50)] text-[var(--neutral-1000)] border-l-4 border-l-black"
                : "text-[var(--neutral-400)] hover:text-black hover:bg-[var(--neutral-50)]"
            }`}
          >
            <span>All Items</span>
            <span className="bg-[var(--neutral-200)] text-[9px] px-2 py-0.5 rounded-full text-[var(--neutral-500)] font-sans">
              {inventoryItems.length}
            </span>
          </button>

          {/* Consumables */}
          <button
            onClick={() => setActiveCategory("consumables")}
            className={`w-full flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all chunky-button ${
              activeCategory === "consumables"
                ? "bg-[var(--neutral-50)] text-[var(--neutral-1000)] border-l-4 border-l-black"
                : "text-[var(--neutral-400)] hover:text-black hover:bg-[var(--neutral-50)]"
            }`}
          >
            <span>Consumables</span>
            <span className="bg-[var(--neutral-200)] text-[9px] px-2 py-0.5 rounded-full text-[var(--neutral-500)] font-sans">
              {consumables.length}
            </span>
          </button>

          {/* Quest Items */}
          <button
            onClick={() => setActiveCategory("quest")}
            className={`w-full flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all chunky-button ${
              activeCategory === "quest"
                ? "bg-[var(--neutral-50)] text-[var(--neutral-1000)] border-l-4 border-l-black"
                : "text-[var(--neutral-400)] hover:text-black hover:bg-[var(--neutral-50)]"
            }`}
          >
            <span>Quest Items</span>
            <span className="bg-[var(--neutral-200)] text-[9px] px-2 py-0.5 rounded-full text-[var(--neutral-500)] font-sans">
              {collectibles.length}
            </span>
          </button>

          {/* Companion Care */}
          <button
            onClick={() => setActiveCategory("care")}
            className={`w-full flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all chunky-button ${
              activeCategory === "care"
                ? "bg-[var(--neutral-50)] text-[var(--neutral-1000)] border-l-4 border-l-black"
                : "text-[var(--neutral-400)] hover:text-black hover:bg-[var(--neutral-50)]"
            }`}
          >
            <span>Companion Care</span>
            <span className="bg-[var(--neutral-200)] text-[9px] px-2 py-0.5 rounded-full text-[var(--neutral-500)] font-sans">
              {consumables.length}
            </span>
          </button>

          {/* Materials */}
          <button
            onClick={() => setActiveCategory("materials")}
            className={`w-full flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all chunky-button ${
              activeCategory === "materials"
                ? "bg-[var(--neutral-50)] text-[var(--neutral-1000)] border-l-4 border-l-black"
                : "text-[var(--neutral-400)] hover:text-black hover:bg-[var(--neutral-50)]"
            }`}
          >
            <span>Materials</span>
            <span className="bg-[var(--neutral-200)] text-[9px] px-2 py-0.5 rounded-full text-[var(--neutral-500)] font-sans">
              0
            </span>
          </button>

          {/* Collections */}
          <button
            onClick={() => setActiveCategory("collections")}
            className={`w-full flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all chunky-button ${
              activeCategory === "collections"
                ? "bg-[var(--neutral-50)] text-[var(--neutral-1000)] border-l-4 border-l-black"
                : "text-[var(--neutral-400)] hover:text-black hover:bg-[var(--neutral-50)]"
            }`}
          >
            <span>Collections</span>
            <span className="bg-[var(--neutral-200)] text-[9px] px-2 py-0.5 rounded-full text-[var(--neutral-500)] font-sans">
              {collectibles.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom Sort Selector */}
      <div className="pt-4 border-t border-[var(--neutral-200)] space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)] block">
          Sorting options
        </span>
        <button
          onClick={() => setSortOption(sortOption === "newest" ? "alphabetical" : "newest")}
          className="w-full text-left bg-[var(--neutral-50)] px-3 py-2 text-xs font-bold flex items-center justify-between cursor-pointer select-none chunky-button"
        >
          <span>Sort: {sortOption === "newest" ? "Newest" : "Alphabetical"}</span>
          <span>↕️</span>
        </button>
      </div>
    </div>
  );
}

export function BackpackContent({ activeCategory, setActiveCategory, sortOption, setSortOption }: BackpackStateProps) {
  const { companion, isLoading, items, feedCabbit, addCoins } = useCompanion();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Redirect if companion is not created
  useEffect(() => {
    if (!isLoading && !companion) {
      router.replace("/login");
    }
  }, [isLoading, companion, router]);

  if (isLoading || !companion) return null;

  const companionInventory = companion.inventory || [];
  const inventoryItems = companionInventory
    .map((id) => items[id])
    .filter((item): item is Item => !!item);

  const consumables = inventoryItems.filter(item => item.type === "consumable");
  const collectibles = inventoryItems.filter(item => item.type === "collectible");
  
  const getCategoryItems = () => {
    switch (activeCategory) {
      case "consumables":
        return consumables;
      case "quest":
        return collectibles;
      case "care":
        return consumables;
      case "materials":
        return [];
      case "collections":
        return collectibles;
      default:
        return inventoryItems;
    }
  };

  const activeItemsList = getCategoryItems();

  const getFilteredItems = () => {
    let list = [...activeItemsList];
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q)
      );
    }

    if (sortOption === "alphabetical") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return list;
  };

  const filteredItems = getFilteredItems();

  const handleFeedCabbit = async () => {
    if (companion.carrotCoins < 5) {
      alert("Not enough coins! Spend 5 coins to feed Pip.");
      return;
    }
    await feedCabbit();
    alert("Yum! You fed Pip a fresh carrot snack! 🥕");
  };

  return (
    <div className="flex-1 bg-[var(--neutral-50)] p-8 flex gap-6 overflow-y-auto h-full w-full">
      {/* Main Area Content */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        
        {/* Pinned top cards (Coins & Snacks) */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Carrot Coins pinned card */}
          <div className="bg-white chunky-panel p-4 flex items-center justify-between text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-55 border border-[var(--neutral-200)] flex items-center justify-center text-xl">
                🪙
              </div>
              <div>
                <h4 className="text-xs font-black text-black">Carrot Coins</h4>
                <p className="text-[10px] text-[var(--neutral-400)] leading-tight mt-0.5">
                  Earned from reading books
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-black">{companion.carrotCoins}</span>
              <button
                onClick={() => addCoins(5)}
                className="bg-black text-white text-xxs py-1.5 px-3 cursor-pointer chunky-button shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                Collect +5
              </button>
            </div>
          </div>

          {/* Carrot Snacks pinned card */}
          <div className="bg-white chunky-panel p-4 flex items-center justify-between text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-55 border border-[var(--neutral-200)] flex items-center justify-center text-xl">
                🥕
              </div>
              <div>
                <h4 className="text-xs font-black text-black">Carrot Snacks</h4>
                <p className="text-[10px] text-[var(--neutral-400)] leading-tight mt-0.5">
                  Spend 5 coins to feed Pip
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleFeedCabbit}
                className="bg-white text-black text-xxs py-1.5 px-4 cursor-pointer chunky-button shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                Feed ↑
              </button>
            </div>
          </div>

        </div>

        {/* Search Bar */}
        <div className="bg-white border-4 border-black rounded-[4px] px-4 py-2 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xs select-none">🔍</span>
          <input
            type="text"
            placeholder="Search backpack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold bg-transparent outline-none border-none placeholder-[var(--neutral-400)] text-black"
          />
        </div>

        {/* Categorized Grid */}
        <div className="space-y-6 pb-20">
          
          {/* Consumables Section */}
          {(activeCategory === "all" || activeCategory === "consumables" || activeCategory === "care") && (
            <div className="space-y-3 text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)]">
                Consumables
              </span>
              <div className="grid grid-cols-4 gap-4">
                {filteredItems.filter(item => item.type === "consumable").map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-3.5 bg-white border-2 border-black flex flex-col items-center justify-center text-center cursor-pointer transition-all relative chunky-button shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="h-16 w-16 bg-[var(--neutral-50)] border-2 border-black border-dashed rounded-[4px] flex items-center justify-center text-3xl select-none">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-extrabold text-[var(--neutral-700)] mt-2.5 uppercase truncate w-full">
                      {item.name}
                    </span>
                  </button>
                ))}

                {filteredItems.filter(item => item.type === "consumable").length === 0 && (
                  <p className="col-span-4 text-xxs italic text-[var(--neutral-400)]">
                    No consumables found.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Collectibles Section */}
          {(activeCategory === "all" || activeCategory === "quest" || activeCategory === "collections") && (
            <div className="space-y-3 text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)]">
                Collections & Quest Items
              </span>
              <div className="grid grid-cols-4 gap-4">
                {filteredItems.filter(item => item.type === "collectible").map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-3.5 bg-white border-2 border-black flex flex-col items-center justify-center text-center cursor-pointer transition-all relative chunky-button shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="h-16 w-16 bg-[var(--neutral-50)] border-2 border-black border-dashed rounded-[4px] flex items-center justify-center text-3xl select-none">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-extrabold text-[var(--neutral-700)] mt-2.5 uppercase truncate w-full">
                      {item.name}
                    </span>
                  </button>
                ))}

                {filteredItems.filter(item => item.type === "collectible").length === 0 && (
                  <p className="col-span-4 text-xxs italic text-[var(--neutral-400)]">
                    No collectibles or quest items found.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right details panel selection drawer */}
      {selectedItem && (
        <div className="w-64 bg-white border-4 border-black p-5 shrink-0 flex flex-col gap-4 text-left relative animate-fade-in self-start z-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-2.5 right-3 text-xxs font-extrabold text-[var(--neutral-400)] hover:text-black"
          >
            ✕ Hide
          </button>
          <div className="h-20 w-20 bg-[var(--neutral-50)] border-2 border-black border-dashed rounded-[4px] flex items-center justify-center text-4xl select-none mx-auto mt-2">
            {selectedItem.icon}
          </div>

          <div className="space-y-1 text-center">
            <h3 className="text-xs font-black text-black uppercase leading-tight">
              {selectedItem.name}
            </h3>
            <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--neutral-400)]">
              Origin: {selectedItem.locationOrigin}
            </span>
          </div>

          <hr className="border-[var(--neutral-200)]" />

          <div className="space-y-3">
            <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-400)]">
              Item Description
            </span>
            <p className="text-xxs leading-relaxed text-[var(--neutral-600)]">
              {selectedItem.description}
            </p>
          </div>

          <hr className="border-[var(--neutral-200)] mt-auto" />

          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-wider text-[var(--neutral-400)]">
              Properties
            </span>
            <div className="text-[8px] font-bold uppercase tracking-wider text-[var(--neutral-500)] space-y-1">
              <div className="flex justify-between">
                <span>Type</span>
                <span className="text-black font-extrabold">{selectedItem.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-black font-extrabold">Unique</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Global Shell Wrapper
export default function BackpackPage() {
  const [activeCategory, setActiveCategory] = useState<
    "all" | "consumables" | "quest" | "care" | "materials" | "collections"
  >("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  return (
    <MainShell sidebarContent={
      <BackpackSidebar 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        sortOption={sortOption} 
        setSortOption={setSortOption} 
      />
    }>
      <BackpackContent 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        sortOption={sortOption} 
        setSortOption={setSortOption} 
      />
    </MainShell>
  );
}
