"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { Book } from "@/types";
import { MainShell } from "@/components/layout/MainShell";

type ReadingState = {
  book: Book;
  currentPage: number;
};

// Simulated book page contents
const BOOK_PAGES: Record<string, { text: string; companionComment: string }[]> = {
  missing_acorns: [
    {
      text: "Once upon a time in the heart of Oak Forest, Moss the Squirrel woke up from a long nap. He rubbed his eyes and checked his tree hollow. Oh no! His favorite winter acorns were gone!",
      companionComment: "“Oh dear, losing acorns is very sad. Moss must be hungry. Let's help him look under the trees!”",
    },
    {
      text: "Pip the Cabbit saw Moss crying. 'Don't worry, Moss! Let's search the forest floor together. Look under those red maple leaves!' Pip pointed his paw toward the roots.",
      companionComment: "“Look! I'm pointing at the red leaves! Tapping them might reveal a clue. What do you see?”",
    },
    {
      text: "Under the golden leaves, they found a trail of shiny brown caps. A friendly blue jay chirped from above, 'Follow the trail to the hollow oak tree! The forest wind blew them there.'",
      companionComment: "“Hooray! The jay is helping us. We're following the trail together!”",
    },
    {
      text: "At the base of the hollow oak, they found a tidy pile of acorns! Moss squealed with joy and hugged Pip. They sat together under the warm sun, sharing a delicious snack.",
      companionComment: "“We did it! You read the clues and helped Moss. That was such a cozy adventure!”",
    },
  ],
  curious_numbers: [
    {
      text: "Welcome to Rabbit Valley, where numbers grow on vines! Pip walks into the carrot patch. 'Let's count the orange carrots,' he says. One, two, three...",
      companionComment: "“Counting is fun! I see the carrots glowing on the vines. Let's count them together.”",
    },
    {
      text: "Suddenly, a giant carrot appears! It takes three normal carrots to balance the scale. Pip places two carrots on the left. How many more do we need on the right?",
      companionComment: "“Simple math is like balancing a playground swing. Let's think: 2 plus what equals 3?”",
    },
    {
      text: "You add one carrot, and the scale balances perfectly! The number vine glows bright blue, unlocking a secret pathway through the valley gates.",
      companionComment: "“Wow, you balanced it! Simple math is like magic once you see the patterns.”",
    },
  ],
  bunny_bridge: [
    {
      text: "A rushing river blocks the path to the clover fields. The bridge has fallen! Pip inspects the wooden logs scattered along the riverbank.",
      companionComment: "“Oh no, the water is moving very fast. We need to be careful and construct a strong bridge!”",
    },
    {
      text: "To build the bridge, we must place the logs first, then tie them with strong vines, and finally place heavy rocks on the ends to secure them.",
      companionComment: "“Sequencing is key. First the logs, second the vines, third the rocks. Let's follow the steps!”",
    },
    {
      text: "You place the logs, tie the ropes, and secure the anchor stones. Click! The bridge is steady. The local bunnies cheer and hop across safely.",
      companionComment: "“Hooray! They are crossing! Our logical planning helped build a safe bridge!”",
    },
  ],
  treasure_map: [
    {
      text: "Captain Rabbiton buried a golden pocket watch somewhere on Sandy Shore. Pip rolls out an ancient parchment map. 'The path starts at the tall palm tree,' he reads.",
      companionComment: "“Look at the coordinates! The map has letters and numbers. Let's locate the tall tree first.”",
    },
    {
      text: "The clues say: 'Take three paces North, then two paces East.' Pip counts the paces in the sand. He stands directly under a wooden treasure chest marker.",
      companionComment: "“We are pacing it out! I can feel the warm ocean breeze. We are getting very close.”",
    },
    {
      text: "Under a pile of seashells, you dig and find the golden watch! It ticks softly. Pip smiles, happy to return the historical artifact to the valley museum.",
      companionComment: "“A real discovery! Navigating with coordinates is a great superpower. You did awesome!”",
    },
  ],
};

const BOOK_TEASERS: Record<string, string[]> = {
  missing_acorns: [
    "Meet the Cabbit and the Wise Owl",
    "Explore the ancient Oak Forest",
    "Solve the mystery of the missing acorns"
  ],
  curious_numbers: [
    "Visit the glowing carrot patch",
    "Count the harvest on number vines",
    "Solve the balanced carrot scale puzzle"
  ],
  bunny_bridge: [
    "Encounter the spring flooded creek",
    "Sequence logs, vines, and stones",
    "Help the bunny families cross safely"
  ],
  treasure_map: [
    "Decipher coordinate maps on Sandy Shore",
    "Measure pacing North and East",
    "Recover Captain Rabbiton's lost treasure"
  ]
};

