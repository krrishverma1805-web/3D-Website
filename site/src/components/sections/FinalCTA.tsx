"use client";

import {
  AnimatedSection,
  AnimatedItem,
} from "@/components/ui/AnimatedSection";

export function FinalCTA() {
  return (
    <section
      id="avengers"
      className="px-6 py-24 md:px-8 md:py-40 bg-zinc-950 relative overflow-hidden"
    >
      {/* Arc Reactor background glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(56,189,248,0.12) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(220,38,38,0.08) 0%, transparent 50%)",
        }}
      />

      <div className="mx-auto max-w-[1400px] relative">
        <AnimatedSection className="text-center">
          <AnimatedItem>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-[10px] font-medium tracking-[0.25em] text-amber-300 uppercase backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Avengers Initiative
            </span>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="mt-6 text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tighter text-white max-w-[20ch] mx-auto">
              &ldquo;I love you{" "}
              <span className="text-gradient-stark">3000</span>&rdquo;
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400 max-w-[50ch] mx-auto">
              Tony Stark changed the world — not with his armor, but with his
              heart. The legacy of Iron Man lives on in every hero who chooses
              to stand up.
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Join the Initiative →
              </a>
              <a
                href="#arc-reactor"
                className="px-8 py-4 rounded-2xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Back to Top
              </a>
            </div>
          </AnimatedItem>
        </AnimatedSection>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full border border-sky-400/40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400/60" />
            </div>
            <p className="text-sm text-zinc-500">
              © 2025 Stark Industries. All systems operational.
            </p>
          </div>
          <div className="flex items-center gap-6">
            {["S.H.I.E.L.D.", "Avengers HQ", "Stark Tower"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
