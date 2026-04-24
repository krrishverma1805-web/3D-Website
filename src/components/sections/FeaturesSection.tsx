"use client";

import {
  AnimatedSection,
  AnimatedItem,
} from "@/components/ui/AnimatedSection";
import { motion } from "framer-motion";

const features = [
  {
    title: "Arc Reactor Technology",
    description:
      "Miniaturized self-sustaining clean energy. Powers the suit, Stark Tower, and the next generation of global infrastructure.",
    stat: "3B kWh",
    statLabel: "Annual Output",
    accent: "from-sky-400 to-cyan-300",
  },
  {
    title: "Repulsor & Unibeam",
    description:
      "Palm-mounted repulsor rays for flight and directed energy. Chest unibeam delivers concentrated 2.5 petawatt blast.",
    stat: "2.5 PW",
    statLabel: "Peak Power",
    accent: "from-red-500/60 to-amber-500/60",
  },
  {
    title: "Nano-Particle Armor",
    description:
      "Self-assembling nanotech stored in the housing. Morphs into any weapon or shield in under 200 milliseconds.",
    stat: "< 200ms",
    statLabel: "Deploy Time",
    accent: "from-amber-400/60 to-yellow-300/60",
  },
  {
    title: "F.R.I.D.A.Y. Tactical AI",
    description:
      "Advanced co-pilot: real-time combat analysis, environmental scanning, civilian protection, Avengers coordination.",
    stat: "14M+",
    statLabel: "Scenarios / sec",
    accent: "from-violet-400/60 to-indigo-400/60",
  },
];

export function FeaturesSection() {
  return (
    <section id="technology" className="px-6 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-[1200px]">
        <AnimatedSection className="text-center mb-20">
          <AnimatedItem>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/10 bg-[#0c0c0c] px-5 py-2 text-[9px] font-medium tracking-[0.4em] text-amber-300/60 uppercase">
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
              Stark Tech Arsenal
            </span>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="mt-8 text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white max-w-[18ch] mx-auto leading-[1.0]">
              Suit up with{" "}
              <span className="text-gradient-gold">
                next-gen weaponry
              </span>
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="mt-5 text-sm md:text-base tracking-wide text-zinc-500 max-w-[44ch] mx-auto leading-relaxed font-light">
              Every system is designed, built, and tested by Tony Stark.
              <br className="hidden md:block" />
              No committees. No compromises. No shortcuts.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.08}>
              <AnimatedItem>
                <div className="card-surface p-8 max-md:p-5 group">
                  {/* Stat top-right */}
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-xs tracking-[0.2em] font-semibold text-ivory uppercase">
                      {feature.title}
                    </h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gradient-gold leading-none tracking-tight">
                        {feature.stat}
                      </span>
                      <span className="block text-[8px] tracking-[0.3em] text-zinc-600 uppercase font-mono mt-1">
                        {feature.statLabel}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-[1.8] text-zinc-500 font-light">
                    {feature.description}
                  </p>
                  {/* Accent bar */}
                  <motion.div
                    className={`mt-6 h-[1px] rounded-full bg-gradient-to-r ${feature.accent} origin-left`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.4 + i * 0.12,
                      duration: 1.2,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </AnimatedItem>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
