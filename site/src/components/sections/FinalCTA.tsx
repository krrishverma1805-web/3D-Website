"use client";

import {
  AnimatedSection,
  AnimatedItem,
} from "@/components/ui/AnimatedSection";

export function FinalCTA() {
  return (
    <section
      id="avengers"
      className="px-6 py-28 md:px-8 md:py-48 bg-[#050505] relative overflow-hidden"
    >
      {/* Subtle gold glow */}
      <div className="absolute inset-0 opacity-15" style={{
        background: "radial-gradient(ellipse at 50% 40%, rgba(212,160,23,0.08) 0%, transparent 50%)",
      }} />

      <div className="mx-auto max-w-[900px] relative">
        <AnimatedSection className="text-center">
          <AnimatedItem>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/10 bg-amber-500/5 px-5 py-2 text-[9px] font-medium tracking-[0.4em] text-amber-300/50 uppercase backdrop-blur-md">
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
              Avengers Initiative
            </span>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="mt-10 text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tighter text-white max-w-[16ch] mx-auto">
              &ldquo;I love you{" "}
              <span className="text-shimmer-gold">3000</span>&rdquo;
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="mt-8 text-sm md:text-base leading-relaxed text-zinc-500 max-w-[42ch] mx-auto font-light tracking-wide">
              Tony Stark changed the world — not with his armor, but with his heart.
              <br className="hidden md:block" />
              <span className="text-champagne/50">The legacy of Iron Man lives on in every hero who stands up.</span>
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#"
                className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-600/80 to-yellow-500/80 text-xs tracking-[0.15em] font-semibold text-black uppercase hover:from-amber-500/90 hover:to-yellow-400/90 transition-all duration-300"
              >
                Join the Initiative
              </a>
              <a
                href="#arc-reactor"
                className="px-10 py-4 rounded-full border border-white/[0.06] text-xs tracking-[0.15em] font-medium text-zinc-400 uppercase hover:bg-white/[0.03] hover:text-white transition-all duration-300"
              >
                Back to Top
              </a>
            </div>
          </AnimatedItem>
        </AnimatedSection>

        {/* Footer */}
        <div className="mt-32 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border border-amber-500/20 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-amber-400/40" />
            </div>
            <p className="text-[10px] tracking-[0.2em] text-zinc-600 uppercase font-mono">
              Stark Industries — All systems operational
            </p>
          </div>
          <div className="flex items-center gap-8">
            {["S.H.I.E.L.D.", "Avengers HQ", "Stark Tower"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[10px] tracking-[0.15em] text-zinc-600 hover:text-champagne transition-colors duration-300 uppercase"
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
