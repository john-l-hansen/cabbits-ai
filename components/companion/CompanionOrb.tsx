type CompanionOrbProps = {
  mood?: "new" | "quest" | "idle";
};

export function CompanionOrb({ mood = "idle" }: CompanionOrbProps) {
  const label = mood === "new" ? "..." : mood === "quest" ? "?" : "•";

  return (
    <div className="relative flex h-36 w-36 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#f4df9b] via-[#c8d6a3] to-[#8fb39a] shadow-[0_20px_80px_rgba(71,97,70,0.24)] transition-all duration-500 hover:scale-105 active:scale-95 animate-orb-pulse">
      {/* Blurred glowing core */}
      <div className="absolute inset-4 rounded-full bg-white/25 blur-sm animate-orb-inner-pulse" />
      
      {/* Inner face panel */}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/60 text-3xl font-semibold text-[var(--accent-dark)] backdrop-blur-xs select-none shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]">
        {label}
      </div>
    </div>
  );
}
