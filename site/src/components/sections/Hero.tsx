"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FRAME_COUNT = 169;

const annotations = [
  {
    id: "card-1",
    show: 0.08,
    hide: 0.28,
    title: "Next-Gen Architecture",
    description:
      "Built with cutting-edge frameworks and scroll-driven storytelling that transforms static pages into immersive experiences.",
    position: "left" as const,
  },
  {
    id: "card-2",
    show: 0.33,
    hide: 0.55,
    title: "Cinematic Motion",
    description:
      "Frame-perfect scroll animations powered by a pre-rendered sequence engine — silky smooth on every device.",
    position: "right" as const,
  },
  {
    id: "card-3",
    show: 0.60,
    hide: 0.82,
    title: "Premium Polish",
    description:
      "Neumorphic surfaces, glassmorphic details, physics-based scroll — every pixel tuned for a premium feel.",
    position: "left" as const,
  },
];

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const prevVisibleIdsRef = useRef("");
  const lastFrameRef = useRef(-1);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, "0")}.jpg`;
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

  // Draw a frame with cover-fit — only if frame actually changed
  const drawFrame = useCallback((index: number) => {
    if (index === lastFrameRef.current) return; // skip redundant draws
    lastFrameRef.current = index;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = framesRef.current[index];
    if (!canvas || !ctx || !img || !img.complete) return;

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

    ctx.clearRect(0, 0, cw, ch);
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
    ctxRef.current = canvas.getContext("2d", { alpha: false });
    lastFrameRef.current = -1; // force redraw after resize
  }, []);

  // Scroll handler + resize
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

        // 1. Pick and draw frame (skips if same frame)
        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(progress * FRAME_COUNT)
        );
        drawFrame(frameIndex);

        // 2. Hero text fade (first 8%) — direct DOM
        if (heroTextRef.current) {
          const opacity = Math.max(0, 1 - progress / 0.08);
          heroTextRef.current.style.opacity = String(opacity);
          heroTextRef.current.style.transform = `translateY(${progress * 60}px) scale(${1 - progress * 0.15})`;
        }

        // 3. Annotation card visibility — only setState when changed
        const newVisible = new Set<string>();
        for (const card of annotations) {
          if (progress >= card.show && progress <= card.hide) {
            newVisible.add(card.id);
          }
        }
        const newIds = [...newVisible].sort().join(",");
        if (newIds !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = newIds;
          setVisibleCards(new Set(newVisible));
        }

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
      style={{ height: "400vh" }}
      className="scroll-animation relative"
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-8">
              <motion.div
                className="w-12 h-12 rounded-full border-2 border-zinc-200"
                style={{ borderTopColor: "#6366f1" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="w-64 h-1.5 rounded-full bg-zinc-200 overflow-hidden">
              <motion.div
                className="h-full loading-bar rounded-full"
                animate={{ width: `${loadProgress * 100}%` }}
                transition={{ duration: 0.15, ease: "linear" }}
              />
            </div>
            <p className="mt-4 text-xs tracking-wider text-zinc-400 uppercase font-mono">
              Loading experience… {Math.round(loadProgress * 100)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen gpu-layer">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="h-full w-full gpu-canvas"
        />

        {/* Hero text overlay */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6"
          style={{ willChange: "opacity, transform" }}
        >
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-[10px] font-medium tracking-wider text-zinc-500 uppercase shadow-sm backdrop-blur-md mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 20 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Scroll-Driven Experience
          </motion.span>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tighter text-zinc-950 max-w-[18ch]"
            initial={{ opacity: 0, y: 40 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, type: "spring", stiffness: 80, damping: 20 }}
          >
            The future is built
            <br />
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              one scroll at a time
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-zinc-500 max-w-[48ch] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, type: "spring", stiffness: 80, damping: 20 }}
          >
            Cinematic frame-sequence animation, neumorphic design, and
            physics-based smooth scroll — all in one experience.
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-12 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
          >
            <span className="text-[10px] tracking-wider text-zinc-400 uppercase font-medium">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-6 w-4 rounded-full border-2 border-zinc-300 flex justify-center pt-1"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-1.5 rounded-full bg-zinc-400"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Annotation cards */}
        {annotations.map((card) => {
          const isVisible = visibleCards.has(card.id);
          return (
            <div
              key={card.id}
              className={`absolute top-1/2 transition-all duration-500 ease-out max-w-sm max-md:max-w-[280px] ${
                card.position === "left"
                  ? "left-6 md:left-12 lg:left-20"
                  : "right-6 md:right-12 lg:right-20"
              } ${
                isVisible
                  ? "-translate-y-1/2 opacity-100 scale-100"
                  : "-translate-y-[40%] opacity-0 scale-95 pointer-events-none"
              }`}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="card-surface p-7 max-md:p-4">
                <h3 className="text-lg font-semibold tracking-tight text-zinc-950 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
