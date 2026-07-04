import React from "react";

export function parseKeepsake(input: string) {
  const clean = input.trim();
  if (!clean) return { title: "Keepsake", slot: "Cosmetic Slot", emoji: "🎁", description: "" };

  const title = clean.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  let slot = "Cosmetic Slot";
  let emoji = "🎁";
  const lower = clean.toLowerCase();

  if (lower.includes("scarf") || lower.includes("muffler")) {
    slot = "Neck Slot";
    emoji = "🧣";
  } else if (lower.includes("necklace") || lower.includes("collar") || lower.includes("pendant")) {
    slot = "Neck Slot";
    emoji = "📿";
  } else if (lower.includes("hat") || lower.includes("cap") || lower.includes("beanie") || lower.includes("beret")) {
    slot = "Head Slot";
    emoji = "🧢";
  } else if (lower.includes("bow") || lower.includes("ribbon") || lower.includes("headband")) {
    slot = "Head Slot";
    emoji = "🎀";
  } else if (lower.includes("crown") || lower.includes("tiara")) {
    slot = "Head Slot";
    emoji = "👑";
  } else if (lower.includes("flower") || lower.includes("rose") || lower.includes("daisy") || lower.includes("clover")) {
    slot = "Head Slot";
    emoji = "🌸";
  } else if (lower.includes("pin") || lower.includes("badge") || lower.includes("brooch")) {
    slot = "Accessory Slot";
    emoji = "📌";
  } else if (lower.includes("glasses") || lower.includes("spectacles") || lower.includes("monocle") || lower.includes("goggles")) {
    slot = "Accessory Slot";
    emoji = "👓";
  } else if (lower.includes("watch") || lower.includes("clock")) {
    slot = "Accessory Slot";
    emoji = "⌚";
  } else if (lower.includes("ring")) {
    slot = "Accessory Slot";
    emoji = "💍";
  } else if (lower.includes("book") || lower.includes("journal") || lower.includes("notebook")) {
    slot = "Accessory Slot";
    emoji = "📖";
  } else if (lower.includes("wand")) {
    slot = "Accessory Slot";
    emoji = "🪄";
  } else if (lower.includes("sword") || lower.includes("blade") || lower.includes("dagger")) {
    slot = "Accessory Slot";
    emoji = "🗡️";
  } else if (lower.includes("shield")) {
    slot = "Accessory Slot";
    emoji = "🛡️";
  }

  const description = `A cozy, hand-crafted ${clean}. It feels soft to the touch and seems to glow with a gentle starlight aura.`;

  return { title, slot, emoji, description };
}

export function CabbitVectorPreview({
  earStyle,
  eyeStyle,
  furColor,
  keepsakeText,
}: {
  earStyle: "floppy" | "pointy" | "round";
  eyeStyle: "wide" | "sleepy" | "sparkle";
  furColor: string;
  keepsakeText?: string;
}) {
  const colorMap: Record<string, string> = {
    cream: "#fcf6eb",
    tan: "#d7b594",
    rust: "#ac3232",
    sage: "#76a5af",
    dusk: "#3d5e72",
    midnight: "#111118",
  };
  const colorHex = colorMap[furColor] || "#cccccc";

  const parsed = keepsakeText ? parseKeepsake(keepsakeText) : null;

  return (
    <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto relative overflow-visible select-none">
      {/* Ears */}
      {earStyle === "pointy" && (
        <>
          <polygon points="65,90 50,20 85,75" fill={colorHex} stroke="var(--neutral-1000)" strokeWidth="2.5" />
          <polygon points="135,90 150,20 115,75" fill={colorHex} stroke="var(--neutral-1000)" strokeWidth="2.5" />
        </>
      )}
      {earStyle === "floppy" && (
        <>
          <path d="M 65 90 C 45 90, 30 110, 40 140 C 45 150, 55 140, 60 120 C 65 100, 65 90, 65 90" fill={colorHex} stroke="var(--neutral-1000)" strokeWidth="2.5" />
          <path d="M 135 90 C 155 90, 170 110, 160 140 C 155 150, 145 140, 140 120 C 135 100, 135 90, 135 90" fill={colorHex} stroke="var(--neutral-1000)" strokeWidth="2.5" />
        </>
      )}
      {earStyle === "round" && (
        <>
          <circle cx="70" cy="55" r="22" fill={colorHex} stroke="var(--neutral-1000)" strokeWidth="2.5" />
          <circle cx="130" cy="55" r="22" fill={colorHex} stroke="var(--neutral-1000)" strokeWidth="2.5" />
        </>
      )}

      {/* Head */}
      <circle cx="100" cy="110" r="48" fill="var(--neutral-0)" stroke="var(--neutral-1000)" strokeWidth="2.5" />
      <circle cx="68" cy="120" r="10" fill={colorHex} opacity="0.8" />
      <circle cx="132" cy="120" r="10" fill={colorHex} opacity="0.8" />

      {/* Eyes */}
      {eyeStyle === "wide" && (
        <>
          <circle cx="82" cy="105" r="6" fill="var(--neutral-1000)" />
          <circle cx="118" cy="105" r="6" fill="var(--neutral-1000)" />
        </>
      )}
      {eyeStyle === "sleepy" && (
        <>
          <path d="M 76 108 Q 82 104, 88 108" fill="none" stroke="var(--neutral-1000)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 112 108 Q 118 104, 124 108" fill="none" stroke="var(--neutral-1000)" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {eyeStyle === "sparkle" && (
        <>
          <path d="M 82 99 L 84 105 L 90 107 L 84 109 L 82 115 L 80 109 L 74 107 L 80 105 Z" fill="var(--neutral-1000)" />
          <path d="M 118 99 L 120 105 L 126 107 L 120 109 L 118 115 L 116 109 L 110 107 L 116 105 Z" fill="var(--neutral-1000)" />
        </>
      )}

      {/* Mouth */}
      <polygon points="100,113 97,110 103,110" fill="var(--neutral-1000)" />
      <path d="M 97 116 Q 100 119, 103 116" fill="none" stroke="var(--neutral-1000)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Dynamic Keepsake Equipped Rendering */}
      {parsed && parsed.emoji && (
        <>
          {parsed.slot === "Head Slot" && (
            <text x="82" y="70" fontSize="36" className="select-none animate-bounce">
              {parsed.emoji}
            </text>
          )}
          {parsed.slot === "Neck Slot" && (
            <text x="82" y="160" fontSize="36" className="select-none animate-bounce">
              {parsed.emoji}
            </text>
          )}
          {parsed.slot === "Accessory Slot" && (
            <text x="126" y="132" fontSize="28" className="select-none animate-bounce">
              {parsed.emoji}
            </text>
          )}
          {parsed.slot === "Cosmetic Slot" && (
            <text x="126" y="152" fontSize="28" className="select-none animate-bounce">
              {parsed.emoji}
            </text>
          )}
        </>
      )}
    </svg>
  );
}
