"use client";

import Link from "next/link";
import React, { useState } from "react";
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
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto max-w-md rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
        <Link href="/" className="text-sm text-black/50 hover:text-black/80 transition-colors">
          ← Home
        </Link>

        <div className="my-8 flex justify-center">
          <CompanionOrb mood="new" />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          Name your companion.
        </h1>

        <p className="mt-3 leading-7 text-black/65">
          Your companion will guide you, remember how you learn, and help you reflect on your progress.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-black/65">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[var(--accent)] transition-all"
              placeholder="Moss, Pip, Echo..."
              maxLength={20}
            />
            {error && <span className="text-sm text-red-500/80">{error}</span>}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-black/65">Temperament</span>
            <select
              value={temperament}
              onChange={(e) => setTemperament(e.target.value as CompanionTemperament)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[var(--accent)] transition-all cursor-pointer"
            >
              <option value="gentle">Gentle</option>
              <option value="curious">Curious</option>
              <option value="playful">Playful</option>
              <option value="focused">Focused</option>
            </select>
          </label>

          <button
            type="submit"
            className="mt-4 rounded-full bg-[var(--accent-dark)] px-5 py-4 text-center font-medium text-white shadow-sm transition-all duration-200 hover:brightness-110 cursor-pointer"
          >
            Continue to first quest
          </button>
        </form>
      </section>
    </main>
  );
}
