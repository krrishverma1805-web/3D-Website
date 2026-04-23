"use client";

import {
  AnimatedSection,
  AnimatedItem,
} from "@/components/ui/AnimatedSection";

export function FinalCTA() {
  return (
    <section
      id="contact"
      className="px-6 py-24 md:px-8 md:py-40 bg-zinc-950 relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.15) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-[1400px] relative">
        <AnimatedSection className="text-center">
          <AnimatedItem>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tighter text-white max-w-[20ch] mx-auto">
              Ready to build something{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                extraordinary
              </span>
              ?
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400 max-w-[50ch] mx-auto">
              Let&apos;s create scroll-driven experiences that make people stop
              and stare. No flat pages, no shortcuts — just premium web.
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#"
                className="px-8 py-4 rounded-2xl bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 transition-colors"
              >
                Start a Project →
              </a>
              <a
                href="#"
                className="px-8 py-4 rounded-2xl border border-zinc-700 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                View Work
              </a>
            </div>
          </AnimatedItem>
        </AnimatedSection>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © 2025 Studio. Crafted with precision.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "GitHub", "Dribbble"].map((link) => (
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
