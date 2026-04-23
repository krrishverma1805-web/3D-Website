"use client";

export function EyebrowBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-[10px] font-medium tracking-wider text-zinc-500 uppercase shadow-sm backdrop-blur-md"
    >
      {children}
    </span>
  );
}
