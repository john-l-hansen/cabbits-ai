"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CompanionOrb } from "@/components/companion/CompanionOrb";
import { useCompanion } from "@/components/providers/CompanionProvider";
import { CompanionTemperament } from "@/types";

function CabbitVectorPreview({
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
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto relative overflow-visible">
      {/* Background circle outline */}
      <circle cx="100" cy="100" r="95" fill="none" stroke="var(--neutral-1000)" strokeWidth="2" strokeDasharray="4 4" />
      
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

function parseKeepsake(input: string) {
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

  const description = `A cozy, hand-crafted ${clean}. It feels soft to the touch and seems to glow with a gentle starlight aura of your creativity.`;

  return { title, slot, emoji, description };
}

export default function LoginPage() {
  const { companion, createCompanion, resetCompanion, isLoading } = useCompanion();
  const router = useRouter();

  const [step, setStep] = useState<"splash" | "returning" | "signup" | "creation" | "keepsake-reveal" | "welcome">("splash");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Customizations
  const [name, setName] = useState("");
  const [temperament, setTemperament] = useState<CompanionTemperament>("gentle");
  const [earStyle, setEarStyle] = useState<"floppy" | "pointy" | "round">("pointy");
  const [eyeStyle, setEyeStyle] = useState<"wide" | "sleepy" | "sparkle">("wide");
  const [furColor, setFurColor] = useState<"cream" | "tan" | "rust" | "sage" | "dusk" | "midnight">("cream");
  const [keepsake, setKeepsake] = useState("");

  useEffect(() => {
    // If user is already authenticated and has a companion, skip login
    if (!isLoading) {
      const user = localStorage.getItem("cabbits_user");
      if (user && companion) {
        router.replace("/");
      }
    }
  }, [isLoading, companion, router]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    localStorage.setItem("cabbits_user", JSON.stringify({ email: email.trim() }));
    
    if (companion) {
      setStep("welcome");
    } else {
      setStep("creation");
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    localStorage.setItem("cabbits_user", JSON.stringify({ email: email.trim() }));
    
    // Clear any previous companion details so the new user starts fresh with customization & naming
    resetCompanion();
    setName("");
    setStep("creation");
  };

  const handleGoogleSignIn = () => {
    localStorage.setItem("cabbits_user", JSON.stringify({ email: "googleuser@gmail.com" }));
    if (step === "signup") {
      resetCompanion();
      setName("");
      setStep("creation");
    } else if (companion) {
      setStep("welcome");
    } else {
      setStep("creation");
    }
  };

  const handleConfirmCustomization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please choose a name for your companion.");
      return;
    }
    setError("");
    await createCompanion(name, temperament);
    
    // Save style customizations locally
    localStorage.setItem(
      "cabbits_customizations",
      JSON.stringify({ earStyle, eyeStyle, furColor, keepsake })
    );

    // Make sure user is logged in
    if (!localStorage.getItem("cabbits_user")) {
      localStorage.setItem("cabbits_user", JSON.stringify({ email: "newexplorer@cabbits.org" }));
    }

    if (keepsake.trim().length > 0) {
      setStep("keepsake-reveal");
    } else {
      setStep("welcome");
    }
  };

  const handleSkipCustomization = async () => {
    const randomNames = ["Pip", "Mochi", "Echo", "Fern", "Moss", "Sprout"];
    const chosenName = randomNames[Math.floor(Math.random() * randomNames.length)];
    await createCompanion(chosenName, "curious");
    
    localStorage.setItem(
      "cabbits_customizations",
      JSON.stringify({ earStyle: "pointy", eyeStyle: "wide", furColor: "cream", keepsake: "" })
    );

    if (!localStorage.getItem("cabbits_user")) {
      localStorage.setItem("cabbits_user", JSON.stringify({ email: "newexplorer@cabbits.org" }));
    }

    setStep("welcome");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen px-6 py-8 flex items-center justify-center bg-[var(--neutral-50)]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <CompanionOrb mood="idle" />
          <p className="text-sm text-[var(--neutral-500)]">Checking details...</p>
        </div>
      </main>
    );
  }

  return (
    <main 
      className="min-h-screen px-6 py-8 flex justify-center items-center font-sans bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/assets/login_bg.jpg')" }}
    >
      {/* Soft overlay to make the chunky card interface stand out cleanly */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[3px]" />

      <div className="mx-auto w-full max-w-lg relative z-10">
        
        {/* STEP 1: SPLASH SCREEN (login-splash) */}
        {step === "splash" && (
          <section className="rounded-[2.5rem] border-2 border-[var(--neutral-1000)] bg-[var(--neutral-0)] p-8 shadow-sm flex flex-col items-center justify-between text-center min-h-[500px]">
            <div className="space-y-2 mt-4">
              <div className="border-2 border-[var(--neutral-1000)] bg-[var(--neutral-50)] px-6 py-2 rounded-full inline-block font-extrabold uppercase tracking-widest text-[var(--neutral-900)] text-sm">
                Cabbits
              </div>
              <p className="text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wider">A cozy learning adventure</p>
            </div>

            <div className="my-6 w-48 h-48 wireframe-placeholder flex flex-col items-center justify-center border-2 border-[var(--neutral-300)] rounded-full">
              <span className="text-5xl select-none">🐰</span>
              <span className="text-[10px] font-bold text-[var(--neutral-500)] mt-2 uppercase tracking-wide">Cabbit Character</span>
            </div>

            <div className="w-full space-y-4 max-w-sm mb-4">
              <button
                onClick={() => {
                  setError("");
                  setStep("signup");
                }}
                className="w-full rounded-full bg-[var(--neutral-1000)] py-4 font-bold text-white shadow-sm hover:bg-[var(--neutral-900)] active:scale-97 transition-all text-sm cursor-pointer"
              >
                Begin Your Journey →
              </button>
              <button
                onClick={() => setStep("returning")}
                className="w-full rounded-full border-2 border-[var(--neutral-1000)] bg-[var(--neutral-0)] py-4 font-bold text-[var(--neutral-900)] hover:bg-[var(--neutral-50)] active:scale-97 transition-all text-sm cursor-pointer"
              >
                Continue Adventure
              </button>
              <p className="text-[10px] text-[var(--neutral-400)] leading-relaxed pt-2">
                By playing, you agree to our <span className="underline cursor-pointer">Terms</span> & <span className="underline cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </section>
        )}

        {/* STEP 2: RETURNING USER LOGIN (login-returning) */}
        {step === "returning" && (
          <section className="rounded-[2.5rem] border-2 border-[var(--neutral-1000)] bg-[var(--neutral-0)] p-8 shadow-sm animate-scale-up">
            <button
              onClick={() => setStep("splash")}
              className="text-xs font-bold text-[var(--neutral-500)] hover:text-[var(--neutral-900)] mb-6 inline-block"
            >
              ← Back
            </button>

            <div className="text-center space-y-2 mb-8">
              <div className="border-2 border-[var(--neutral-1000)] bg-[var(--neutral-50)] px-4 py-1.5 rounded-full inline-block font-extrabold uppercase tracking-widest text-[var(--neutral-900)] text-xs">
                Welcome Back!
              </div>
              <h2 className="text-2xl font-bold text-[var(--neutral-900)]">Sign in to continue</h2>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">Email Address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border-2 border-[var(--neutral-300)] bg-[var(--neutral-0)] px-4 py-3.5 outline-none focus:border-[var(--neutral-1000)] transition-all text-sm text-[var(--neutral-900)]"
                  placeholder="explorer@valley.com"
                />
              </label>

              <label className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">Password</span>
                  <span className="text-xs text-[var(--neutral-500)] hover:underline cursor-pointer">Forgot password?</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border-2 border-[var(--neutral-300)] bg-[var(--neutral-0)] px-4 py-3.5 outline-none focus:border-[var(--neutral-1000)] transition-all text-sm text-[var(--neutral-900)] pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-sm font-semibold text-[var(--neutral-500)] hover:text-[var(--neutral-900)] select-none cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-full bg-[var(--neutral-1000)] py-4 font-bold text-white shadow-sm hover:bg-[var(--neutral-900)] transition-all text-sm cursor-pointer mt-4"
              >
                Sign In
              </button>
            </form>

            <div className="my-6 flex items-center justify-between gap-4">
              <hr className="w-full border-[var(--neutral-200)]" />
              <span className="text-xs font-bold text-[var(--neutral-400)] uppercase">or</span>
              <hr className="w-full border-[var(--neutral-200)]" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full rounded-full border-2 border-[var(--neutral-300)] py-3.5 font-bold text-[var(--neutral-700)] hover:bg-[var(--neutral-50)] hover:border-[var(--neutral-1000)] transition-all text-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🌐</span> Continue with Google
            </button>

            <p className="text-center text-xs text-[var(--neutral-500)] mt-8">
              New to Cabbits?{" "}
              <span onClick={() => {
                setError("");
                setStep("signup");
              }} className="font-bold text-[var(--neutral-900)] underline cursor-pointer">
                Create an account
              </span>
            </p>
          </section>
        )}

        {/* STEP 2B: EMAIL SIGN UP (login-signup) */}
        {step === "signup" && (
          <section className="rounded-[2.5rem] border-2 border-[var(--neutral-1000)] bg-[var(--neutral-0)] p-8 shadow-sm animate-scale-up">
            <button
              onClick={() => setStep("splash")}
              className="text-xs font-bold text-[var(--neutral-500)] hover:text-[var(--neutral-900)] mb-6 inline-block"
            >
              ← Back
            </button>

            <div className="text-center space-y-2 mb-8">
              <div className="border-2 border-[var(--neutral-1000)] bg-[var(--neutral-50)] px-4 py-1.5 rounded-full inline-block font-extrabold uppercase tracking-widest text-[var(--neutral-900)] text-xs">
                Join the Adventure!
              </div>
              <h2 className="text-2xl font-bold text-[var(--neutral-900)]">Create an explorer account</h2>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">Email Address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl border-2 border-[var(--neutral-300)] bg-[var(--neutral-0)] px-4 py-3.5 outline-none focus:border-[var(--neutral-1000)] transition-all text-sm text-[var(--neutral-900)]"
                  placeholder="explorer@valley.com"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border-2 border-[var(--neutral-300)] bg-[var(--neutral-0)] px-4 py-3.5 outline-none focus:border-[var(--neutral-1000)] transition-all text-sm text-[var(--neutral-900)]"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">Confirm Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border-2 border-[var(--neutral-300)] bg-[var(--neutral-0)] px-4 py-3.5 outline-none focus:border-[var(--neutral-1000)] transition-all text-sm text-[var(--neutral-900)]"
                  placeholder="Repeat your password"
                  required
                />
              </label>

              {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-full bg-[var(--neutral-1000)] py-4 font-bold text-white shadow-sm hover:bg-[var(--neutral-900)] transition-all text-sm cursor-pointer mt-4"
              >
                Sign Up & Customize
              </button>
            </form>

            <div className="my-6 flex items-center justify-between gap-4">
              <hr className="w-full border-[var(--neutral-200)]" />
              <span className="text-xs font-bold text-[var(--neutral-400)] uppercase">or</span>
              <hr className="w-full border-[var(--neutral-200)]" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full rounded-full border-2 border-[var(--neutral-300)] py-3.5 font-bold text-[var(--neutral-700)] hover:bg-[var(--neutral-50)] hover:border-[var(--neutral-1000)] transition-all text-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🌐</span> Continue with Google
            </button>

            <p className="text-center text-xs text-[var(--neutral-500)] mt-8">
              Already have an account?{" "}
              <span onClick={() => {
                setError("");
                setStep("returning");
              }} className="font-bold text-[var(--neutral-900)] underline cursor-pointer">
                Sign in
              </span>
            </p>
          </section>
        )}

        {/* STEP 3: CHARACTER CUSTOMIZATION (character-creation) */}
        {step === "creation" && (
          <section className="rounded-[2.5rem] border-2 border-[var(--neutral-1000)] bg-[var(--neutral-0)] p-6 shadow-sm animate-scale-up max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep("splash")}
                className="text-xs font-bold text-[var(--neutral-500)] hover:text-[var(--neutral-900)] cursor-pointer"
              >
                ← Back
              </button>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">Customizer</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Left Column: Preview area */}
              <div className="md:col-span-2 flex flex-col items-center justify-center p-4 border-2 border-[var(--neutral-300)] rounded-2xl bg-[var(--neutral-50)] text-center min-h-[250px]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)] mb-4">Preview</h4>
                <CabbitVectorPreview earStyle={earStyle} eyeStyle={eyeStyle} furColor={furColor} />
                <p className="text-[10px] text-[var(--neutral-500)] font-medium mt-3">Updates as you customize</p>
              </div>

              {/* Right Column: Controls area */}
              <form onSubmit={handleConfirmCustomization} className="md:col-span-3 space-y-5">
                <h3 className="text-lg font-bold text-[var(--neutral-900)]">Create Your Cabbit</h3>
                
                {/* Cabbit Name */}
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">Cabbit Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim()) setError("");
                    }}
                    className="rounded-xl border-2 border-[var(--neutral-300)] bg-[var(--neutral-0)] px-3.5 py-2.5 outline-none focus:border-[var(--neutral-1000)] transition-all text-xs text-[var(--neutral-900)]"
                    placeholder="e.g. Pip, Mochi, Sprout..."
                    maxLength={15}
                  />
                </label>

                {/* Ear Style */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">Ear Style</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(["floppy", "pointy", "round"] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setEarStyle(style)}
                        className={`rounded-xl border-2 py-2.5 text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                          earStyle === style
                            ? "border-[var(--neutral-1000)] bg-[var(--neutral-1000)] text-white"
                            : "border-[var(--neutral-300)] bg-[var(--neutral-0)] text-[var(--neutral-700)] hover:border-[var(--neutral-1000)]"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eye Style */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">Eye Style</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(["wide", "sleepy", "sparkle"] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setEyeStyle(style)}
                        className={`rounded-xl border-2 py-2.5 text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                          eyeStyle === style
                            ? "border-[var(--neutral-1000)] bg-[var(--neutral-1000)] text-white"
                            : "border-[var(--neutral-300)] bg-[var(--neutral-0)] text-[var(--neutral-700)] hover:border-[var(--neutral-1000)]"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fur Accent colors */}
                <div className="space-y-1.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">Fur Accent</span>
                    <span className="text-[9px] text-[var(--neutral-400)] leading-none mt-0.5 font-semibold">Applied to cheeks, ears & tail tip</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {(["cream", "tan", "rust", "sage", "dusk", "midnight"] as const).map((color) => {
                      const colorHexMap = {
                        cream: "bg-[#fcf6eb]",
                        tan: "bg-[#d7b594]",
                        rust: "bg-[#ac3232]",
                        sage: "bg-[#76a5af]",
                        dusk: "bg-[#3d5e72]",
                        midnight: "bg-[#111118]",
                      };
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFurColor(color)}
                          className={`h-8 w-8 rounded-full border-2 transition-all cursor-pointer relative ${colorHexMap[color]} ${
                            furColor === color ? "border-[var(--neutral-1000)] scale-110 shadow-sm" : "border-[var(--neutral-300)]"
                          }`}
                          title={color}
                        >
                          {furColor === color && (
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white mix-blend-difference">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Keepsake */}
                <label className="grid gap-1.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">Starting Keepsake</span>
                    <span className="text-[9px] text-[var(--neutral-400)] leading-none mt-0.5 font-medium">Describe a cosmetic item (scarf, ribbon, pin...)</span>
                  </div>
                  <input
                    type="text"
                    value={keepsake}
                    onChange={(e) => setKeepsake(e.target.value)}
                    className="rounded-xl border-2 border-[var(--neutral-300)] bg-[var(--neutral-0)] px-3.5 py-2.5 outline-none focus:border-[var(--neutral-1000)] transition-all text-xs text-[var(--neutral-900)]"
                    placeholder="e.g. a red knitted scarf..."
                    maxLength={30}
                  />
                </label>

                {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                {/* CTAs */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[var(--neutral-1000)] py-3.5 font-bold text-white shadow-sm hover:bg-[var(--neutral-900)] transition-all text-xs cursor-pointer"
                  >
                    Confirm & Start Exploring →
                  </button>
                  <button
                    type="button"
                    onClick={handleSkipCustomization}
                    className="w-full text-center text-xs font-bold text-[var(--neutral-400)] hover:text-[var(--neutral-900)] cursor-pointer py-1"
                  >
                    Skip customization for now
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* STEP 3.5: KEEPSAKE REVEAL (Figma: starting-keepsake-generated) */}
        {step === "keepsake-reveal" && keepsake.trim().length > 0 && (
          <section className="rounded-[2.5rem] border-2 border-[var(--neutral-1000)] bg-[var(--neutral-0)] p-6 shadow-sm animate-scale-up max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep("creation")}
                className="text-xs font-bold text-[var(--neutral-500)] hover:text-[var(--neutral-900)] cursor-pointer"
              >
                ← Back
              </button>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)]">Keepsake Created</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Left Column: Preview area */}
              <div className="md:col-span-2 flex flex-col items-center justify-center p-4 border-2 border-[var(--neutral-300)] rounded-2xl bg-[var(--neutral-50)] text-center min-h-[250px]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-500)] mb-4">Preview</h4>
                <div className="relative">
                  <CabbitVectorPreview earStyle={earStyle} eyeStyle={eyeStyle} furColor={furColor} keepsakeText={keepsake} />
                  <div className="absolute top-0 right-0 bg-[var(--neutral-1000)] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider rotate-12">
                    Keepsake equipped
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1 rounded-full text-green-700">
                  <span className="text-xs font-bold">✓ Keepsake equipped!</span>
                </div>
              </div>

              {/* Right Column: Generated Item Card */}
              <div className="md:col-span-3 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--neutral-500)]">Starting Keepsake</span>
                    <h2 className="text-2xl font-black text-[var(--neutral-900)] leading-tight mt-1">
                      {parseKeepsake(keepsake)?.title}
                    </h2>
                    <span className="text-[10px] text-[var(--neutral-500)] font-medium italic">Generated from your description</span>
                  </div>

                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-[var(--neutral-300)] bg-[var(--neutral-5)] flex flex-col items-center justify-center text-center">
                    <span className="text-4xl animate-bounce">{parseKeepsake(keepsake)?.emoji}</span>
                    <span className="text-[9px] font-extrabold text-[var(--neutral-500)] uppercase tracking-wider mt-1">Generated item</span>
                  </div>

                  <p className="text-xs leading-relaxed text-[var(--neutral-700)]">
                    {parseKeepsake(keepsake)?.description}
                  </p>

                  <hr className="border-[var(--neutral-200)]" />

                  {/* Properties Row */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--neutral-500)]">Item Properties</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-[var(--neutral-50)] border border-[var(--neutral-300)] px-2 py-0.5 text-[10px] font-bold text-[var(--neutral-700)]">
                        Cosmetic Only
                      </span>
                      <span className="rounded-md bg-[var(--neutral-50)] border border-[var(--neutral-300)] px-2 py-0.5 text-[10px] font-bold text-[var(--neutral-700)]">
                        {parseKeepsake(keepsake)?.slot}
                      </span>
                      <span className="rounded-md bg-[var(--neutral-50)] border border-[var(--neutral-300)] px-2 py-0.5 text-[10px] font-bold text-[var(--neutral-700)]">
                        Tradeable
                      </span>
                      <span className="rounded-md bg-[var(--neutral-50)] border border-[var(--neutral-300)] px-2 py-0.5 text-[10px] font-bold text-[var(--neutral-700)]">
                        Unique
                      </span>
                    </div>
                  </div>

                  {/* Reactions row */}
                  <div className="flex gap-4 pt-1">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-md">❤️</span>
                      <span className="text-[9px] font-bold text-[var(--neutral-500)] uppercase">Cozy</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-md">☀️</span>
                      <span className="text-[9px] font-bold text-[var(--neutral-500)] uppercase">Warm</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-md">⭐</span>
                      <span className="text-[9px] font-bold text-[var(--neutral-500)] uppercase">Rare</span>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-6 space-y-2">
                  <button
                    onClick={() => setStep("welcome")}
                    className="w-full rounded-full bg-[var(--neutral-1000)] py-3.5 font-bold text-white shadow-sm hover:bg-[var(--neutral-900)] transition-all text-xs cursor-pointer"
                  >
                    Start Exploring →
                  </button>
                  <button
                    onClick={() => setStep("creation")}
                    className="w-full text-center text-xs font-bold text-[var(--neutral-400)] hover:text-[var(--neutral-900)] cursor-pointer py-1"
                  >
                    Change keepsake description
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 4: LOGIN SUCCESS/WELCOME (login-welcome) */}
        {step === "welcome" && (
          <section className="rounded-[2.5rem] border-2 border-[var(--neutral-1000)] bg-[var(--neutral-0)] p-8 shadow-sm flex flex-col items-center justify-between text-center min-h-[500px] animate-scale-up">
            <div className="space-y-1">
              <span className="text-xxs font-bold uppercase tracking-widest text-[var(--neutral-500)]">Welcome to Cabbits</span>
              <h2 className="text-2xl font-black text-[var(--neutral-1000)] uppercase tracking-wide">✦ Your Adventure Begins! ✦</h2>
            </div>

            <div className="my-6 flex flex-col items-center">
              <CabbitVectorPreview earStyle={earStyle} eyeStyle={eyeStyle} furColor={furColor} keepsakeText={keepsake} />
              <div className="border border-[var(--neutral-1000)] bg-[var(--neutral-50)] rounded-full px-3 py-1 mt-3 text-xxs font-extrabold text-[var(--neutral-900)] uppercase tracking-wider">
                {name || companion?.name || "Pip"} is ready
              </div>
            </div>

            <p className="text-xs leading-6 text-[var(--neutral-700)] max-w-sm">
              Your Cabbit is ready. Explore the world, read stories, and discover nature together.
            </p>

            <div className="w-full max-w-xs py-4 border-y border-[var(--neutral-200)] my-3 flex flex-col gap-2.5 text-left">
              <div className="flex items-center gap-3 text-xs text-[var(--neutral-700)]">
                <span className="text-green-600 font-bold shrink-0">✓</span>
                <span className="font-semibold">Explore Locations</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--neutral-700)]">
                <span className="text-green-600 font-bold shrink-0">✓</span>
                <span className="font-semibold">Read Stories</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--neutral-700)]">
                <span className="text-green-600 font-bold shrink-0">✓</span>
                <span className="font-semibold">Collect Discoveries</span>
              </div>
            </div>

            <div className="w-full space-y-2 max-w-sm mt-2">
              <button
                onClick={() => router.replace("/")}
                className="w-full rounded-full bg-[var(--neutral-1000)] py-4 font-bold text-white shadow-sm hover:bg-[var(--neutral-900)] active:scale-97 transition-all text-sm cursor-pointer"
              >
                Start Exploring →
              </button>
              <p className="text-[10px] text-[var(--neutral-400)]">You can customize your Cabbit anytime</p>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