const BOOK_CHARACTERS: Record<string, { name: string; emoji: string }[]> = {
  missing_acorns: [
    { name: "Cabbit", emoji: "🐰" },
    { name: "Wise Owl", emoji: "🦉" },
    { name: "Mouse", emoji: "🐭" }
  ],
  curious_numbers: [
    { name: "Cabbit", emoji: "🐰" },
    { name: "Wise Owl", emoji: "🦉" },
    { name: "Farmer Bunny", emoji: "🥕" }
  ],
  bunny_bridge: [
    { name: "Cabbit", emoji: "🐰" },
    { name: "Beaver Engineer", emoji: "🪵" },
    { name: "Tiny Bunnies", emoji: "🐇" }
  ],
  treasure_map: [
    { name: "Cabbit", emoji: "🐰" },
    { name: "Seagull Captain", emoji: "⚓" },
    { name: "Pirate Crab", emoji: "🦀" }
  ]
};

const BOOK_REWARDS: Record<string, { xp: string; badge: string; item: string }> = {
  missing_acorns: { xp: "+120 XP", badge: "Story Badge", item: "+1 Acorn" },
  curious_numbers: { xp: "+140 XP", badge: "Math Badge", item: "+1 Carrot" },
  bunny_bridge: { xp: "+160 XP", badge: "Logic Badge", item: "+1 Rope" },
  treasure_map: { xp: "+180 XP", badge: "Explorer Badge", item: "+1 Pocket Watch" }
};

const BOOK_LEARNING: Record<string, string[]> = {
  missing_acorns: [
    "Helping friends who lose their treasures",
    "Observing clues beneath forest leaves",
    "Sharing snacks under the sun"
  ],
  curious_numbers: [
    "Counting harvest on glowing vines",
    "Balancing additions on scale playgrounds",
    "Finding simple math pattern pathways"
  ],
  bunny_bridge: [
    "Ordering construction sequences",
    "Anchoring logs with weight stones",
    "Collaborative planning for public safety"
  ],
  treasure_map: [
    "Locating reference palm trees",
    "Walking letters/numbers coordinate directions",
    "Preserving historical artifacts for museums"
  ]
};

const BOOK_QUOTES: Record<string, string> = {
  missing_acorns: "“We did it! Reading is like following a map to a happy ending.”",
  curious_numbers: "“Simple arithmetic is super fun when we count carrots together!”",
  bunny_bridge: "“Step-by-step logic can solve any obstacle, even a rushing river!”",
  treasure_map: "“Map directions are secret messages from the past. You read them perfectly!”"
};

const BOOK_VOCABULARY: Record<string, { word: string; type: string; def: string }[][]> = {
  missing_acorns: [
    [
      { word: "Hollow", type: "noun", def: "A cavity or space in a tree trunk." },
      { word: "Oak", type: "noun", def: "A type of large tree known for acorns." }
    ],
    [
      { word: "Cabbit", type: "noun", def: "A mythical creature half-cat, half-rabbit." },
      { word: "Reveal", type: "verb", def: "To show or make something visible." }
    ],
    [
      { word: "Trail", type: "noun", def: "A path or track left by something." },
      { word: "Breeze", type: "noun", def: "A gentle, light wind." }
    ],
    [
      { word: "Base", type: "noun", def: "The lowest part or bottom of something." },
      { word: "Acorn", type: "noun", def: "The small nut of an oak tree." }
    ]
  ],
  curious_numbers: [
    [
      { word: "Patch", type: "noun", def: "A small plot of ground." },
      { word: "Vine", type: "noun", def: "A climbing woody stem plant." }
    ],
    [
      { word: "Balance", type: "verb", def: "To keep in steady equilibrium." },
      { word: "Scale", type: "noun", def: "A device for weighing objects." }
    ],
    [
      { word: "Pathway", type: "noun", def: "A route or lane for walking." },
      { word: "Unlock", type: "verb", def: "To release or make accessible." }
    ]
  ],
  bunny_bridge: [
    [
      { word: "Riverbank", type: "noun", def: "The slope bordering a river." },
      { word: "Rushing", type: "adj", def: "Moving rapidly or with force." }
    ],
    [
      { word: "Sequence", type: "noun", def: "A particular order of events." },
      { word: "Anchor", type: "verb", def: "To secure firmly in place." }
    ],
    [
      { word: "Steady", type: "adj", def: "Firmly fixed, not shaking." },
      { word: "Secured", type: "adj", def: "Fixed or held safe in place." }
    ]
  ],
  treasure_map: [
    [
      { word: "Parchment", type: "noun", def: "Stiff paper used for maps." },
      { word: "Artifact", type: "noun", def: "An object of historical interest." }
    ],
    [
      { word: "Pace", type: "noun", def: "A single step taken in walking." },
      { word: "North", type: "noun", def: "A compass direction pointing top." }
    ],
    [
      { word: "Seashell", type: "noun", def: "The hard shell of marine mollusks." },
      { word: "Museum", type: "noun", def: "A building storing historic works." }
    ]
  ]
};

