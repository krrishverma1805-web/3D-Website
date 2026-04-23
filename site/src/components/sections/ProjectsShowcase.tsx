"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FRAME_COUNT = 99;

const projects = [
  {
    id: "proj-1",
    show: 0.04,
    hide: 0.17,
    title: "Immersive Landing Pages",
    description:
      "Full-screen scroll-driven experiences that tell your brand story through motion, depth, and cinematic pacing.",
    tag: "Web Design",
  },
  {
    id: "proj-2",
    show: 0.20,
    hide: 0.33,
    title: "3D Product Showcases",
    description:
      "Interactive product reveals using pre-rendered frame sequences — the same technique used by Apple and top-tier agencies.",
    tag: "E-Commerce",
  },
  {
    id: "proj-3",
    show: 0.36,
    hide: 0.49,
    title: "Brand Identity Systems",
    description:
      "Complete visual language systems — from typography and color to motion principles and component libraries.",
    tag: "Branding",
  },
  {
    id: "proj-4",
    show: 0.52,
    hide: 0.64,
    title: "Data Visualization",
    description:
      "Complex datasets transformed into intuitive, animated visual stories that make information feel alive.",
    tag: "Dashboard",
  },
  {
    id: "proj-5",
    show: 0.67,
    hide: 0.78,
    title: "Creative Portfolios",
    description:
      "Bespoke portfolio sites that showcase creative work through scroll-driven narrative and premium interactions.",
    tag: "Portfolio",
  },
];

export function ProjectsShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const prevVisibleIdsRef = useRef("");
  const introOpacityRef = useRef(1);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [ctaVisible, setCtaVisible] = useState(false);

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/tunnel-frames/frame_${String(i).padStart(4, "0")}.jpg`;
      img.onload = () => {
        loadedCount++;
        setLoadProgress(loadedCount / FRAME_COUNT);
        if (loadedCount === FRAME_COUNT) {
          setLoaded(true);
        }
      };
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, []);

  // Draw frame with cover-fit
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = framesRef.current[index];
    if (!canvas || !ctx || !img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let drawW: number, drawH: number;

    if (window.innerWidth > 768) {
      if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
      }
    } else {
      if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
      }
      drawW *= 1.3;
      drawH *= 1.3;
    }

    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Resize canvas for DPR
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }, []);

  // Scroll handler
  useEffect(() => {
    if (!loaded) return;

    resizeCanvas();
    drawFrame(0);

    const handleResize = () => {
      resizeCanvas();
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollableHeight = section.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollableHeight));
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(progress * FRAME_COUNT)
      );
      drawFrame(frameIndex);
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) {
          tickingRef.current = false;
          return;
        }

        const rect = section.getBoundingClientRect();
        const scrollableHeight = section.offsetHeight - window.innerHeight;
        const progress = Math.min(
          1,
          Math.max(0, -rect.top / scrollableHeight)
        );

        // 1. Draw frame
        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(progress * FRAME_COUNT)
        );
        drawFrame(frameIndex);

        // 2. Intro text fade (first 6%)
        if (introOverlayRef.current) {
          const newIntroOpacity = Math.max(0, 1 - progress / 0.06);
          if (Math.abs(newIntroOpacity - introOpacityRef.current) > 0.01) {
            introOpacityRef.current = newIntroOpacity;
            introOverlayRef.current.style.opacity = String(newIntroOpacity);
          }
        }

        // 3. Project card visibility
        const newVisible = new Set<string>();
        for (const proj of projects) {
          if (progress >= proj.show && progress <= proj.hide) {
            newVisible.add(proj.id);
          }
        }
        const newIds = [...newVisible].sort().join(",");
        if (newIds !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = newIds;
          setVisibleCards(new Set(newVisible));
        }

        // 4. CTA overlay at 82%
        const shouldShowCta = progress >= 0.82;
        setCtaVisible((prev) =>
          prev === shouldShowCta ? prev : shouldShowCta
        );

        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [loaded, drawFrame, resizeCanvas]);

  return (
    <section
      ref={sectionRef}
      id="showcase"
      style={{ height: "500vh" }}
      className="scroll-animation relative bg-zinc-950"
    >
      {/* Loading bar — only shows when this section is in view but not loaded */}
      {!loaded && (
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center bg-zinc-950 z-30">
          <div className="w-64 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full loading-bar rounded-full transition-all duration-100"
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>
          <p className="mt-4 text-xs tracking-wider text-zinc-500 uppercase font-mono">
            Loading showcase… {Math.round(loadProgress * 100)}%
          </p>
        </div>
      )}

      {loaded && (
        <div
          className="sticky top-0 h-screen"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        >
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="h-full w-full"
            style={{ willChange: "contents", transform: "translateZ(0)" }}
          />

          {/* Intro overlay — fades in first 6% */}
          <div
            ref={introOverlayRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[10px] font-medium tracking-wider text-zinc-400 uppercase backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              Selected Work
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tighter text-white max-w-[20ch]">
              Projects that{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                push boundaries
              </span>
            </h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-[48ch] leading-relaxed">
              Scroll through our cinematic showcase — each project reveals
              itself as you explore.
            </p>
          </div>

          {/* Project cards — dark glassmorphism */}
          {projects.map((proj) => {
            const isVisible = visibleCards.has(proj.id);
            const idx = projects.indexOf(proj);
            const isRight = idx % 2 === 1;

            return (
              <div
                key={proj.id}
                className={`absolute top-1/2 transition-all duration-400 max-w-sm max-md:max-w-[280px] ${
                  isRight
                    ? "right-6 md:right-12 lg:right-20"
                    : "left-6 md:left-12 lg:left-20"
                } ${
                  isVisible
                    ? "-translate-y-1/2 opacity-100"
                    : "-translate-y-[40%] opacity-0 pointer-events-none"
                }`}
              >
                <div className="bg-black/50 backdrop-blur-2xl border border-white/10 rounded-[20px] p-7 max-md:p-4">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-medium tracking-wider text-zinc-400 uppercase mb-3">
                    {proj.tag}
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight text-white mb-2">
                    {proj.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {proj.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* CTA overlay — appears at 82% */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              ctaVisible
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="bg-black/70 backdrop-blur-xl rounded-[20px] border border-white/10 p-10 max-w-md text-center max-md:mx-6 max-md:p-6">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tighter text-white mb-3">
                Let&apos;s build yours
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400 mb-6">
                Ready to create a scroll-driven experience that stops people in
                their tracks?
              </p>
              <a
                href="#contact"
                className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Start a Project →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
