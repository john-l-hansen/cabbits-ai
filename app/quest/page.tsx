"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CompanionOrb } from "@/components/companion/CompanionOrb";
import { useCompanion } from "@/components/providers/CompanionProvider";

export default function QuestPage() {
  const { companion, isQuestCompleted, completeQuest, isLoading } = useCompanion();
  const router = useRouter();

  // Redirect to companion creation if none exists
  useEffect(() => {
    if (!isLoading && !companion) {
      router.replace("/companion/new");
    }
  }, [isLoading, companion, router]);

  if (isLoading || !companion) {
    return (
      <main className="min-h-screen px-6 py-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <CompanionOrb mood="idle" />
          <p className="text-sm text-black/40">Loading quest...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto max-w-md rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
        <Link href="/" className="text-sm text-black/50 hover:text-black/80 transition-colors">
          ← Home
        </Link>

        <div className="my-8 flex justify-center">
          <CompanionOrb mood={isQuestCompleted ? "idle" : "quest"} />
        </div>

        <p className="text-sm font-medium tracking-[0.2em] text-black/45 uppercase">
          First Quest
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Notice one thing.
        </h1>

        <p className="mt-4 leading-7 text-black/65">
          Look around the room and choose one object. What could it teach us if we studied it closely?
        </p>

        <div className="mt-8 rounded-3xl bg-[var(--surface-soft)] p-5 transition-all duration-300">
          <p className="text-sm font-medium text-black/55">{companion.name} says</p>
          <p className="mt-2 leading-7 italic">
            {isQuestCompleted
              ? "“You noticed one thing. That's a beautiful way to begin. Every lesson starts with just a single observation.”"
              : "“We can start small. Curiosity usually does.”"}
          </p>
        </div>

        {isQuestCompleted ? (
          <div className="mt-8 grid gap-3">
            <div className="w-full rounded-full bg-emerald-50 border border-emerald-200/50 py-4 text-center font-medium text-emerald-700 flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Quest Completed
            </div>
            <Link
              href="/"
              className="w-full rounded-full bg-[var(--accent-dark)] px-5 py-4 text-center font-medium text-white shadow-sm hover:brightness-110 transition-all duration-200"
            >
              Return Home
            </Link>
          </div>
        ) : (
          <button
            onClick={completeQuest}
            className="mt-8 w-full rounded-full bg-[var(--accent-dark)] px-5 py-4 font-medium text-white shadow-sm hover:brightness-110 transition-all duration-200 cursor-pointer"
          >
            Mark quest complete
          </button>
        )}
      </section>
    </main>
  );
}
