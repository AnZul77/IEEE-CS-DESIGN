"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollContextType {
  scrollY: number;
  scrollVelocity: number;
  isReady: boolean;
}

const ScrollCtx = createContext<ScrollContextType>({
  scrollY: 0,
  scrollVelocity: 0,
  isReady: false,
});

export const useScrollContext = () => useContext(ScrollCtx);

export default function ScrollContext({ children }: { children: ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    // Custom premium ease registration
    gsap.config({ force3D: true });

    // Register custom ease
    if (!gsap.parseEase("premiumEase")) {
      try {
        gsap.registerEase("premiumEase", (progress: number) => {
          // cubic-bezier(0.65, 0, 0.35, 1) approximation
          const t = progress;
          if (t < 0.5) {
            return 2 * t * t;
          }
          return 1 - Math.pow(-2 * t + 2, 2) / 2;
        });
      } catch {
        // Ease may already be registered
      }
    }

    const handleScroll = () => {
      const currentY = window.scrollY;
      const currentTime = Date.now();
      const dt = Math.max(currentTime - lastTime.current, 1);
      const velocity = Math.abs(currentY - lastScrollY.current) / dt;

      setScrollY(currentY);
      setScrollVelocity(velocity);

      lastScrollY.current = currentY;
      lastTime.current = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    setIsReady(true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <ScrollCtx.Provider value={{ scrollY, scrollVelocity, isReady }}>
      {children}
    </ScrollCtx.Provider>
  );
}
