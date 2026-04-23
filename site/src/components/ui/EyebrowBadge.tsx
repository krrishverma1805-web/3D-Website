"use client";

export function EyebrowBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-medium tracking-[0.25em] text-zinc-400 uppercase backdrop-blur-md"
    >
      {children}
    </span>
  );
}
