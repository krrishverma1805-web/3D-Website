"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const FRAME_COUNT = 169;

const suits = [
  {
    id: "suit-1",
    show: 0.04,
    hide: 0.17,
    title: "Mark I — The Escape",
    description:
      "Built in a cave. With a box of scraps. The crude prototype that started it all — a desperate suit of armor forged to break free from the Ten Rings.",
    tag: "Origins",
    year: "2008",
  },
  {
    id: "suit-2",
    show: 0.20,
    hide: 0.33,
    title: "Mark III — The Icon",
    description:
      "Red and gold. The suit that made Iron Man a legend. First to integrate repulsor flight, HUD targeting, and Jarvis co-pilot systems.",
    tag: "Classic",
    year: "2008",
  },
  {
    id: "suit-3",
    show: 0.36,
    hide: 0.49,
    title: "Mark XLII — Autonomous Assembly",
    description:
      "Prehensile armor that flies to Tony piece by piece via subcutaneous implants. Each segment operates independently — the suit finds its pilot.",
    tag: "Extremis Era",
    year: "2013",
  },
  {
    id: "suit-4",
    show: 0.52,
    hide: 0.64,
    title: "Mark L — Bleeding Edge",
    description:
      "Nano-particle technology stored in the arc reactor housing. Morphs into any weapon, shield, or wing configuration in milliseconds. The ultimate suit.",
    tag: "Nanotech",
    year: "2018",
  },
  {
    id: "suit-5",
    show: 0.67,
    hide: 0.78,
    title: "Mark LXXXV — Endgame",
    description:
      "The final suit. Designed to wield all six Infinity Stones. A masterpiece of nanotechnology and sacrifice — the armor that saved the universe.",
    tag: "The Last Suit",
    year: "2023",
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
  const lastFrameRef = useRef(-1);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const cardRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
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

  // Draw frame — skip if same frame
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

        // 2. Intro text fade
        if (introOverlayRef.current) {
          const newIntroOpacity = Math.max(0, 1 - progress / 0.06);
          if (Math.abs(newIntroOpacity - introOpacityRef.current) > 0.005) {
            introOpacityRef.current = newIntroOpacity;
            introOverlayRef.current.style.opacity = String(newIntroOpacity);
            introOverlayRef.current.style.transform = `translateY(${progress * 40}px) scale(${1 - progress * 0.1})`;
          }
        }

        // 3. Suit card visibility — direct DOM
        for (const suit of suits) {
          const el = cardRefsMap.current.get(suit.id);
          if (!el) continue;
          const isVisible = progress >= suit.show && progress <= suit.hide;
          if (isVisible) {
            el.style.opacity = "1";
            el.style.transform = "translateY(-50%) scale(1)";
            el.style.pointerEvents = "auto";
          } else {
            el.style.opacity = "0";
            el.style.transform = "translateY(-40%) scale(0.95)";
            el.style.pointerEvents = "none";
          }
        }

        // 4. CTA overlay at 82%
        const shouldShowCta = progress >= 0.82;
        setCtaVisible((prev) =>
          prev === shouldShowCta ? prev : shouldShowCta
        );

        prevVisibleIdsRef.current = suits
          .filter((s) => progress >= s.show && progress <= s.hide)
          .map((s) => s.id)
          .sort()
          .join(",");

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
      id="defense"
      style={{ height: "500vh" }}
      className="scroll-animation relative bg-zinc-950"
    >
      {/* Loading bar */}
      {!loaded && (
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center bg-zinc-950 z-30">
          <div className="w-64 h-1 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full loading-bar rounded-full"
              style={{
                width: `${loadProgress * 100}%`,
                transition: "width 0.15s linear",
              }}
            />
          </div>
          <p className="mt-4 text-xs tracking-[0.3em] text-zinc-500 uppercase font-mono">
            Loading suit archive… {Math.round(loadProgress * 100)}%
          </p>
        </div>
      )}

      {loaded && (
        <div className="sticky top-0 h-screen gpu-layer">
          {/* Canvas */}
          <canvas ref={canvasRef} className="h-full w-full gpu-canvas" />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
            }}
          />

          {/* Intro overlay */}
          <div
            ref={introOverlayRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6"
            style={{ willChange: "opacity, transform" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-[10px] font-medium tracking-[0.25em] text-red-300 uppercase backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Suit Archive — Classified
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tighter text-white max-w-[20ch]">
              The evolution of{" "}
              <span className="text-gradient-stark">Iron Man</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-[48ch] leading-relaxed">
              From a cave in Afghanistan to the Infinity Saga — every suit
              tells a story of survival, invention, and sacrifice.
            </p>
          </div>

          {/* Suit cards */}
          {suits.map((suit) => {
            const idx = suits.indexOf(suit);
            const isRight = idx % 2 === 1;

            return (
              <div
                key={suit.id}
                ref={(el) => {
                  if (el) cardRefsMap.current.set(suit.id, el);
                }}
                className={`absolute top-1/2 max-w-sm max-md:max-w-[280px] ${
                  isRight
                    ? "right-6 md:right-12 lg:right-20"
                    : "left-6 md:left-12 lg:left-20"
                }`}
                style={{
                  opacity: 0,
                  transform: "translateY(-40%) scale(0.95)",
                  pointerEvents: "none",
                  transition:
                    "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  willChange: "transform, opacity",
                }}
              >
                <div className="bg-black/60 backdrop-blur-2xl border border-white/8 rounded-[20px] p-6 max-md:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-medium tracking-wider text-red-300 uppercase">
                      {suit.tag}
                    </span>
                    <span className="text-xs font-mono text-zinc-600">
                      {suit.year}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-white mb-2">
                    {suit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {suit.description}
                  </p>
                  <div className="mt-4 h-px w-full bg-gradient-to-r from-red-500/30 via-amber-500/30 to-transparent" />
                </div>
              </div>
            );
          })}

          {/* CTA overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              ctaVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
              transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "opacity",
            }}
          >
            <div className="bg-black/70 backdrop-blur-xl rounded-[20px] border border-white/8 p-10 max-w-md text-center max-md:mx-6 max-md:p-6">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-white mb-3">
                &ldquo;Part of the journey is the end.&rdquo;
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400 mb-6">
                85 suits. One legacy. Tony Stark proved that heroes aren&apos;t born
                — they&apos;re built.
              </p>
              <a
                href="#avengers"
                className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Avengers, Assemble →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
