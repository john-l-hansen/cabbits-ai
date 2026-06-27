"use client";

import Link from "next/link";
import { CompanionOrb } from "@/components/companion/CompanionOrb";
import { useCompanion } from "@/components/providers/CompanionProvider";

export default function Home() {
  const { companion, isQuestCompleted, isLoading, memories, resetCompanion } = useCompanion();

  if (isLoading) {
    return (
      <main className="min-h-screen px-6 py-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <CompanionOrb mood="idle" />
          <p className="text-sm text-black/40">Loading companion...</p>
        </div>
      </main>
    );
  }

  const hasCompanion = companion !== null;

  // Retrieve and parse quest memory if completed
  const questMemory = memories.find((m) => m.questId === "notice_one_thing");
  let parsedMemory = null;
  if (isQuestCompleted && questMemory) {
    try {
      parsedMemory = JSON.parse(questMemory.content);
    } catch (e) {
      parsedMemory = {
        userObservation: "Studied an object closely.",
        routedSpecialist: "Generalist",
        specialistFeedback: "Everyday objects carry hidden complexities.",
        evaluationRating: "Developing",
        evaluationFeedback: "",
        companionReflection: questMemory.content,
      };
    }
  }

  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-between rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div>
          <p className="mb-6 text-sm font-medium tracking-[0.2em] text-black/50 uppercase">
            Cabbits
          </p>

          <div className="mb-8 flex justify-center">
            <CompanionOrb mood={hasCompanion ? (isQuestCompleted ? "idle" : "quest") : "new"} />
          </div>

          <h1 className="text-4xl font-semibold tracking-tight leading-10">
            {hasCompanion
              ? `${companion.name} is here with you.`
              : "A quiet little companion for learning."}
          </h1>

          <p className="mt-4 text-base leading-7 text-black/65">
            {hasCompanion
              ? isQuestCompleted
                ? `You completed your first check-in. ${companion.name} is quiet, reflecting on how you grow together.`
                : `${companion.name} is a ${companion.temperament} companion, ready to guide you. Begin the first quest by studying one thing closely.`
              : "Create a companion that remembers how you grow, then begin a small quest built around curiosity, practice, and reflection."}
          </p>

          {/* Show the reflection summary if quest is completed */}
          {hasCompanion && isQuestCompleted && parsedMemory && (
            <div className="mt-6 rounded-2xl border border-black/5 bg-white/50 p-4 text-left shadow-3xs space-y-2.5 animate-orb-float">
              <div className="flex items-center justify-between">
                <span className="text-xxs font-bold uppercase tracking-wider text-[var(--accent)]">
                  Notice One Thing Memory
                </span>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100/50 px-2 py-0.5 rounded-full">
                  {parsedMemory.routedSpecialist} Specialist
                </span>
              </div>
              <p className="text-xs italic text-black/65 font-medium leading-5">
                “{parsedMemory.userObservation}”
              </p>
              <div className="pt-2 border-t border-black/5">
                <p className="text-xxs font-bold text-black/40 uppercase">Companion's Reflection</p>
                <p className="mt-1 text-xs text-black/75 leading-5">
                  {parsedMemory.companionReflection}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-3">
          {hasCompanion ? (
            <>
              <Link
                href="/quest"
                className="rounded-full bg-[var(--accent-dark)] px-5 py-4 text-center font-medium text-white shadow-sm transition-all duration-200 hover:brightness-110"
              >
                {isQuestCompleted ? "View Quest Reflection" : "Continue to First Quest"}
              </Link>
              <button
                onClick={resetCompanion}
                className="rounded-full border border-red-100/50 bg-red-50/10 px-5 py-4 text-center font-medium text-red-600/70 transition-all duration-200 hover:bg-red-50/40 hover:text-red-600 cursor-pointer"
              >
                Reset Companion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/companion/new"
                className="rounded-full bg-[var(--accent-dark)] px-5 py-4 text-center font-medium text-white shadow-sm transition-all duration-200 hover:brightness-110"
              >
                Create your companion
              </Link>
              <Link
                href="/quest"
                className="rounded-full border border-black/10 bg-white px-5 py-4 text-center font-medium text-black/75 transition-all duration-200 hover:bg-black/5"
              >
                Preview first quest
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