const defaultTeasers = [
  "Read together with your companion",
  "Reflect on interesting ideas",
  "Unlock new landmarks on the map"
];
const defaultCharacters = [
  { name: "Cabbit", emoji: "🐰" },
  { name: "Pip", emoji: "✨" }
];
const defaultRewards = { xp: "+100 XP", badge: "Curious Badge", item: "+1 Clover" };
const defaultLearning = [
  "Practicing vocabulary words",
  "Reflecting on active learning topics",
  "Expanding companion horizons"
];
const defaultQuote = "“What a wonderful story! I love learning new things with you.”";

interface BookshelfStateProps {
  selectedBook: Book | null;
  setSelectedBook: (b: Book | null) => void;
  activeReading: ReadingState | null;
  setActiveReading: (r: ReadingState | null) => void;
  activeCategory: "all" | "stories" | "guides" | "poetry" | "puzzles";
  setActiveCategory: (cat: "all" | "stories" | "guides" | "poetry" | "puzzles") => void;
}

function BookshelfSidebar({
  selectedBook,
  setSelectedBook,
  activeReading,
  setActiveReading,
  activeCategory,
  setActiveCategory,
}: BookshelfStateProps) {
  const { companion, books } = useCompanion();

  if (!companion) return null;

  const completedBooksCount = books.filter(b => b.progress === 100).length;

  if (activeReading) {
    // FLOW STATE 1: ACTIVE READING SIDEBAR
    const bookPages = BOOK_PAGES[activeReading.book.id] || [{ text: "" }];
    return (
      <div className="w-full text-left space-y-6 animate-fade-in">
        <button
          onClick={() => {
            setActiveReading(null);
            setSelectedBook(activeReading.book);
          }}
          className="text-[10px] font-extrabold text-[var(--neutral-500)] hover:text-black flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none text-left uppercase"
        >
          ← Back Intro
        </button>

        <div className="space-y-1">
          <span className="text-xxs font-extrabold uppercase tracking-widest text-[var(--neutral-400)] block">
            Reading Story
          </span>
          <h3 className="text-md font-bold text-[var(--neutral-900)] leading-snug">
            {activeReading.book.title}
          </h3>
        </div>

        <hr className="border-[var(--neutral-200)]" />

        {/* Page Vertical List Selector */}
        <div className="space-y-2">
          <span className="text-xxs font-extrabold uppercase tracking-widest text-[var(--neutral-500)] block">
            Chapter Pages
          </span>
          <nav className="flex flex-col gap-1">
            {bookPages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReading({ ...activeReading, currentPage: idx })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-left cursor-pointer transition-all ${
                  activeReading.currentPage === idx
                    ? "bg-[var(--neutral-50)] text-[var(--neutral-1000)] border-l-4 border-l-black"
                    : "text-[var(--neutral-400)] hover:text-black hover:bg-[var(--neutral-50)]"
                }`}
              >
                <span>Page {idx + 1}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Cabbit feedback bubble sticky */}
        <div className="border border-[var(--neutral-300)] p-3.5 rounded-2xl bg-[var(--neutral-50)] space-y-2.5 text-left">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full border-2 border-black bg-white flex items-center justify-center text-xs">
              🐰
            </div>
            <div>
              <h6 className="text-[10px] font-black text-black leading-none">{companion.name}</h6>
              <span className="text-[8px] font-bold text-[var(--neutral-400)] uppercase">Listening...</span>
            </div>
          </div>
          <p className="text-[10px] leading-relaxed font-semibold text-[var(--neutral-700)] italic">
            {BOOK_PAGES[activeReading.book.id]?.[activeReading.currentPage]?.companionComment || "“Wow, let's keep reading together!”"}
          </p>
        </div>
      </div>
    );
  }

  if (selectedBook) {
    // FLOW STATE 2: BOOK DETAILS INTRO SIDEBAR
    return (
      <div className="w-full text-left space-y-6 animate-fade-in">
        <button
          onClick={() => setSelectedBook(null)}
          className="text-[10px] font-extrabold text-[var(--neutral-500)] hover:text-black cursor-pointer bg-transparent border-none outline-none text-left uppercase"
        >
          ← Bookshelf
        </button>

        <div className="space-y-1">
          <span className="text-xxs font-extrabold uppercase tracking-widest text-[var(--neutral-400)] block">
            Stories
          </span>
          <h2 className="text-xl font-black text-black leading-tight">
            {selectedBook.title}
          </h2>
        </div>

        <hr className="border-[var(--neutral-200)]" />

        {/* Metadata Chips */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-full px-2.5 py-1 text-[11px] font-bold text-[var(--neutral-500)] font-sans">
            {(BOOK_PAGES[selectedBook.id] || []).length} Pages
          </span>
          <span className="bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-full px-2.5 py-1 text-[11px] font-bold text-[var(--neutral-500)] font-sans">
            ~{selectedBook.readingTime}
          </span>
          <span className="bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-full px-2.5 py-1 text-[11px] font-bold text-[var(--neutral-500)] font-sans">
            Level {selectedBook.ageRange.startsWith("4") ? "1" : "2"}
          </span>
        </div>

        <hr className="border-[var(--neutral-200)]" />

        {/* Teasers checklist */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)]">
            In This Story
          </span>
          <div className="space-y-3">
            {(BOOK_TEASERS[selectedBook.id] || defaultTeasers).map((teaser, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="text-xxs mt-1 text-[var(--neutral-400)]">○</span>
                <p className="text-[11px] leading-relaxed text-[var(--neutral-500)]">
                  {teaser}
                </p>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-[var(--neutral-200)]" />

        {/* Characters */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)]">
            Characters
          </span>
          <div className="flex gap-4">
            {(BOOK_CHARACTERS[selectedBook.id] || defaultCharacters).map((char, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
                <div className="h-10 w-10 rounded-full border border-[var(--neutral-200)] bg-[var(--neutral-50)] flex items-center justify-center text-lg select-none">
                  {char.emoji}
                </div>
                <span className="text-[9px] font-bold uppercase text-[var(--neutral-400)]">{char.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // FLOW STATE 3: BOOKSHELF DIRECTORY BROWSER SIDEBAR
  return (
    <div className="w-full text-left space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-black">Bookshelf</h2>
        <p className="text-xxs font-bold text-[var(--neutral-500)]">
          Choose a book adventure.
        </p>
      </div>

      <hr className="border-[var(--neutral-200)]" />

      {/* Categories */}
      <div className="space-y-2">
        <span className="text-xxs font-extrabold uppercase tracking-widest text-[var(--neutral-400)] block">
          Categories
        </span>
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`w-full flex items-center justify-between p-3 cursor-pointer transition-all chunky-button ${
              activeCategory === "all" ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]" : ""
            }`}
          >
            <span>All Books</span>
            <span className="bg-[var(--neutral-200)] text-[9px] px-2 py-0.5 rounded-full text-[var(--neutral-500)] font-sans">
              {books.length}
            </span>
          </button>
          <button
            onClick={() => setActiveCategory("stories")}
            className={`w-full flex items-center justify-between p-3 cursor-pointer transition-all chunky-button ${
              activeCategory === "stories" ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]" : ""
            }`}
          >
            <span>Stories</span>
            <span className="bg-[var(--neutral-200)] text-[9px] px-2 py-0.5 rounded-full text-[var(--neutral-500)] font-sans">
              {books.filter(b => b.category === "stories").length}
            </span>
          </button>
          <button
            onClick={() => setActiveCategory("guides")}
            className={`w-full flex items-center justify-between p-3 cursor-pointer transition-all chunky-button ${
              activeCategory === "guides" ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]" : ""
            }`}
          >
            <span>Field Guides</span>
            <span className="bg-[var(--neutral-200)] text-[9px] px-2 py-0.5 rounded-full text-[var(--neutral-500)] font-sans">
              {books.filter(b => b.category === "logic" || b.category === "science").length}
            </span>
          </button>
          <button
            onClick={() => setActiveCategory("poetry")}
            className={`w-full flex items-center justify-between p-3 cursor-pointer transition-all chunky-button ${
              activeCategory === "poetry" ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]" : ""
            }`}
          >
            <span>Poetry</span>
            <span className="bg-[var(--neutral-200)] text-[9px] px-2 py-0.5 rounded-full text-[var(--neutral-500)] font-sans">
              {books.filter(b => b.category === "language").length}
            </span>
          </button>
          <button
            onClick={() => setActiveCategory("puzzles")}
            className={`w-full flex items-center justify-between p-3 cursor-pointer transition-all chunky-button ${
              activeCategory === "puzzles" ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]" : ""
            }`}
          >
            <span>Puzzles</span>
            <span className="bg-[var(--neutral-200)] text-[9px] px-2 py-0.5 rounded-full text-[var(--neutral-500)] font-sans">
              {books.filter(b => b.category === "math" || b.category === "creativity").length}
            </span>
          </button>
        </nav>
      </div>

      <hr className="border-[var(--neutral-200)]" />

      {/* Progress panel */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)]">
          My Reading
        </span>
        <div className="bg-[var(--neutral-50)] chunky-panel p-3 space-y-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[10px] font-black text-black leading-none">
            {completedBooksCount} of {books.length} Completed
          </span>
          <div className="h-1.5 w-full bg-[var(--neutral-200)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--neutral-1000)] rounded-full transition-all"
              style={{ width: `${(completedBooksCount / books.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookshelfContent({
  selectedBook,
  setSelectedBook,
  activeReading,
  setActiveReading,
  activeCategory,
  setActiveCategory,
}: BookshelfStateProps) {
  const { companion, isLoading, books, toggleFavoriteBook, updateBookProgress, addCoins } = useCompanion();
  const router = useRouter();

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLevel, setActiveLevel] = useState<"all" | "1" | "2">("all");
  const [completedBook, setCompletedBook] = useState<Book | null>(null);

  // Redirect if companion is not created
  useEffect(() => {
    if (!isLoading && !companion) {
      router.replace("/login");
    }
  }, [isLoading, companion, router]);

  if (isLoading || !companion) return null;

  // Handle Reading progress increment
  const handleNextPage = async () => {
    if (!activeReading) return;

    const bookPages = BOOK_PAGES[activeReading.book.id] || [
      { text: "This is a placeholder page because no pages were loaded.", companionComment: "Interesting!" }
    ];
    const nextPage = activeReading.currentPage + 1;

    if (nextPage < bookPages.length) {
      setActiveReading({ ...activeReading, currentPage: nextPage });
      
      const progressPercent = Math.round((nextPage / bookPages.length) * 100);
      await updateBookProgress(activeReading.book.id, progressPercent);
    } else {
      // Completed reading
      await updateBookProgress(activeReading.book.id, 100);
      await addCoins(15); // Earn 15 coins for reading a book

      setCompletedBook(activeReading.book);
      setActiveReading(null);
      setSelectedBook(null);
    }
  };

  const handlePrevPage = () => {
    if (!activeReading || activeReading.currentPage === 0) return;
    setActiveReading({ ...activeReading, currentPage: activeReading.currentPage - 1 });
  };

  // Filter book items
  const getFilteredBooks = () => {
    return books.filter((b) => {
      // Category matches
      if (activeCategory === "stories" && b.category !== "stories") return false;
      if (activeCategory === "guides" && b.category !== "logic" && b.category !== "science") return false;
      if (activeCategory === "poetry" && b.category !== "language") return false;
      if (activeCategory === "puzzles" && b.category !== "math" && b.category !== "creativity") return false;

      // Level check
      if (activeLevel === "1" && !b.ageRange.startsWith("4") && !b.ageRange.startsWith("5")) return false;
      if (activeLevel === "2" && !b.ageRange.startsWith("6") && !b.ageRange.startsWith("7")) return false;

      // Query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return b.title.toLowerCase().includes(q) || b.skills.some(s => s.toLowerCase().includes(q));
      }

      return true;
    });
  };

  const filteredBooks = getFilteredBooks();

  return (
    <>
    <div className="flex-1 flex overflow-hidden relative w-full h-full bg-[var(--neutral-0)] animate-scale-up">
      {/* FLOW STATE 1: ACTIVE READING PAGE */}
      {activeReading ? (
        <div className="flex-1 bg-[var(--neutral-50)] p-8 flex gap-6 overflow-hidden relative">
          
          {/* Text column card */}
          <div className="flex-1 flex flex-col justify-between bg-[var(--neutral-0)] border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-y-auto">
            
            {/* Reading Card Header */}
            <div className="flex justify-between items-center pb-4 border-b border-[var(--neutral-200)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--neutral-100)] border border-dashed border-[var(--neutral-300)] flex items-center justify-center text-lg select-none">
                  {activeReading.book.coverEmoji}
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-black uppercase leading-tight">{activeReading.book.title}</h4>
                  <span className="text-[9px] font-bold text-[var(--neutral-400)] uppercase tracking-wide">
                    Category: {activeReading.book.category}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[var(--neutral-500)]">
                Page {activeReading.currentPage + 1} of {(BOOK_PAGES[activeReading.book.id] || []).length}
              </span>
            </div>

            {/* Story sentence block */}
            <div className="my-8 space-y-4">
              <p className="text-base text-[var(--neutral-900)] leading-relaxed font-serif text-left">
                {BOOK_PAGES[activeReading.book.id]?.[activeReading.currentPage]?.text || "No pages available."}
              </p>
            </div>

            {/* Navigation footer buttons */}
            <div className="flex justify-between items-center border-t border-[var(--neutral-200)] pt-4 mt-auto">
              <button
                onClick={handlePrevPage}
                disabled={activeReading.currentPage === 0}
                className="px-5 py-2.5 text-xs text-black cursor-pointer chunky-button"
              >
                ← Previous Page
              </button>
              <button
                onClick={handleNextPage}
                className="px-7 py-2.5 text-xs text-white bg-black hover:bg-neutral-900 cursor-pointer chunky-button shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                {activeReading.currentPage === (BOOK_PAGES[activeReading.book.id] || []).length - 1 ? "Finish Story 🎉" : "Next Page →"}
              </button>
            </div>

          </div>

          {/* Right Companion illustrations & Vocab panel */}
          <div className="w-64 flex flex-col gap-6 shrink-0">
            
            {/* Scene Illustration Card */}
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)]">Scene</span>
              <div className="h-56 bg-white chunky-panel border-dashed border-black/45 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 select-none">
                <span className="text-4xl animate-bounce">
                  {activeReading.book.id === "missing_acorns" ? "🐿️" : activeReading.book.id === "curious_numbers" ? "🧮" : activeReading.book.id === "bunny_bridge" ? "🌉" : "🗺️"}
                </span>
                <p className="text-xxs font-bold text-[var(--neutral-400)] uppercase mt-2">Scene Illustration</p>
                <p className="text-[9px] text-[var(--neutral-500)] leading-normal mt-1 max-w-[12rem] italic">
                  {activeReading.book.title} (Page {activeReading.currentPage + 1})
                </p>
              </div>
            </div>

            {/* Vocabulary card */}
            <div className="flex-1 flex flex-col min-h-0 space-y-2 text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)]">Vocabulary</span>
              <div className="flex-1 bg-white chunky-panel p-4 overflow-y-auto space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {BOOK_VOCABULARY[activeReading.book.id]?.[activeReading.currentPage] ? (
                  BOOK_VOCABULARY[activeReading.book.id][activeReading.currentPage].map((item, i) => (
                    <div key={i} className="p-2.5 bg-[var(--neutral-50)] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none">
                      <span className="text-xs font-black text-black">
                        {item.word}{" "}
                        <span className="text-[9px] font-bold text-[var(--neutral-400)] italic font-sans">
                          / {item.type}
                        </span>
                      </span>
                      <p className="text-[10px] text-[var(--neutral-500)] mt-1.5 leading-normal">
                        {item.def}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-[var(--neutral-400)] italic">
                    No vocabulary words featured on this page.
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      ) : selectedBook ? (
        
        /* FLOW STATE 2: BOOK DETAILS INTRO PAGE */
        <div className="flex-1 bg-[var(--neutral-0)] p-8 flex flex-col items-center justify-center overflow-y-auto">
          <div className="flex flex-col gap-[32px] items-center justify-center max-w-[600px] text-center w-full animate-fade-in">
            
            {/* Large blueprint book cover */}
            <div className="bg-[var(--neutral-50)] chunky-panel border-dashed border-black/45 flex flex-col gap-3 items-center justify-center w-[400px] h-[460px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative select-none">
              <div className="w-16 h-16 rounded-full border border-dashed border-[var(--neutral-400)] flex items-center justify-center text-4xl">
                {selectedBook.coverEmoji}
              </div>
              <span className="text-xs font-semibold text-[var(--neutral-500)] tracking-wider">
                Story Cover
              </span>
            </div>

            {/* Title & description */}
            <div className="space-y-2 text-center w-full">
              <h2 className="font-['Nunito:Bold'] font-bold text-[28px] text-[var(--neutral-900)] leading-tight">
                {selectedBook.title}
              </h2>
              <p className="font-sans text-[16px] text-[var(--neutral-500)] leading-relaxed">
                {selectedBook.description}
              </p>
            </div>

            {/* Canvas Action buttons */}
            <div className="flex flex-col gap-3 items-center w-full">
              <button
                onClick={() => setActiveReading({ book: selectedBook, currentPage: 0 })}
                className="bg-black text-white h-[56px] px-12 chunky-button shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1"
              >
                Begin Reading →
              </button>
              <button
                onClick={() => toggleFavoriteBook(selectedBook.id)}
                className="text-xs font-semibold text-[var(--neutral-500)] hover:text-black cursor-pointer select-none"
              >
                {selectedBook.isFavorite ? "★ In Reading List" : "☆ Add to Reading List"}
              </button>
            </div>

          </div>
        </div>
      ) : (
        
        /* FLOW STATE 3: BOOKSHELF DIRECTORY BROWSER */
        <div className="flex-1 bg-[var(--neutral-50)] p-8 flex flex-col gap-6 overflow-y-auto">
          
          {/* Search Bar & Filters */}
          <div className="flex gap-4 items-center justify-between">
            <div className="flex-1 bg-white border border-[var(--neutral-300)] rounded-full px-4 py-2 flex items-center gap-2 max-w-md">
              <span className="text-xs select-none">🔍</span>
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold bg-transparent outline-none border-none placeholder-[var(--neutral-400)] text-black"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveLevel("all")}
                className={`px-3 py-1.5 rounded-full border text-xxs font-black cursor-pointer transition-all ${
                  activeLevel === "all"
                    ? "bg-[var(--neutral-1000)] text-white border-black"
                    : "bg-white border-[var(--neutral-300)] text-[var(--neutral-500)] hover:border-black"
                }`}
              >
                All Levels
              </button>
              <button
                onClick={() => setActiveLevel("1")}
                className={`px-3 py-1.5 rounded-full border text-xxs font-black cursor-pointer transition-all ${
                  activeLevel === "1"
                    ? "bg-[var(--neutral-1000)] text-white border-black"
                    : "bg-white border-[var(--neutral-300)] text-[var(--neutral-500)] hover:border-black"
                }`}
              >
                Level 1
              </button>
              <button
                onClick={() => setActiveLevel("2")}
                className={`px-3 py-1.5 rounded-full border text-xxs font-black cursor-pointer transition-all ${
                  activeLevel === "2"
                    ? "bg-[var(--neutral-1000)] text-white border-black"
                    : "bg-white border-[var(--neutral-300)] text-[var(--neutral-500)] hover:border-black"
                }`}
              >
                Level 2
              </button>
            </div>
          </div>

          {/* Books list grid */}
          <div className="grid grid-cols-4 gap-4 mt-2">
            {filteredBooks.map((b) => (
              <button
                key={b.id}
                onClick={() => b.isLocked ? alert("This book is locked! Complete active quests to unlock.") : setSelectedBook(b)}
                disabled={b.isLocked}
                className={`p-3 bg-[var(--neutral-0)] flex flex-col gap-3 text-left transition-all cursor-pointer relative chunky-button hover:border-black ${
                  b.isLocked ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {/* Blueprint Book Cover block */}
                <div className="bg-[var(--neutral-50)] border-2 border-black border-dashed rounded-[4px] h-44 flex flex-col items-center justify-center relative select-none">
                  <div className="absolute inset-0 border border-dashed border-[var(--neutral-200)] pointer-events-none" />
                  <span className="text-3xl">{b.coverEmoji}</span>
                  {b.isLocked && <span className="absolute top-2 right-2 text-xs">🔒</span>}
                </div>

                {/* Info & progress */}
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-black leading-tight uppercase truncate">{b.title}</h4>
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase text-[var(--neutral-500)]">
                    <span>{b.skills[0]}</span>
                    <span>{b.progress}%</span>
                  </div>
                  <div className="h-1 bg-[var(--neutral-200)] rounded-full overflow-hidden w-full">
                    <div className="h-full bg-[var(--neutral-1000)]" style={{ width: `${b.progress}%` }} />
                  </div>
                </div>
              </button>
            ))}

            {filteredBooks.length === 0 && (
              <div className="col-span-4 p-12 text-center bg-[var(--neutral-0)] border-2 border-dashed border-[var(--neutral-200)] rounded-2xl">
                <span className="text-3xl select-none">📚</span>
                <p className="text-xs text-[var(--neutral-500)] italic mt-2">
                  No matching book adventures found.
                </p>
              </div>
            )}
          </div>

        </div>

      )}

    </div>

    {/* FLOW STATE 4: STORY COMPLETE REWARDS MODAL */}
    {completedBook && (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6">
        <div className="w-full max-w-xl border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none space-y-6 animate-scale-up text-left">
          
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="bg-[var(--neutral-50)] border border-[var(--neutral-300)] border-dashed rounded-full flex items-center justify-center size-24 relative select-none">
              <span className="text-4xl animate-bounce">✨</span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[var(--neutral-900)]">Story Complete!</h3>
              <p className="text-sm font-semibold text-[var(--neutral-500)]">{completedBook.title}</p>
            </div>
          </div>

          <hr className="border-[var(--neutral-200)]" />

          {/* Rewards cards grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[var(--neutral-50)] chunky-panel p-4 flex flex-col items-center text-center space-y-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl">📈</span>
              <span className="text-xs font-black text-black leading-none">
                {BOOK_REWARDS[completedBook.id]?.xp || defaultRewards.xp}
              </span>
              <span className="text-[9px] font-bold text-[var(--neutral-400)] uppercase tracking-wide">XP Earned</span>
            </div>
            
            <div className="bg-[var(--neutral-50)] chunky-panel p-4 flex flex-col items-center text-center space-y-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl">🏆</span>
              <span className="text-xs font-black text-black leading-none">
                {BOOK_REWARDS[completedBook.id]?.badge || defaultRewards.badge}
              </span>
              <span className="text-[9px] font-bold text-[var(--neutral-400)] uppercase tracking-wide">Achievement</span>
            </div>

            <div className="bg-[var(--neutral-50)] chunky-panel p-4 flex flex-col items-center text-center space-y-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl">🎁</span>
              <span className="text-xs font-black text-black leading-none">
                {BOOK_REWARDS[completedBook.id]?.item || defaultRewards.item}
              </span>
              <span className="text-[9px] font-bold text-[var(--neutral-400)] uppercase tracking-wide">Inventory</span>
            </div>
          </div>

          <hr className="border-[var(--neutral-200)]" />

          {/* What you learned list */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--neutral-500)] block">
              What you learned
            </span>
            <div className="space-y-2">
              {(BOOK_LEARNING[completedBook.id] || defaultLearning).map((learn, idx) => (
                <div key={idx} className="flex gap-2.5 items-center">
                  <span className="text-xs select-none">✔️</span>
                  <p className="text-xs font-bold text-[var(--neutral-800)]">{learn}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-[var(--neutral-200)]" />

          {/* Cabbit speech congratulations */}
          <div className="bg-[var(--neutral-50)] chunky-panel p-4 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-3xl select-none shrink-0">🐰</span>
            <div>
              <h5 className="text-xxs font-black text-[var(--neutral-900)] uppercase">Companion Quote</h5>
              <p className="text-xs leading-relaxed text-[var(--neutral-700)] italic mt-1 font-semibold">
                {BOOK_QUOTES[completedBook.id] || defaultQuote}
              </p>
            </div>
          </div>

          {/* Back to library button */}
          <button
            onClick={() => setCompletedBook(null)}
            className="w-full bg-black text-white text-xs py-3.5 chunky-button shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Back to Bookshelf
          </button>

        </div>
      </div>
    )}
    </>
  );
}

// Global Shell Wrapper
export default function BookshelfPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeReading, setActiveReading] = useState<ReadingState | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "stories" | "guides" | "poetry" | "puzzles">("all");

  return (
    <MainShell sidebarContent={
      <BookshelfSidebar
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        activeReading={activeReading}
        setActiveReading={setActiveReading}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
    }>
      <BookshelfContent
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        activeReading={activeReading}
        setActiveReading={setActiveReading}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
    </MainShell>
  );
}
