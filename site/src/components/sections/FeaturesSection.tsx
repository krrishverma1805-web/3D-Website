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
      "Miniaturized arc reactor providing self-sustaining clean energy. Powers the Iron Man suit, Stark Tower, and the next generation of global energy infrastructure.",
    icon: "⚡",
    accent: "from-sky-400 to-cyan-400",
    stat: "3 Billion kWh",
    statLabel: "Annual Output",
  },
  {
    title: "Repulsor & Unibeam Systems",
    description:
      "Palm-mounted repulsor rays for flight stabilization and directed energy combat. Chest-mounted unibeam delivers concentrated 2.5 petawatt blast.",
    icon: "🔥",
    accent: "from-red-500 to-amber-500",
    stat: "2.5 PW",
    statLabel: "Unibeam Power",
  },
  {
    title: "Nano-Particle Armor (Mk. L)",
    description:
      "Self-assembling nanotech suit stored in the arc reactor housing. Morphs into any weapon or shield configuration in under 200 milliseconds.",
    icon: "🛡️",
    accent: "from-amber-400 to-yellow-400",
    stat: "< 200ms",
    statLabel: "Deploy Time",
  },
  {
    title: "F.R.I.D.A.Y. Tactical AI",
    description:
      "Advanced AI co-pilot providing real-time combat analysis, environmental scanning, civilian protection protocols, and Avengers coordination.",
    icon: "🤖",
    accent: "from-violet-400 to-indigo-400",
    stat: "14M+",
    statLabel: "Scenarios / sec",
  },
];

export function FeaturesSection() {
  return (
    <section id="technology" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection className="text-center mb-16">
          <AnimatedItem>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-medium tracking-[0.25em] text-zinc-400 uppercase backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Stark Tech Arsenal
            </span>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="mt-6 text-3xl md:text-5xl font-bold tracking-tighter text-white max-w-[22ch] mx-auto">
              Suit up with{" "}
              <span className="text-gradient-stark">
                next-gen weaponry
              </span>
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="mt-4 text-lg leading-relaxed text-zinc-400 max-w-[50ch] mx-auto">
              Every system in the Iron Man suit is designed, built, and tested
              by Tony Stark. No committees. No compromises.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.05}>
              <AnimatedItem>
                <div className="card-surface p-7 max-md:p-5 group">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold tracking-tight text-white">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-400">
                        {feature.description}
                      </p>
                      {/* Stat */}
                      <div className="mt-4 flex items-end gap-2">
                        <span className="text-xl font-bold text-white leading-none">
                          {feature.stat}
                        </span>
                        <span className="text-[10px] tracking-wider text-zinc-500 uppercase font-mono pb-0.5">
                          {feature.statLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Accent bottom bar */}
                  <motion.div
                    className={`mt-5 h-0.5 rounded-full bg-gradient-to-r ${feature.accent} origin-left opacity-60`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + i * 0.1,
                      duration: 0.8,
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
