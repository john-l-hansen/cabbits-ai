"use client";

import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CompanionOrb } from "@/components/companion/CompanionOrb";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { QUESTS } from "@/lib/data/quests";
import { ITEMS } from "@/lib/data/items";

const thinkingSteps = [
  "Orchestrator: Analyzing observation keywords...",
  "Orchestrator: Routing query to Specialist Agent...",
  "Specialist: Synthesizing educational feedback...",
  "Evaluator: Assessing reflection depth...",
  "Safety: Content verified. Synthesizing companion response...",
];

function QuestContent() {
  const { companion, memories, completeQuest, isLoading } = useCompanion();
  const searchParams = useSearchParams();
  const questId = searchParams.get("questId") || "notice_one_thing";
  const router = useRouter();

  const [observation, setObservation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");

  const activeQuest = QUESTS[questId] || QUESTS.notice_one_thing;

  // Redirect to companion creation if none exists
  useEffect(() => {
    if (!isLoading && !companion) {
      router.replace("/companion/new");
    }
  }, [isLoading, companion, router]);

  // Handle simulated loader ticks
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitting) {
      if (stepIndex < thinkingSteps.length - 1) {
        timer = setTimeout(() => {
          setStepIndex((prev) => prev + 1);
        }, 800);
      } else {
        timer = setTimeout(async () => {
          try {
            await completeQuest(observation, questId);
          } catch (err) {
            setError("Something went wrong. Let's try again.");
          } finally {
            setIsSubmitting(false);
          }
        }, 800);
      }
    }
    return () => clearTimeout(timer);
  }, [isSubmitting, stepIndex, observation, questId, completeQuest]);

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

  // Parse specific quest completion status
  const questMemory = memories.find((m) => {
    if (m.questId === questId) return true;
    try {
      const parsed = JSON.parse(m.content);
      return parsed.questId === questId;
    } catch (e) {
      return false;
    }
  });

  const isThisQuestCompleted = !!questMemory;
  let parsedMemory = null;

  if (isThisQuestCompleted && questMemory) {
    try {
      parsedMemory = JSON.parse(questMemory.content);
    } catch (e) {
      parsedMemory = {
        userObservation: observation,
        routedSpecialist: "Generalist",
        specialistFeedback: "Everyday objects carry hidden complexities.",
        evaluationRating: "Developing",
        evaluationFeedback: "",
        companionReflection: questMemory.content,
        curiosityEarned: 15,
      };
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (observation.trim().length < 10) {
      setError("Please describe your observation with a bit more detail (minimum 10 characters).");
      return;
    }
    setError("");
    setIsSubmitting(true);
    setStepIndex(0);
  };

  // Determine specialist dynamically for loader feedback
  const textLower = observation.toLowerCase();
  let predictedSpecialist = "Generalist";
  if (["plant", "leaf", "flower", "tree", "grass", "moss", "wood", "green", "pot", "clover", "buttercup"].some((w) => textLower.includes(w))) {
    predictedSpecialist = "Botany";
  } else if (["clock", "shadow", "light", "time", "sun", "mirror", "reflection", "gravity", "metal", "ripple", "water", "pond", "wave"].some((w) => textLower.includes(w))) {
    predictedSpecialist = "Physics";
  } else if (["book", "coin", "map", "old", "paper", "pen", "ink", "photo", "read", "rune"].some((w) => textLower.includes(w))) {
    predictedSpecialist = "History";
  }

  const currentStepMessage =
    stepIndex === 1
      ? `Orchestrator: Routing query to ${predictedSpecialist} Specialist...`
      : stepIndex === 2
      ? `${predictedSpecialist} Specialist: Synthesizing educational feedback...`
      : thinkingSteps[stepIndex];

  const exitUrl = questId === "notice_one_thing" ? "/" : "/explore";

  // Check if quest rewarded an item
  const rewardItem = activeQuest.rewardItemId ? ITEMS[activeQuest.rewardItemId] : null;

  return (
    <main className="min-h-screen bg-[var(--neutral-200)] px-6 py-8 flex justify-center items-center">
      <section className="mx-auto w-full max-w-md rounded-[2rem] border-2 border-[var(--neutral-1000)] bg-[var(--neutral-0)] p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href={exitUrl} className="text-sm text-[var(--neutral-500)] hover:text-[var(--neutral-900)] transition-colors">
            ← Back
          </Link>
          <span className="text-xs font-bold tracking-wider text-[var(--neutral-500)] uppercase">
            Active Quest
          </span>
        </div>

        {/* 1. Submitting Thinking Screen */}
        {isSubmitting ? (
          <div className="my-12 flex flex-col items-center">
            <CompanionOrb mood="new" curiosity={companion.curiosity} />
            <div className="mt-8 w-full rounded-2xl bg-[var(--neutral-50)] p-5 text-left border-2 border-[var(--neutral-300)] shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--neutral-1000)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--neutral-1000)]"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-900)]">
                  Agent Orchestration
                </span>
              </div>
              <p className="text-sm leading-6 font-mono text-[var(--neutral-700)] animate-pulse min-h-[3rem]">
                {currentStepMessage}
              </p>
            </div>
          </div>
        ) : isThisQuestCompleted && parsedMemory ? (
          /* 2. Quest Completed Screen */
          <div className="mt-6 space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <CompanionOrb mood="idle" curiosity={companion.curiosity} />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-[var(--neutral-900)]">
                Quest Complete
              </h1>
              <p className="mt-2 text-sm text-[var(--neutral-500)]">
                {companion.name} registered your reflection and filled +{parsedMemory.curiosityEarned} Curiosity!
              </p>
            </div>

            {/* Collectible Reward Item Announcement */}
            {rewardItem && (
              <div className="rounded-2xl border-2 border-dashed border-[var(--neutral-1000)] bg-[var(--neutral-50)] p-4 flex items-center gap-3.5 shadow-3xs">
                <span className="text-4xl shrink-0 select-none animate-bounce">{rewardItem.icon}</span>
                <div className="text-left min-w-0">
                  <h4 className="text-[10px] font-bold text-[var(--neutral-700)] uppercase tracking-wider">New Collectible Added!</h4>
                  <h5 className="text-sm font-extrabold text-[var(--neutral-900)]">{rewardItem.name}</h5>
                  <p className="text-[11px] text-[var(--neutral-500)] leading-relaxed truncate">{rewardItem.description}</p>
                </div>
              </div>
            )}

            <div className="rounded-2xl border-2 border-[var(--neutral-300)] bg-[var(--neutral-0)] p-5 space-y-4 shadow-2xs">
              <div>
                <span className="text-xxs font-bold uppercase tracking-wider text-[var(--neutral-500)]">
                  Your Observation
                </span>
                <p className="mt-1 text-sm font-medium text-[var(--neutral-900)]">
                  “{parsedMemory.userObservation}”
                </p>
              </div>

              <hr className="border-[var(--neutral-200)]" />

              <div>
                <span className="flex items-center gap-2 text-xxs font-bold uppercase tracking-wider text-[var(--neutral-1000)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--neutral-1000)]" />
                  {parsedMemory.routedSpecialist} Specialist Feedback
                </span>
                <p className="mt-1.5 text-sm leading-6 text-[var(--neutral-700)]">
                  {parsedMemory.specialistFeedback}
                </p>
              </div>

              <hr className="border-[var(--neutral-200)]" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-xxs font-bold uppercase tracking-wider text-[var(--neutral-500)]">
                    Evaluation Depth
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-[var(--neutral-200)] border border-[var(--neutral-300)] px-2.5 py-0.5 text-xs font-semibold text-[var(--neutral-900)]">
                      {parsedMemory.evaluationRating}
                    </span>
                    <span className="rounded-full bg-[var(--neutral-1000)] text-white px-2.5 py-0.5 text-xs font-semibold flex items-center gap-0.5">
                      ✨ +{parsedMemory.curiosityEarned} Curiosity
                    </span>
                  </div>
                </div>
                {parsedMemory.evaluationFeedback && (
                  <p className="text-xs text-[var(--neutral-500)] flex-1 text-right italic">
                    {parsedMemory.evaluationFeedback}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--neutral-50)] p-5 border-2 border-[var(--neutral-300)]">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">
                {companion.name} reflects
              </p>
              <p className="mt-2 leading-7 text-[var(--neutral-900)] font-medium">
                {parsedMemory.companionReflection}
              </p>
            </div>

            <Link
              href={exitUrl}
              className="block w-full rounded-full bg-[var(--neutral-1000)] px-5 py-4 text-center font-bold text-white shadow-sm hover:bg-[var(--neutral-900)] transition-all cursor-pointer active:scale-95 text-sm"
            >
              {questId === "notice_one_thing" ? "Return Home" : "Return to Map"}
            </Link>
          </div>
        ) : (
          /* 3. Quest Form Input Screen */
          <div className="mt-6">
            <div className="my-6 flex justify-center">
              <CompanionOrb mood="quest" curiosity={companion.curiosity} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[var(--neutral-900)]">{activeQuest.title}</h1>

            <p className="mt-3 leading-7 text-[var(--neutral-700)]">{activeQuest.description}</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-[var(--neutral-700)]">Describe your observation</span>
                <textarea
                  value={observation}
                  onChange={(e) => {
                    setObservation(e.target.value);
                    if (e.target.value.trim().length >= 10) setError("");
                  }}
                  rows={4}
                  className="rounded-2xl border-2 border-[var(--neutral-300)] bg-[var(--neutral-0)] px-4 py-3 outline-none focus:border-[var(--neutral-1000)] transition-all resize-none leading-6 text-sm text-[var(--neutral-900)]"
                  placeholder={activeQuest.placeholder}
                  maxLength={250}
                />
                <div className="flex justify-between items-center px-1">
                  {error ? (
                    <span className="text-xs text-red-500 font-medium">{error}</span>
                  ) : (
                    <span className="text-xs text-[var(--neutral-500)] font-medium">
                      Be descriptive to consult a specialist
                    </span>
                  )}
                  <span className="text-xs text-[var(--neutral-500)] font-mono">
                    {observation.length}/250
                  </span>
                </div>
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-[var(--neutral-1000)] px-5 py-4 font-bold text-white shadow-sm hover:bg-[var(--neutral-900)] transition-all cursor-pointer active:scale-95 text-sm"
              >
                Submit Observation
              </button>
            </form>

            <div className="mt-8 rounded-2xl bg-[var(--neutral-50)] p-5 border-2 border-[var(--neutral-300)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-500)]">
                {companion.name} says
              </p>
              <p className="mt-2 leading-7 text-[var(--neutral-700)]">{activeQuest.initialSaying}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function QuestPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen px-6 py-8 flex items-center justify-center bg-[var(--neutral-50)]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <CompanionOrb mood="idle" />
          <p className="text-sm text-[var(--neutral-500)]">Loading quest...</p>
        </div>
      </main>
    }>
      <QuestContent />
    </Suspense>
  );
}
