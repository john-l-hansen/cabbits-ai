"use client";

import Link from "next/link";
import { CompanionOrb } from "@/components/companion/CompanionOrb";
import { useCompanion } from "@/components/providers/CompanionProvider";

export default function Home() {
  const { companion, isQuestCompleted, isLoading, resetCompanion } = useCompanion();

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
                ? `You completed the first quest. ${companion.name} feels a sense of quiet accomplishment. Ready for the next adventure?`
                : `${companion.name} is a ${companion.temperament} companion, ready to guide you. Begin the first quest by studying one thing closely.`
              : "Create a companion that remembers how you grow, then begin a small quest built around curiosity, practice, and reflection."}
          </p>
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
