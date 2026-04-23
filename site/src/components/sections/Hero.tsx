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
      "Self-sustaining palladium core generating 8 gigajoules per second. Clean energy sufficient to power a city — or a suit of armor.",
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
      "Advanced natural language AI with real-time threat analysis, environmental scanning, and predictive combat modeling across 14 million outcomes.",
    position: "right" as const,
    stat: "14M+",
    statLabel: "Outcome Analysis",
  },
  {
    id: "card-3",
    show: 0.60,
    hide: 0.82,
    title: "Nano-Particle Exoskeleton",
    description:
      "Self-healing vibranium-alloy armor. Mach 5 flight ceiling, 200+ integrated weapon systems, full atmospheric re-entry protection.",
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

  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, "0")}.jpg`;
      img.onload = () => {
        loadedCount++;
        setLoadProgress(loadedCount / FRAME_COUNT);
        if (loadedCount === FRAME_COUNT) setLoaded(true);
      };
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, []);

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
    if (canvasRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
    }
    if (window.innerWidth <= 768) {
      drawW *= 1.3;
      drawH *= 1.3;
    }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - drawW) / 2, (ch - drawH) / 2, drawW, drawH);
  }, []);

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
      drawFrame(Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT)));
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) { tickingRef.current = false; return; }
        const rect = section.getBoundingClientRect();
        const scrollableHeight = section.offsetHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -rect.top / scrollableHeight));

        drawFrame(Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT)));

        if (heroTextRef.current) {
          const opacity = Math.max(0, 1 - progress / 0.08);
          heroTextRef.current.style.opacity = String(opacity);
          heroTextRef.current.style.transform = `translateY(${progress * 80}px) scale(${1 - progress * 0.12})`;
        }

        const newVisible = new Set<string>();
        for (const card of annotations) {
          if (progress >= card.show && progress <= card.hide) newVisible.add(card.id);
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
    <section ref={sectionRef} id="arc-reactor" style={{ height: "400vh" }} className="scroll-animation relative">
      {/* Loading — JARVIS boot */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]"
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-10 relative">
              <motion.div
                className="w-20 h-20 rounded-full border border-amber-500/20"
                style={{ borderTopColor: "rgba(212,160,23,0.6)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border border-amber-500/10"
                style={{ borderBottomColor: "rgba(245,198,66,0.4)" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-400/50" style={{
                  boxShadow: "0 0 20px 4px rgba(212,160,23,0.3)"
                }} />
              </div>
            </div>
            <div className="w-48 h-[2px] rounded-full bg-zinc-800/60 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(to right, #d4a017, #f5e6c8)" }}
                animate={{ width: `${loadProgress * 100}%` }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </div>
            <p className="mt-6 text-[11px] tracking-[0.4em] text-zinc-500 uppercase font-mono">
              Initializing J.A.R.V.I.S.
            </p>
            <p className="mt-1 text-[9px] tracking-[0.3em] text-zinc-700 font-mono uppercase">
              {Math.round(loadProgress * 100)}% — Stark Defense Systems
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen gpu-layer">
        <canvas ref={canvasRef} className="h-full w-full gpu-canvas" />

        {/* Cinematic vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,5,0.6) 100%)",
        }} />
        {/* Bottom fade for text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{
          background: "linear-gradient(to top, rgba(5,5,5,0.5), transparent)",
        }} />

        {/* Hero text */}
        <div ref={heroTextRef} className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6" style={{ willChange: "opacity, transform" }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/15 bg-amber-500/5 px-5 py-2 text-[9px] font-medium tracking-[0.4em] text-amber-300/70 uppercase backdrop-blur-md">
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
              Classified — Level 10
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="mt-8 text-5xl md:text-7xl lg:text-[120px] font-bold leading-[0.9] tracking-tighter"
            initial={{ opacity: 0, y: 60 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-white">I am</span>
            <br />
            <span className="text-shimmer-gold">Iron Man</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-8 text-sm md:text-base tracking-[0.08em] text-zinc-400 max-w-[40ch] leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Genius. Billionaire. Playboy. Philanthropist.
            <br className="hidden md:block" />
            <span className="text-champagne/60">The suit is the next step in human evolution.</span>
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-10 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ delay: 2 }}
          >
            <span className="text-[9px] tracking-[0.4em] text-zinc-600 uppercase font-medium">
              Scroll to deploy
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-8 bg-gradient-to-b from-amber-500/40 to-transparent"
            />
          </motion.div>
        </div>

        {/* Annotation cards — premium glassmorphic */}
        {annotations.map((card) => {
          const isVisible = visibleCards.has(card.id);
          return (
            <div
              key={card.id}
              className={`absolute top-1/2 max-w-[340px] max-md:max-w-[260px] ${
                card.position === "left"
                  ? "left-6 md:left-12 lg:left-20"
                  : "right-6 md:right-12 lg:right-20"
              }`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateY(-50%) scale(1)"
                  : "translateY(-40%) scale(0.96)",
                pointerEvents: isVisible ? "auto" : "none",
                transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "transform, opacity",
              }}
            >
              <div className="bg-black/50 backdrop-blur-2xl border border-white/[0.06] rounded-2xl p-6 max-md:p-4">
                {/* Stat */}
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-3xl font-bold text-gradient-gold leading-none tracking-tight">
                    {card.stat}
                  </span>
                  <span className="text-[9px] tracking-[0.3em] text-zinc-600 uppercase font-mono pb-1">
                    {card.statLabel}
                  </span>
                </div>
                <h3 className="text-sm font-semibold tracking-wide text-ivory uppercase mb-2">
                  {card.title}
                </h3>
                <p className="text-xs leading-[1.8] text-zinc-500">
                  {card.description}
                </p>
                <div className="mt-4 accent-line-gold" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
