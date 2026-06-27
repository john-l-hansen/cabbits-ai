"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CompanionOrb } from "@/components/companion/CompanionOrb";
import { useCompanion } from "@/components/providers/CompanionProvider";

const thinkingSteps = [
  "Orchestrator: Analyzing observation keywords...",
  "Orchestrator: Routing query to Specialist Agent...",
  "Specialist: Synthesizing educational feedback...",
  "Evaluator: Assessing reflection depth...",
  "Safety: Content verified. Synthesizing companion response...",
];

export default function QuestPage() {
  const { companion, isQuestCompleted, memories, completeQuest, isLoading } = useCompanion();
  const router = useRouter();

  const [observation, setObservation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");

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
            await completeQuest(observation);
          } catch (err) {
            setError("Something went wrong. Let's try again.");
          } finally {
            setIsSubmitting(false);
          }
        }, 800);
      }
    }
    return () => clearTimeout(timer);
  }, [isSubmitting, stepIndex, observation, completeQuest]);

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

  // Parse quest completion memory if exists
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (observation.trim().length < 10) {
      setError("Please describe the object with a bit more detail (minimum 10 characters).");
      return;
    }
    setError("");
    setIsSubmitting(true);
    setStepIndex(0);
  };

  // Determine current routed specialist dynamically for loader log
  const textLower = observation.toLowerCase();
  let predictedSpecialist = "Generalist";
  if (["plant", "leaf", "flower", "tree", "grass", "moss", "wood", "green", "pot"].some((w) => textLower.includes(w))) {
    predictedSpecialist = "Botany";
  } else if (["clock", "shadow", "light", "time", "sun", "mirror", "reflection", "gravity", "metal"].some((w) => textLower.includes(w))) {
    predictedSpecialist = "Physics";
  } else if (["book", "coin", "map", "old", "paper", "pen", "ink", "photo", "read"].some((w) => textLower.includes(w))) {
    predictedSpecialist = "History";
  }

  const currentStepMessage =
    stepIndex === 1
      ? `Orchestrator: Routing query to ${predictedSpecialist} Specialist...`
      : stepIndex === 2
      ? `${predictedSpecialist} Specialist: Synthesizing educational feedback...`
      : thinkingSteps[stepIndex];

  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto max-w-md rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-black/50 hover:text-black/80 transition-colors">
            ← Home
          </Link>
          <span className="text-xs font-semibold tracking-wider text-black/35 uppercase">
            Active Quest
          </span>
        </div>

        {/* 1. Submitting Thinking Screen */}
        {isSubmitting ? (
          <div className="my-12 flex flex-col items-center">
            <CompanionOrb mood="new" />
            <div className="mt-8 w-full rounded-2xl bg-[var(--surface-soft)] p-5 text-left border border-black/5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-dark)]">
                  Agent Orchestration
                </span>
              </div>
              <p className="text-sm leading-6 font-mono text-black/75 animate-pulse min-h-[3rem]">
                {currentStepMessage}
              </p>
            </div>
          </div>
        ) : isQuestCompleted && parsedMemory ? (
          /* 2. Quest Completed Screen */
          <div className="mt-6 space-y-6">
            <div className="flex justify-center">
              <CompanionOrb mood="idle" />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-emerald-800">
                Quest Complete
              </h1>
              <p className="mt-2 text-sm text-black/50">
                {companion.name} registered your reflection.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5 space-y-4 shadow-2xs">
              <div>
                <span className="text-xxs font-bold uppercase tracking-wider text-black/40">
                  Your Observation
                </span>
                <p className="mt-1 text-sm font-medium text-black/80">
                  “{parsedMemory.userObservation}”
                </p>
              </div>

              <hr className="border-black/5" />

              <div>
                <span className="flex items-center gap-2 text-xxs font-bold uppercase tracking-wider text-[var(--accent)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  {parsedMemory.routedSpecialist} Specialist Feedback
                </span>
                <p className="mt-1.5 text-sm leading-6 text-black/75">
                  {parsedMemory.specialistFeedback}
                </p>
              </div>

              <hr className="border-black/5" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-xxs font-bold uppercase tracking-wider text-black/40">
                    Evaluation Depth
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                      {parsedMemory.evaluationRating}
                    </span>
                  </div>
                </div>
                {parsedMemory.evaluationFeedback && (
                  <p className="text-xs text-black/55 flex-1 text-right italic">
                    {parsedMemory.evaluationFeedback}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--surface-soft)] p-5 border border-black/5">
              <p className="text-xs font-bold uppercase tracking-wider text-black/45">
                {companion.name} reflects
              </p>
              <p className="mt-2 leading-7 text-black/80 font-medium">
                {parsedMemory.companionReflection}
              </p>
            </div>

            <Link
              href="/"
              className="block w-full rounded-full bg-[var(--accent-dark)] px-5 py-4 text-center font-medium text-white shadow-sm hover:brightness-110 transition-all cursor-pointer"
            >
              Return Home
            </Link>
          </div>
        ) : (
          /* 3. Quest Form Input Screen */
          <div className="mt-6">
            <div className="my-6 flex justify-center">
              <CompanionOrb mood="quest" />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">Notice one thing.</h1>

            <p className="mt-3 leading-7 text-black/65">
              Look around the room and choose one object. What could it teach us if we studied it closely?
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-black/65">Describe your observation</span>
                <textarea
                  value={observation}
                  onChange={(e) => {
                    setObservation(e.target.value);
                    if (e.target.value.trim().length >= 10) setError("");
                  }}
                  rows={4}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[var(--accent)] transition-all resize-none leading-6 text-sm"
                  placeholder="I noticed the potted ivy leaf. It has structured veins branching out to feed the tip..."
                  maxLength={250}
                />
                <div className="flex justify-between items-center px-1">
                  {error ? (
                    <span className="text-xs text-red-500/80 font-medium">{error}</span>
                  ) : (
                    <span className="text-xs text-black/35 font-medium">
                      Be descriptive to consult a specialist
                    </span>
                  )}
                  <span className="text-xs text-black/30 font-mono">
                    {observation.length}/250
                  </span>
                </div>
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-[var(--accent-dark)] px-5 py-4 font-medium text-white shadow-sm hover:brightness-110 transition-all cursor-pointer"
              >
                Submit Observation
              </button>
            </form>

            <div className="mt-8 rounded-2xl bg-[var(--surface-soft)] p-5 border border-black/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-black/45">
                {companion.name} says
              </p>
              <p className="mt-2 leading-7 text-black/75">
                “We can start small. Curiosity usually does. Tell me about any object in the room.”
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
