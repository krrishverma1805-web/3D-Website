"use client";

import {
  AnimatedSection,
  AnimatedItem,
} from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { motion } from "framer-motion";

const features = [
  {
    title: "Canvas Frame Sequences",
    description:
      "Pre-rendered 3D animations scrubbed through on scroll — the same technique used by Apple, Lusion, and top agency sites.",
    icon: "🎬",
    accent: "from-indigo-500 to-violet-500",
  },
  {
    title: "Physics-Based Scroll",
    description:
      "Lenis smooth scroll with momentum, easing, and Safari-safe defaults. Every interaction feels weighted and intentional.",
    icon: "⚡",
    accent: "from-amber-400 to-orange-500",
  },
  {
    title: "Neumorphic Design",
    description:
      "6-layer shadow stacks, inset highlights, and glassmorphic overlays that make every surface feel tangible.",
    icon: "✨",
    accent: "from-violet-500 to-pink-500",
  },
  {
    title: "Performance First",
    description:
      "RAF throttling, direct DOM updates, passive listeners, DPR-aware canvas — 60fps on every device.",
    icon: "🚀",
    accent: "from-emerald-400 to-teal-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="work" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection className="text-center mb-16">
          <AnimatedItem>
            <EyebrowBadge>How It Works</EyebrowBadge>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="mt-6 text-3xl md:text-5xl font-semibold tracking-tighter text-zinc-950 max-w-[22ch] mx-auto">
              Premium techniques,{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                zero compromise
              </span>
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="mt-4 text-lg leading-relaxed text-zinc-500 max-w-[50ch] mx-auto">
              Every detail is intentional. From the scroll math to the shadow
              stack, nothing is left to chance.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.05}>
              <AnimatedItem>
                <div className="card-surface p-7 max-md:p-4 group hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-2xl">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-zinc-950 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-zinc-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  {/* Accent bottom bar */}
                  <motion.div
                    className={`mt-5 h-1 rounded-full bg-gradient-to-r ${feature.accent} origin-left`}
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
