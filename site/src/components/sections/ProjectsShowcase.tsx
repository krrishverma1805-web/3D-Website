"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const FRAME_COUNT = 169;

const suits = [
  { id: "suit-1", show: 0.04, hide: 0.17, title: "Mark I", subtitle: "The Escape", description: "Built in a cave. With a box of scraps. The crude prototype forged to break free from the Ten Rings.", year: "2008" },
  { id: "suit-2", show: 0.20, hide: 0.33, title: "Mark III", subtitle: "The Icon", description: "Red and gold. The suit that made Iron Man a legend. First to integrate repulsor flight and HUD targeting.", year: "2008" },
  { id: "suit-3", show: 0.36, hide: 0.49, title: "Mark XLII", subtitle: "Prehensile Armor", description: "Autonomous assembly via subcutaneous implants. Each segment operates independently — the suit finds its pilot.", year: "2013" },
  { id: "suit-4", show: 0.52, hide: 0.64, title: "Mark L", subtitle: "Bleeding Edge", description: "Nano-particle technology stored in the arc reactor housing. Morphs into any configuration in milliseconds.", year: "2018" },
  { id: "suit-5", show: 0.67, hide: 0.78, title: "Mark LXXXV", subtitle: "Endgame", description: "The final suit. Designed to wield all six Infinity Stones. The armor that saved the universe.", year: "2023" },
];

export function ProjectsShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const cardElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardStateRef = useRef<boolean[]>([false, false, false, false, false]);
  const introOpRef = useRef(1);
  const ctaStateRef = useRef(false);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    let count = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/tunnel-frames/frame_${String(i).padStart(4, "0")}.jpg`;
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

        // Intro — direct DOM
        if (introRef.current) {
          const op = Math.max(0, 1 - p / 0.06);
          if (Math.abs(op - introOpRef.current) > 0.01) {
            introOpRef.current = op;
            introRef.current.style.opacity = String(op);
            introRef.current.style.transform = `translateY(${p * 50}px)`;
          }
        }

        // Cards — direct DOM, no setState
        for (let i = 0; i < suits.length; i++) {
          const suit = suits[i];
          const el = cardElsRef.current[i];
          if (!el) continue;
          const vis = p >= suit.show && p <= suit.hide;
          if (vis !== cardStateRef.current[i]) {
            cardStateRef.current[i] = vis;
            el.style.opacity = vis ? "1" : "0";
            el.style.transform = vis ? "translateY(-50%)" : "translateY(-40%)";
            el.style.pointerEvents = vis ? "auto" : "none";
          }
        }

        // CTA — direct DOM
        if (ctaRef.current) {
          const show = p >= 0.82;
          if (show !== ctaStateRef.current) {
            ctaStateRef.current = show;
            ctaRef.current.style.opacity = show ? "1" : "0";
            ctaRef.current.style.pointerEvents = show ? "auto" : "none";
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
    <section ref={sectionRef} id="defense" style={{ height: "500vh" }} className="scroll-animation relative bg-[#050505]">
      {!loaded && (
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center bg-[#050505] z-30">
          <div className="w-48 h-[2px] rounded-full bg-zinc-800/60 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${loadProgress * 100}%`, background: "linear-gradient(to right, #d4a017, #f5e6c8)", transition: "width 0.2s linear" }} />
          </div>
          <p className="mt-6 text-[11px] tracking-[0.4em] text-zinc-600 uppercase font-mono">Loading suit archive — {Math.round(loadProgress * 100)}%</p>
        </div>
      )}

      {loaded && (
        <div className="sticky top-0 h-screen gpu-layer">
          <canvas ref={canvasRef} className="h-full w-full gpu-canvas" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 25%, rgba(5,5,5,0.7) 100%)" }} />

          <div ref={introRef} className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6" style={{ willChange: "opacity, transform" }}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-red-500/10 bg-[#0c0c0c] px-5 py-2 text-[9px] font-medium tracking-[0.4em] text-red-300/60 uppercase mb-8">
              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />Suit Archive — Classified
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-[0.95] tracking-tighter text-white max-w-[16ch]">
              The evolution of <span className="text-shimmer-gold">Iron Man</span>
            </h2>
            <p className="mt-6 text-sm md:text-base text-zinc-500 max-w-[42ch] leading-relaxed font-light tracking-wide">
              From a cave in Afghanistan to the Infinity Saga —<br className="hidden md:block" /> every suit tells a story of survival and sacrifice.
            </p>
          </div>

          {suits.map((suit, i) => {
            const isRight = i % 2 === 1;
            return (
              <div key={suit.id} ref={(el) => { cardElsRef.current[i] = el; }}
                className={`absolute top-1/2 max-w-[320px] max-md:max-w-[260px] ${isRight ? "right-6 md:right-12 lg:right-20" : "left-6 md:left-12 lg:left-20"}`}
                style={{ opacity: 0, transform: "translateY(-40%)", pointerEvents: "none", transition: "opacity 0.5s ease, transform 0.5s ease", willChange: "transform, opacity" }}>
                <div className="glass-card-dark p-6 max-md:p-4">
                  <span className="text-[9px] tracking-[0.35em] text-amber-300/50 uppercase font-mono">{suit.year}</span>
                  <h3 className="mt-3 text-xl font-bold tracking-tight text-gradient-gold leading-none mb-1">{suit.title}</h3>
                  <p className="text-xs tracking-[0.15em] text-ivory/70 uppercase font-medium mb-3">{suit.subtitle}</p>
                  <p className="text-xs leading-[1.8] text-zinc-500 font-light">{suit.description}</p>
                  <div className="mt-4 accent-line-red-gold" />
                </div>
              </div>
            );
          })}

          <div ref={ctaRef} className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0, pointerEvents: "none", transition: "opacity 0.8s ease", willChange: "opacity" }}>
            <div className="glass-card-overlay p-12 max-w-md text-center max-md:mx-6 max-md:p-8">
              <p className="text-[9px] tracking-[0.4em] text-zinc-600 uppercase font-mono mb-6">Tony Stark — 1970–2023</p>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-white mb-4 leading-[1.1]">&ldquo;Part of the journey<br />is the end.&rdquo;</h3>
              <p className="text-xs leading-[1.8] text-zinc-500 font-light mb-8">85 suits. One legacy. Heroes aren&apos;t born — they&apos;re built.</p>
              <a href="#avengers" className="inline-block px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600/80 to-yellow-500/80 text-xs tracking-[0.15em] font-semibold text-black uppercase hover:from-amber-500/90 hover:to-yellow-400/90 transition-all duration-300">Avengers, Assemble</a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
