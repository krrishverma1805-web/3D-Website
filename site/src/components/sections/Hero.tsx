"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FRAME_COUNT = 169;

const annotations = [
  { id: "card-1", show: 0.08, hide: 0.28, title: "Arc Reactor Mk. VII", description: "Self-sustaining palladium core generating 8 gigajoules per second. Clean energy sufficient to power a city — or a suit of armor.", position: "left" as const, stat: "8 GJ/s", statLabel: "Power Output" },
  { id: "card-2", show: 0.33, hide: 0.55, title: "J.A.R.V.I.S. Neural Net", description: "Advanced natural language AI with real-time threat analysis, environmental scanning, and predictive combat modeling across 14 million outcomes.", position: "right" as const, stat: "14M+", statLabel: "Outcome Analysis" },
  { id: "card-3", show: 0.60, hide: 0.82, title: "Nano-Particle Exoskeleton", description: "Self-healing vibranium-alloy armor. Mach 5 flight ceiling, 200+ integrated weapon systems, full atmospheric re-entry protection.", position: "left" as const, stat: "Mach 5", statLabel: "Max Velocity" },
];

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const cardElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardStateRef = useRef<boolean[]>([false, false, false]);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    let count = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, "0")}.jpg`;
      img.onload = () => {
        count++;
        if (count % 17 === 0 || count === FRAME_COUNT) setLoadProgress(count / FRAME_COUNT);
        if (count === FRAME_COUNT) setLoaded(true);
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
    const cw = canvas.width, ch = canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw: number, dh: number;
    if (cr > ir) { dw = cw; dh = cw / ir; } else { dh = ch; dw = ch * ir; }
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // DPR capped at 1 — no retina scaling for video frames
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctxRef.current = canvas.getContext("2d", { alpha: false });
    if (ctxRef.current) ctxRef.current.imageSmoothingEnabled = true;
    lastFrameRef.current = -1;
  }, []);

  useEffect(() => {
    if (!loaded) return;
    resizeCanvas();
    drawFrame(0);

    const handleResize = () => {
      resizeCanvas();
      const s = sectionRef.current;
      if (!s) return;
      const r = s.getBoundingClientRect();
      const sh = s.offsetHeight - window.innerHeight;
      drawFrame(Math.min(FRAME_COUNT - 1, Math.floor(Math.min(1, Math.max(0, -r.top / sh)) * FRAME_COUNT)));
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const s = sectionRef.current;
        if (!s) { tickingRef.current = false; return; }
        const r = s.getBoundingClientRect();
        const sh = s.offsetHeight - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / sh));

        drawFrame(Math.min(FRAME_COUNT - 1, Math.floor(p * FRAME_COUNT)));

        // Hero text — direct DOM only
        if (heroTextRef.current) {
          const o = Math.max(0, 1 - p / 0.08);
          heroTextRef.current.style.opacity = String(o);
          heroTextRef.current.style.transform = `translateY(${p * 80}px)`;
        }

        // Cards — direct DOM only, no setState
        for (let i = 0; i < annotations.length; i++) {
          const card = annotations[i];
          const el = cardElsRef.current[i];
          if (!el) continue;
          const vis = p >= card.show && p <= card.hide;
          if (vis !== cardStateRef.current[i]) {
            cardStateRef.current[i] = vis;
            el.style.opacity = vis ? "1" : "0";
            el.style.transform = vis ? "translateY(-50%)" : "translateY(-40%)";
            el.style.pointerEvents = vis ? "auto" : "none";
          }
        }

        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("scroll", handleScroll); window.removeEventListener("resize", handleResize); };
  }, [loaded, drawFrame, resizeCanvas]);

  return (
    <section ref={sectionRef} id="arc-reactor" style={{ height: "400vh" }} className="scroll-animation relative">
      <AnimatePresence>
        {!loaded && (
          <motion.div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]" exit={{ opacity: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <div className="mb-10 relative">
              <motion.div className="w-20 h-20 rounded-full border border-amber-500/20" style={{ borderTopColor: "rgba(212,160,23,0.6)" }} animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
              <motion.div className="absolute inset-2 rounded-full border border-amber-500/10" style={{ borderBottomColor: "rgba(245,198,66,0.4)" }} animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
              <div className="absolute inset-0 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-amber-400/50" style={{ boxShadow: "0 0 20px 4px rgba(212,160,23,0.3)" }} /></div>
            </div>
            <div className="w-48 h-[2px] rounded-full bg-zinc-800/60 overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(to right, #d4a017, #f5e6c8)" }} animate={{ width: `${loadProgress * 100}%` }} transition={{ duration: 0.2, ease: "linear" }} />
            </div>
            <p className="mt-6 text-[11px] tracking-[0.4em] text-zinc-500 uppercase font-mono">Initializing J.A.R.V.I.S.</p>
            <p className="mt-1 text-[9px] tracking-[0.3em] text-zinc-700 font-mono uppercase">{Math.round(loadProgress * 100)}% — Stark Defense Systems</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-0 h-screen gpu-layer">
        <canvas ref={canvasRef} className="h-full w-full gpu-canvas" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,5,0.6) 100%)" }} />

        <div ref={heroTextRef} className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6" style={{ willChange: "opacity, transform" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/15 bg-[#0c0c0c] px-5 py-2 text-[9px] font-medium tracking-[0.4em] text-amber-300/70 uppercase">
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />Classified — Level 10
            </span>
          </motion.div>
          <motion.h1 className="mt-8 text-5xl md:text-7xl lg:text-[120px] font-bold leading-[0.9] tracking-tighter" initial={{ opacity: 0, y: 60 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
            <span className="text-white">I am</span><br /><span className="text-shimmer-gold">Iron Man</span>
          </motion.h1>
          <motion.p className="mt-8 text-sm md:text-base tracking-[0.08em] text-zinc-400 max-w-[40ch] leading-relaxed font-light" initial={{ opacity: 0, y: 30 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            Genius. Billionaire. Playboy. Philanthropist.<br className="hidden md:block" /><span className="text-champagne/60">The suit is the next step in human evolution.</span>
          </motion.p>
          <motion.div className="absolute bottom-10 flex flex-col items-center gap-3" initial={{ opacity: 0 }} animate={loaded ? { opacity: 1 } : {}} transition={{ delay: 2 }}>
            <span className="text-[9px] tracking-[0.4em] text-zinc-600 uppercase font-medium">Scroll to deploy</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-[1px] h-8 bg-gradient-to-b from-amber-500/40 to-transparent" />
          </motion.div>
        </div>

        {annotations.map((card, i) => (
          <div key={card.id} ref={(el) => { cardElsRef.current[i] = el; }}
            className={`absolute top-1/2 max-w-[340px] max-md:max-w-[260px] ${card.position === "left" ? "left-6 md:left-12 lg:left-20" : "right-6 md:right-12 lg:right-20"}`}
            style={{ opacity: 0, transform: "translateY(-40%)", pointerEvents: "none", transition: "opacity 0.5s ease, transform 0.5s ease", willChange: "transform, opacity" }}>
            <div className="glass-card-dark p-6 max-md:p-4">
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-gradient-gold leading-none tracking-tight">{card.stat}</span>
                <span className="text-[9px] tracking-[0.3em] text-zinc-600 uppercase font-mono pb-1">{card.statLabel}</span>
              </div>
              <h3 className="text-sm font-semibold tracking-wide text-ivory uppercase mb-2">{card.title}</h3>
              <p className="text-xs leading-[1.8] text-zinc-500">{card.description}</p>
              <div className="mt-4 accent-line-gold" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
