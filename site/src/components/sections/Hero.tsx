"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FRAME_COUNT = 169;

const annotations = [
  {
    id: "card-1",
    show: 0.08,
    hide: 0.28,
    title: "Arc Reactor Mk. VII",
    description:
      "Self-sustaining palladium core generating 8 gigajoules per second. Clean energy output sufficient to power a small city — or a suit of armor.",
    position: "left" as const,
    stat: "8 GJ/s",
    statLabel: "Power Output",
  },
  {
    id: "card-2",
    show: 0.33,
    hide: 0.55,
    title: "J.A.R.V.I.S. Neural Net",
    description:
      "Advanced natural language AI system with real-time threat analysis, environmental scanning, and predictive combat modeling across 14 million outcomes.",
    position: "right" as const,
    stat: "14M+",
    statLabel: "Outcome Analysis",
  },
  {
    id: "card-3",
    show: 0.60,
    hide: 0.82,
    title: "Vibranium-Alloy Exoskeleton",
    description:
      "Nano-particle armor with self-healing capabilities. Mach 5 flight ceiling, 200+ integrated weapon systems, and full atmospheric re-entry protection.",
    position: "left" as const,
    stat: "Mach 5",
    statLabel: "Max Velocity",
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
    if (index === lastFrameRef.current) return;
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
    lastFrameRef.current = -1;
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

        // 1. Pick and draw frame
        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(progress * FRAME_COUNT)
        );
        drawFrame(frameIndex);

        // 2. Hero text fade + parallax
        if (heroTextRef.current) {
          const opacity = Math.max(0, 1 - progress / 0.08);
          heroTextRef.current.style.opacity = String(opacity);
          heroTextRef.current.style.transform = `translateY(${progress * 60}px) scale(${1 - progress * 0.15})`;
        }

        // 3. Annotation card visibility
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
      id="arc-reactor"
      style={{ height: "400vh" }}
      className="scroll-animation relative"
    >
      {/* Loading overlay — Arc Reactor boot sequence */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Arc Reactor spinner */}
            <div className="mb-8 relative">
              <motion.div
                className="w-16 h-16 rounded-full border-2 border-sky-500/30"
                style={{ borderTopColor: "#38bdf8" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-sky-400/60 arc-glow" />
              </div>
            </div>
            <div className="w-64 h-1 rounded-full bg-zinc-800 overflow-hidden">
              <motion.div
                className="h-full loading-bar rounded-full"
                animate={{ width: `${loadProgress * 100}%` }}
                transition={{ duration: 0.15, ease: "linear" }}
              />
            </div>
            <p className="mt-4 text-xs tracking-[0.3em] text-zinc-500 uppercase font-mono">
              Initializing J.A.R.V.I.S. … {Math.round(loadProgress * 100)}%
            </p>
            <p className="mt-1 text-[10px] tracking-wider text-zinc-600 font-mono">
              STARK INDUSTRIES DEFENSE SYSTEMS
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen gpu-layer">
        {/* Canvas */}
        <canvas ref={canvasRef} className="h-full w-full gpu-canvas" />

        {/* Vignette overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Hero text overlay */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6"
          style={{ willChange: "opacity, transform" }}
        >
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/5 px-4 py-1.5 text-[10px] font-medium tracking-[0.25em] text-sky-300 uppercase backdrop-blur-md mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 20 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Stark Industries Classified
          </motion.span>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-8xl font-bold leading-[1.0] tracking-tighter text-white max-w-[16ch]"
            initial={{ opacity: 0, y: 40 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, type: "spring", stiffness: 80, damping: 20 }}
          >
            I am
            <br />
            <span className="text-gradient-stark">Iron Man</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-base md:text-lg text-zinc-400 max-w-[44ch] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, type: "spring", stiffness: 80, damping: 20 }}
          >
            Genius. Billionaire. Playboy. Philanthropist.
            <br className="hidden md:block" />
            The suit is the next step in human evolution.
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-12 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
          >
            <span className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase font-medium">
              Scroll to deploy
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-6 w-4 rounded-full border-2 border-zinc-600 flex justify-center pt-1"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-1.5 rounded-full bg-zinc-500"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Annotation cards — Iron Man tech specs */}
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
              <div className="bg-black/60 backdrop-blur-2xl border border-white/8 rounded-[20px] p-6 max-md:p-4">
                {/* Stat header */}
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-2xl font-bold text-gradient-stark leading-none">
                    {card.stat}
                  </span>
                  <span className="text-[10px] tracking-wider text-zinc-500 uppercase font-mono pb-0.5">
                    {card.statLabel}
                  </span>
                </div>
                <h3 className="text-base font-semibold tracking-tight text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {card.description}
                </p>
                {/* Tech accent line */}
                <div className="mt-4 h-px w-full bg-gradient-to-r from-red-500/40 via-amber-500/40 to-transparent" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
