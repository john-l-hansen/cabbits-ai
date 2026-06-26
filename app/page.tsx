import Link from "next/link";
import { CompanionOrb } from "@/components/companion/CompanionOrb";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-between rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div>
          <p className="mb-6 text-sm font-medium tracking-[0.2em] text-black/50 uppercase">
            Cabbits
          </p>

          <div className="mb-8 flex justify-center">
            <CompanionOrb />
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            A quiet little companion for learning.
          </h1>

          <p className="mt-4 text-base leading-7 text-black/65">
            Create a companion that remembers how you grow, then begin a small
            quest built around curiosity, practice, and reflection.
          </p>
        </div>

        <div className="mt-10 grid gap-3">
          <Link
            href="/companion/new"
            className="rounded-full bg-[var(--accent-dark)] px-5 py-4 text-center font-medium text-white"
          >
            Create your companion
          </Link>
          <Link
            href="/quest"
            className="rounded-full border border-black/10 bg-white px-5 py-4 text-center font-medium text-black/75"
          >
            Preview first quest
          </Link>
        </div>
      </section>
    </main>
  );
}
