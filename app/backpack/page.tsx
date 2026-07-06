"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { Item } from "@/types";
import { useMainShellSidebar } from "@/components/layout/MainShell";
import { motion } from "framer-motion";

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
  const { companion, isLoading, items, addCoins, useInventoryItem } = useCompanion();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [feedbackDialogue, setFeedbackDialogue] = useState<{
    title: string;
    message: string;
    icon: string;
    image?: string;
  } | null>(null);

  // Redirect if companion is not created
  useEffect(() => {
    if (!isLoading && !companion) {
      router.replace("/login");
    }
  }, [isLoading, companion, router]);

  // Close overlays layer by layer on ESC press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (feedbackDialogue) {
          setFeedbackDialogue(null);
          e.stopPropagation();
          e.stopImmediatePropagation();
        } else if (selectedItemId) {
          setSelectedItemId(null);
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }
    };
    // Use capture phase (true) to intercept before global MainShell listener
    window.addEventListener("keydown", handleEsc, true);
    return () => window.removeEventListener("keydown", handleEsc, true);
  }, [feedbackDialogue, selectedItemId]);

  if (isLoading || !companion) return null;

  const getAggregatedItems = () => {
    const allItems = Object.values(items);
    const categoryFiltered = allItems.filter(item => {
      if (activeCategory === "consumables" || activeCategory === "care") {
        return item.type === "consumable";
      }
      if (activeCategory === "quest" || activeCategory === "collections") {
        return item.type === "collectible";
      }
      if (activeCategory === "materials") {
        return false;
      }
      return true;
    });

    const inventoryCounts: Record<string, number> = {};
    companion.inventory.forEach(id => {
      inventoryCounts[id] = (inventoryCounts[id] || 0) + 1;
    });

    let list = categoryFiltered
      .map(item => ({
        ...item,
        count: inventoryCounts[item.id] || 0
      }))
      .filter(item => {
        if (item.type === "collectible") {
          return item.count > 0;
        }
        return true;
      });

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

  const filteredItems = getAggregatedItems();
  const selectedItem = selectedItemId ? items[selectedItemId] : null;
  const selectedItemCount = selectedItemId ? (companion.inventory.filter(id => id === selectedItemId).length) : 0;

  const handleFeedCabbitDirectly = async () => {
    if (companion.inventory.includes("carrot")) {
      await useInventoryItem("carrot");
      setFeedbackDialogue({
        title: "Pip Fed!",
        icon: "🥕",
        message: `Yum! You fed Pip a fresh carrot snack from your backpack. Mood boosted (+10% Curiosity)!`,
      });
    } else {
      if (companion.carrotCoins < 5) {
        setFeedbackDialogue({
          title: "Not Enough Coins",
          icon: "🪙",
          message: "You don't have any carrots in your backpack and need 5 Carrot Coins to purchase one!",
        });
        return;
      }
      await addCoins(-5);
      setFeedbackDialogue({
        title: "Bought Snack",
        icon: "🥕",
        message: "You purchased and fed Pip a fresh carrot snack! Pip looks extremely happy!",
      });
    }
  };

  return (
    <motion.div
      initial={{ filter: "blur(16px)", scale: 0.97 }}
      animate={{ filter: "blur(0px)", scale: 1 }}
      transition={{ type: "spring", stiffness: 85, damping: 16 }}
      className="flex-1 bg-[#6b503c] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] p-8 flex gap-6 overflow-y-auto h-full w-full relative"
    >
      {/* Main Area Content */}
      <div className="flex-1 flex flex-col gap-6 min-w-0 z-10">
        


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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.filter(item => item.type === "consumable").map((item) => {
                  const isDepleted = item.count === 0;
                  const isSelected = selectedItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`p-6 bg-[#fffbf6] border-[3.5px] border-[#ecdacb] flex flex-col justify-between text-left cursor-pointer transition-all relative rounded-[32px] shadow-[0_6px_16px_rgba(218,197,180,0.25)] hover:-translate-y-1 hover:rotate-1 hover:shadow-[0_12px_24px_rgba(218,197,180,0.35)] active:scale-95 active:rotate-0 duration-150 w-full min-h-[300px] ${
                        isSelected ? "ring-4 ring-[#4a2e1b]/30 border-[#4a2e1b]" : ""
                      } ${isDepleted ? "filter grayscale opacity-60" : ""}`}
                    >
                      {/* Top Object + Quantity Row */}
                      <div className="flex items-center justify-between w-full">
                        <div className="w-24 h-24 flex items-center justify-center">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-contain" 
                            />
                          ) : (
                            <span className="text-5xl select-none">{item.icon}</span>
                          )}
                        </div>
                        <div className="text-2xl font-fredoka font-black text-[#4a2e1b] pr-2">
                          ×{item.count}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mt-4 w-full flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-fredoka font-black text-[#4a2e1b] leading-tight uppercase tracking-wide">
                            {item.name}
                          </h3>
                          <p className="text-[10px] leading-relaxed text-[#6b584c] mt-2 font-medium line-clamp-3">
                            {item.description}
                          </p>
                        </div>
                        
                        {/* Chunky friendly button at the bottom */}
                        <div className="bg-white border-2 border-black rounded-2xl h-11 w-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-fredoka font-black text-xs text-[#4a2e1b] gap-2 mt-4 hover:bg-neutral-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <span>Open Info</span>
                          <span>{item.icon}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.filter(item => item.type === "collectible").map((item) => {
                  const isSelected = selectedItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`p-6 bg-[#fffbf6] border-[3.5px] border-[#ecdacb] flex flex-col justify-between text-left cursor-pointer transition-all relative rounded-[32px] shadow-[0_6px_16px_rgba(218,197,180,0.25)] hover:-translate-y-1 hover:rotate-1 hover:shadow-[0_12px_24px_rgba(218,197,180,0.35)] active:scale-95 active:rotate-0 duration-150 w-full min-h-[300px] ${
                        isSelected ? "ring-4 ring-[#4a2e1b]/30 border-[#4a2e1b]" : ""
                      }`}
                    >
                      {/* Top Object + Quantity Row */}
                      <div className="flex items-center justify-between w-full">
                        <div className="w-24 h-24 flex items-center justify-center">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-contain" 
                            />
                          ) : (
                            <span className="text-5xl select-none">{item.icon}</span>
                          )}
                        </div>
                        <div className="text-2xl font-fredoka font-black text-[#4a2e1b] pr-2">
                          ×{item.count}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mt-4 w-full flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-fredoka font-black text-[#4a2e1b] leading-tight uppercase tracking-wide">
                            {item.name}
                          </h3>
                          <p className="text-[10px] leading-relaxed text-[#6b584c] mt-2 font-medium line-clamp-3">
                            {item.description}
                          </p>
                        </div>
                        
                        {/* Chunky friendly button at the bottom */}
                        <div className="bg-white border-2 border-black rounded-2xl h-11 w-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-fredoka font-black text-xs text-[#4a2e1b] gap-2 mt-4 hover:bg-neutral-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <span>Open Info</span>
                          <span>{item.icon}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}

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

      {/* Overlay Selection Modal replacing the right details sidebar drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-6 select-none animate-fade-in">
          <div className="w-96 bg-[#fffbf6] border-[4px] border-[#ecdacb] p-7 flex flex-col justify-between text-left relative rounded-[32px] shadow-[0_12px_36px_rgba(74,46,27,0.25)] min-h-[420px] animate-scale-up">
            
            {/* Top Hide button */}
            <button
              onClick={() => setSelectedItemId(null)}
              className="absolute top-5 right-5 text-[10px] font-fredoka font-black uppercase text-[#a89688] hover:text-[#4a2e1b] cursor-pointer"
            >
              ✕ Hide
            </button>
            
            {/* Top Object + Quantity Row */}
            <div className="flex items-center justify-between mt-4">
              <div className="w-36 h-36 flex items-center justify-center">
                {selectedItem.image ? (
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name} 
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <span className="text-7xl select-none">{selectedItem.icon}</span>
                )}
              </div>
              
              <div className="text-4xl font-fredoka font-black text-[#4a2e1b] pr-6">
                ×{selectedItemCount}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-fredoka font-black text-[#4a2e1b] mt-6 leading-none uppercase tracking-wide">
              {selectedItem.name}
            </h3>

            {/* Description */}
            <p className="text-xs leading-relaxed text-[#6b584c] mt-3 font-medium">
              {selectedItem.description}
            </p>

            {/* Action buttons inside the modal */}
            <div className="mt-6">
              {selectedItem.type === "consumable" ? (
                selectedItemCount > 0 ? (
                  <button
                    onClick={async () => {
                      await useInventoryItem(selectedItem.id);
                      setFeedbackDialogue({
                        title: "Feed Companion",
                        icon: selectedItem.icon,
                        image: selectedItem.image,
                        message: `Yum! You fed Pip a fresh ${selectedItem.name} from the backpack. Curiosity boosted (+10%)!`,
                      });
                    }}
                    className="w-full py-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer chunky-button bg-[#4a2e1b] hover:bg-[#5c3e2b] text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl"
                  >
                    Feed Pip 🥕
                  </button>
                ) : (
                  <div className="w-full bg-[#f5efe6] border-2 border-[#ecdacb] border-dashed py-4 text-center font-black text-[#8a7566] text-xs rounded-2xl select-none uppercase">
                    Depleted ❌
                  </div>
                )
              ) : (
                <button
                  onClick={() => {
                    setFeedbackDialogue({
                      title: "Examine Item",
                      icon: selectedItem.icon,
                      image: selectedItem.image,
                      message: `You closely inspect the ${selectedItem.name}. From ${selectedItem.locationOrigin}, this collectible holds mathematical or logic insights waiting to be discovered.`,
                    });
                  }}
                  className="w-full py-4 text-[#4a2e1b] text-xs font-black uppercase tracking-wider transition-all cursor-pointer chunky-button bg-white hover:bg-neutral-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl"
                >
                  Examine Item 🔍
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Feedback Dialogue Modal (Construction Paper Cut-out Style) */}
      {feedbackDialogue && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6 select-none">
          <div className="w-full max-w-sm border-4 border-black bg-[#fefdf9] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none space-y-4 text-center transform rotate-1 animate-scale-up relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 border-2 border-black px-3.5 py-1.5 font-fredoka font-black text-[9px] uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
              {feedbackDialogue.title}
            </div>
            
            {feedbackDialogue.image ? (
              <img 
                src={feedbackDialogue.image} 
                alt={feedbackDialogue.title} 
                className="w-16 h-16 object-contain mx-auto mt-4 animate-bounce" 
              />
            ) : (
              <div className="h-16 w-16 rounded-full border-2 border-black bg-white flex items-center justify-center text-3xl mx-auto shadow-sm mt-4 animate-bounce">
                {feedbackDialogue.icon}
              </div>
            )}
            
            <p className="text-[10px] font-bold text-[var(--neutral-800)] leading-relaxed p-2 italic">
              {feedbackDialogue.message}
            </p>

            <button
              onClick={() => setFeedbackDialogue(null)}
              className="w-full bg-black hover:bg-neutral-900 text-white text-xxs py-3.5 uppercase tracking-wider font-black chunky-button cursor-pointer"
            >
              Close →
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Global Shell Wrapper
export default function BackpackPage() {
  const [activeCategory, setActiveCategory] = useState<
    "all" | "consumables" | "quest" | "care" | "materials" | "collections"
  >("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const { setSidebarContent } = useMainShellSidebar();

  useEffect(() => {
    setSidebarContent(
      <BackpackSidebar 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        sortOption={sortOption} 
        setSortOption={setSortOption} 
      />
    );
    return () => setSidebarContent(null);
  }, [activeCategory, sortOption, setSidebarContent]);

  return (
    <BackpackContent 
      activeCategory={activeCategory} 
      setActiveCategory={setActiveCategory} 
      sortOption={sortOption} 
      setSortOption={setSortOption} 
    />
  );
}
