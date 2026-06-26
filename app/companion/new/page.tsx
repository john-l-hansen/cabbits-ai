import Link from "next/link";
import { CompanionOrb } from "@/components/companion/CompanionOrb";

export default function NewCompanionPage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto max-w-md rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
        <Link href="/" className="text-sm text-black/50">
          ← Home
        </Link>

        <div className="my-8 flex justify-center">
          <CompanionOrb mood="new" />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          Name your companion.
        </h1>

        <p className="mt-3 leading-7 text-black/65">
          This first version does not save yet. It gives the app a place for the
          companion creation flow to begin.
        </p>

        <form className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-black/65">Name</span>
            <input
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              placeholder="Moss, Pip, Echo..."
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-black/65">Temperament</span>
            <select className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none">
              <option>Gentle</option>
              <option>Curious</option>
              <option>Playful</option>
              <option>Focused</option>
            </select>
          </label>

          <Link
            href="/quest"
            className="mt-4 rounded-full bg-[var(--accent-dark)] px-5 py-4 text-center font-medium text-white"
          >
            Continue to first quest
          </Link>
        </form>
      </section>
    </main>
  );
}
