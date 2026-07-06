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
  const { companion, memories, completeQuest, isLoading, completedQuestIds } = useCompanion();
  const searchParams = useSearchParams();
  const questId = searchParams.get("questId") || "pond_lilies";
  const router = useRouter();

  const [selectedChoiceId, setSelectedChoiceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");

  const activeQuest = QUESTS[questId] || QUESTS.pond_lilies;

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
            await completeQuest(questId, selectedChoiceId);
          } catch (err) {
            setError("Something went wrong. Let's try again.");
          } finally {
            setIsSubmitting(false);
          }
        }, 800);
      }
    }
    return () => clearTimeout(timer);
  }, [isSubmitting, stepIndex, selectedChoiceId, questId, completeQuest]);

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
  const isThisQuestCompleted = completedQuestIds.includes(questId);
  let parsedMemory = null;

  if (isThisQuestCompleted) {
    const questMemory = memories.find((m) => {
      if (m.questId === questId) return true;
      try {
        const parsed = JSON.parse(m.content);
        return parsed.questId === questId;
      } catch (e) {
        return false;
      }
    });

    if (questMemory) {
      try {
        parsedMemory = JSON.parse(questMemory.content);
      } catch (e) {
        parsedMemory = {
          userObservation: "Completed the landmark observation.",
          routedSpecialist: "Generalist",
          specialistFeedback: "Everyday objects carry hidden complexities.",
          evaluationRating: "Thoughtful",
          evaluationFeedback: "Positive problem-solving approach selected.",
          companionReflection: questMemory.content,
          curiosityEarned: 20,
        };
      }
    }
  }

  const handleChoiceClick = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
    setIsSubmitting(true);
    setStepIndex(0);
  };

  // Determine specialist dynamically for loader feedback based on chosen type
  const activeChoice = activeQuest.choices?.find((c) => c.id === selectedChoiceId);
  let predictedSpecialist = "Generalist";
  if (activeChoice?.type === "logical") predictedSpecialist = "Logician";
  else if (activeChoice?.type === "verbal") predictedSpecialist = "Linguist";
  else if (activeChoice?.type === "practical") predictedSpecialist = "Craftsman";

  const currentStepMessage =
    stepIndex === 1
      ? `Orchestrator: Routing query to ${predictedSpecialist} Specialist...`
      : stepIndex === 2
      ? `${predictedSpecialist} Specialist: Synthesizing educational feedback...`
      : thinkingSteps[stepIndex];

  const exitUrl = "/explore";
  const rewardItem = activeQuest.rewardItemId ? ITEMS[activeQuest.rewardItemId] : null;

  return (
    <main className="min-h-screen bg-[var(--neutral-200)] px-6 py-8 flex justify-center items-center select-none font-sans">
      <section className="mx-auto w-full max-w-md rounded-[2rem] border-4 border-black bg-[var(--neutral-0)] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between">
          <Link href={exitUrl} className="text-xs font-black uppercase text-[var(--neutral-600)] hover:text-black transition-colors">
            ← Exit Map
          </Link>
          <span className="text-xxs font-black tracking-wider text-[var(--neutral-500)] uppercase">
            Quest Chamber
          </span>
        </div>

        {/* 1. Submitting Thinking Screen */}
        {isSubmitting ? (
          <div className="my-12 flex flex-col items-center">
            <CompanionOrb mood="new" curiosity={companion.curiosity} />
            <div className="mt-8 w-full rounded-2xl bg-[var(--neutral-50)] p-5 text-left border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--neutral-1000)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--neutral-1000)]"></span>
                </span>
                <span className="text-xxs font-black uppercase tracking-wider text-[var(--neutral-900)]">
                  Agent Orchestration
                </span>
              </div>
              <p className="text-xs leading-6 font-mono text-[var(--neutral-700)] animate-pulse min-h-[3rem]">
                {currentStepMessage}
              </p>
            </div>
          </div>
        ) : isThisQuestCompleted && parsedMemory ? (
          /* 2. Quest Completed Screen */
          <div className="mt-6 space-y-6 animate-fade-in text-left">
            <div className="flex justify-center">
              <CompanionOrb mood="idle" curiosity={companion.curiosity} />
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-black uppercase text-[var(--neutral-900)]">
                Quest Complete!
              </h1>
              <p className="mt-2 text-xxs font-bold text-[var(--neutral-500)] uppercase tracking-wider">
                {companion.name} registered your action and earned +200 XP!
              </p>
            </div>

            {/* Collectible Reward Item Announcement */}
            {rewardItem && (
              <div className="rounded-2xl border-4 border-black bg-[#fffef0] p-4 flex items-center gap-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-4xl shrink-0 select-none animate-bounce">{rewardItem.icon}</span>
                <div className="text-left min-w-0">
                  <h4 className="text-[9px] font-black text-amber-800 uppercase tracking-wider">New Collectible Added!</h4>
                  <h5 className="text-xs font-black text-[var(--neutral-900)] uppercase">{rewardItem.name}</h5>
                  <p className="text-[10px] text-[var(--neutral-600)] leading-relaxed mt-0.5">{rewardItem.description}</p>
                </div>
              </div>
            )}

            <div className="rounded-2xl border-4 border-black bg-[var(--neutral-0)] p-5 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <span className="text-xxs font-black uppercase tracking-wider text-[var(--neutral-500)]">
                  Your Solution
                </span>
                <p className="mt-1 text-xs font-extrabold text-[var(--neutral-900)] leading-relaxed">
                  “{parsedMemory.userObservation}”
                </p>
              </div>

              <hr className="border-2 border-black" />

              <div>
                <span className="flex items-center gap-2 text-xxs font-black uppercase tracking-wider text-[var(--neutral-1000)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--neutral-1000)] animate-pulse" />
                  {parsedMemory.routedSpecialist} Specialist Feedback
                </span>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--neutral-700)] font-semibold">
                  {parsedMemory.specialistFeedback}
                </p>
              </div>

              <hr className="border-2 border-black" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-xxs font-black uppercase tracking-wider text-[var(--neutral-500)]">
                    Quest Metrics
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-black text-white px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
                      {parsedMemory.evaluationRating}
                    </span>
                    <span className="rounded-full bg-[#fce8e6] text-[#c53030] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
                      ✨ +200 XP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#f7f3e6] p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xxs font-black uppercase tracking-wider text-[var(--neutral-500)]">
                {companion.name} says
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--neutral-900)] font-extrabold italic">
                {parsedMemory.companionReflection}
              </p>
            </div>

            <Link
              href={exitUrl}
              className="block w-full py-4 text-center font-black text-white transition-all cursor-pointer active:scale-95 text-xs uppercase tracking-wider chunky-button bg-black hover:bg-neutral-900"
            >
              Return to Map
            </Link>
          </div>
        ) : (
          /* 3. Quest Form Input Screen */
          <div className="mt-6 text-left">
            <div className="my-6 flex justify-center">
              <CompanionOrb mood="quest" curiosity={companion.curiosity} />
            </div>

            <h1 className="text-2xl font-black uppercase leading-snug text-[var(--neutral-900)]">{activeQuest.title}</h1>
            <p className="mt-2 text-xxs font-bold text-neutral-500 uppercase tracking-wider">Landmark: {activeQuest.poiId}</p>

            <p className="mt-3 text-xs leading-relaxed text-[var(--neutral-700)] font-medium">{activeQuest.description}</p>

            <div className="mt-8 space-y-4">
              <span className="text-xxs font-black uppercase tracking-wider text-neutral-500 block mb-1">Choose your approach:</span>
              
              <div className="grid grid-cols-1 gap-4">
                {activeQuest.choices?.map((choice) => {
                  let icon = "📐";
                  let typeLabel = "LOGIC";
                  let colorClass = "bg-[#eff6ff] hover:bg-[#dbeafe] text-blue-900";
                  if (choice.type === "verbal") {
                    icon = "🗣️";
                    typeLabel = "RELATIONAL";
                    colorClass = "bg-[#fdf2f8] hover:bg-[#fce7f3] text-pink-900";
                  } else if (choice.type === "practical") {
                    icon = "🔧";
                    typeLabel = "PRACTICAL";
                    colorClass = "bg-[#f0fdf4] hover:bg-[#dcfce7] text-green-900";
                  }

                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => handleChoiceClick(choice.id)}
                      className={`w-full text-left p-4 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer ${colorClass}`}
                    >
                      <span className="text-[9px] font-black uppercase tracking-wider block opacity-70 mb-1">
                        {icon} {typeLabel}
                      </span>
                      <h4 className="text-xs font-black uppercase">{choice.text}</h4>
                      <p className="text-[10px] opacity-90 mt-1 leading-relaxed font-semibold">{choice.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f7f3e6] p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xxs font-black uppercase tracking-wider text-[var(--neutral-500)]">
                {companion.name} says
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--neutral-700)] font-extrabold italic">{activeQuest.initialSaying}</p>
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
