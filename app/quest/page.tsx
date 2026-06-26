import Link from "next/link";
import { CompanionOrb } from "@/components/companion/CompanionOrb";

export default function QuestPage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto max-w-md rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
        <Link href="/" className="text-sm text-black/50">
          ← Home
        </Link>

        <div className="my-8 flex justify-center">
          <CompanionOrb mood="quest" />
        </div>

        <p className="text-sm font-medium tracking-[0.2em] text-black/45 uppercase">
          First Quest
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Notice one thing.
        </h1>

        <p className="mt-4 leading-7 text-black/65">
          Look around the room and choose one object. What could it teach us if
          we studied it closely?
        </p>

        <div className="mt-8 rounded-3xl bg-[var(--surface-soft)] p-5">
          <p className="text-sm font-medium text-black/55">Companion says</p>
          <p className="mt-2 leading-7">
            “We can start small. Curiosity usually does.”
          </p>
        </div>

        <button className="mt-8 w-full rounded-full bg-[var(--accent-dark)] px-5 py-4 font-medium text-white">
          Mark quest complete
        </button>
      </section>
    </main>
  );
}
