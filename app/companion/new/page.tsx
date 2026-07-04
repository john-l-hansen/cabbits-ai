"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CompanionOrb } from "@/components/companion/CompanionOrb";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { CompanionTemperament } from "@/types";

export default function NewCompanionPage() {
  const { createCompanion } = useCompanion();
  const router = useRouter();
  const [name, setName] = useState("");
  const [temperament, setTemperament] = useState<CompanionTemperament>("gentle");
  const [error, setError] = useState("");

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please choose a name for your companion.");
      return;
    }
    setError("");
    createCompanion(name, temperament);
    router.push("/quest");
  };

  return (
    <main className="min-h-screen bg-[var(--neutral-200)] px-6 py-8 flex justify-center items-center">
      <section className="mx-auto w-full max-w-md rounded-[2rem] border-2 border-[var(--neutral-1000)] bg-[var(--neutral-0)] p-6 shadow-sm">
        <Link href="/" className="text-sm text-[var(--neutral-500)] hover:text-[var(--neutral-900)] transition-colors">
          ← Home
        </Link>

        <div className="my-8 flex justify-center">
          <CompanionOrb mood="new" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[var(--neutral-900)]">
          Name your companion.
        </h1>

        <p className="mt-3 leading-7 text-[var(--neutral-700)]">
          Your companion will guide you, remember how you learn, and help you reflect on your progress.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--neutral-700)]">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
              className="rounded-2xl border-2 border-[var(--neutral-300)] bg-[var(--neutral-0)] px-4 py-3 outline-none focus:border-[var(--neutral-1000)] transition-all text-[var(--neutral-900)]"
              placeholder="Moss, Pip, Echo..."
              maxLength={20}
            />
            {error && <span className="text-sm text-red-500 font-medium">{error}</span>}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--neutral-700)]">Temperament</span>
            <select
              value={temperament}
              onChange={(e) => setTemperament(e.target.value as CompanionTemperament)}
              className="rounded-2xl border-2 border-[var(--neutral-300)] bg-[var(--neutral-0)] px-4 py-3 outline-none focus:border-[var(--neutral-1000)] transition-all cursor-pointer text-[var(--neutral-900)]"
            >
              <option value="gentle">Gentle</option>
              <option value="curious">Curious</option>
              <option value="playful">Playful</option>
              <option value="focused">Focused</option>
            </select>
          </label>

          <button
            type="submit"
            className="mt-4 rounded-full bg-[var(--neutral-1000)] px-5 py-4 text-center font-bold text-white shadow-sm transition-all duration-200 hover:bg-[var(--neutral-900)] cursor-pointer"
          >
            Continue to first quest
          </button>
        </form>
      </section>
    </main>
  );
}
