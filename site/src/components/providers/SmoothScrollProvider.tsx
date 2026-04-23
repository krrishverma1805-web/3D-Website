"use client";

import { ReactLenis } from "lenis/react";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        duration: 1.6,
        smoothWheel: true,
        wheelMultiplier: 0.7,
        touchMultiplier: 1.5,
        syncTouch: false,
        autoResize: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
