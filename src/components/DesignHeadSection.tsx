"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GRID_COLS = 8;
const GRID_ROWS = 6;

export default function DesignHeadSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    section.addEventListener("mousemove", handleMouseMove);

    // Initial state for text
    if (contentRef.current) {
      gsap.set(contentRef.current.children, { opacity: 0, y: 50 });
    }

    let textAnimated = false; // <-- Missing brace
    // Layered Pinning & Fade Exit
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=850%",
      pin: true,
      pinSpacing: false,
      scrub: true,
      onUpdate: (self) => {
        // Trigger text entrance when revealed at 500vh/850vh = 0.588
        if (self.progress > 0.588 && !textAnimated && contentRef.current) {
          textAnimated = true;
          gsap.fromTo(
            contentRef.current.children,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: "power3.out" }
          );
        } else if (self.progress <= 0.58 && textAnimated && contentRef.current) {
          textAnimated = false;
          gsap.killTweensOf(contentRef.current.children);
          gsap.set(contentRef.current.children, { opacity: 0, y: 50 });
        }

        if (self.progress > 0.941) {
          const exitProg = (self.progress - 0.941) / 0.059;
          gsap.set(section, { autoAlpha: 1 - exitProg });
        } else {
          gsap.set(section, { autoAlpha: 1 });
        }
      }
    });

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      trigger.kill();
    };
  }, [handleMouseMove]);

  // Inverse parallax: grid moves opposite to cursor
  const gridTranslateX = (0.5 - mousePos.x) * 30;
  const gridTranslateY = (0.5 - mousePos.y) * 30;

  return (
    <section
      id="head"
      ref={sectionRef}
      className="snap-section relative w-full min-h-[100vh] py-24 md:py-0 flex flex-col justify-center overflow-hidden bg-[#003d73] text-white"
    >
      {/* Interactive Grid Background */}
      <div
        ref={gridRef}
        className="absolute inset-[-30px] pointer-events-none z-0"
        style={{
          transform: `translate(${gridTranslateX}px, ${gridTranslateY}px)`,
          transition: "transform 0.3s cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        <div className="absolute inset-0 grid pointer-events-auto"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
            gap: "1px",
          }}
        >
          {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => (
            <div
              key={i}
              className="grid-cell border border-white/10 bg-transparent hover:bg-[#002b54]/80"
              style={{
                transition: "transform 0.3s cubic-bezier(0.65, 0, 0.35, 1), background-color 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Diamond Accents */}
      <div
        className="absolute top-[10%] left-[15%] w-6 h-6 md:w-8 md:h-8 bg-[#002b54] rotate-45 z-0"
        style={{
          transform: `rotate(45deg) translate(${gridTranslateX * 0.5}px, ${gridTranslateY * 0.5}px)`,
          transition: "transform 0.4s cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      />
      <div
        className="absolute top-[35%] right-[10%] md:right-[25%] w-6 h-6 md:w-8 md:h-8 bg-[#002b54] rotate-45 z-0"
        style={{
          transform: `rotate(45deg) translate(${gridTranslateX * 0.7}px, ${gridTranslateY * 0.7}px)`,
          transition: "transform 0.4s cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      />

      {/* Complex Diamond Pattern */}
      <div
        className="absolute bottom-[5%] md:bottom-[15%] left-[20%] md:left-[35%] w-24 h-24 md:w-32 md:h-32 flex items-center justify-center opacity-70 z-0 hidden sm:flex"
        style={{
          transform: `translate(${gridTranslateX * 0.3}px, ${gridTranslateY * 0.3}px)`,
          transition: "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        <div className="absolute w-full h-full border border-white/20 rotate-45" />
        <div className="absolute w-[70%] h-[70%] border border-white/20 rotate-45" />
        <div className="absolute w-6 h-6 md:w-8 md:h-8 bg-[#002b54] rotate-45" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-12"
      >
        {/* Left Side: Title */}
        <div className="flex-1 w-full flex flex-col items-start justify-center font-sans">
          <h2 className="text-[45px] sm:text-[60px] md:text-[80px] lg:text-[100px] font-bold leading-[1] md:leading-[0.9] tracking-tight text-[#f4f4f5]">
            Design<br />
            Head
          </h2>
          <p className="mt-4 md:mt-4 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.1em] md:tracking-[0.2em] text-[#f4f4f5] uppercase">
            IEEE-CS DESIGN TALENT
          </p>
        </div>

        {/* Right Side: Description */}
        <div className="flex-1 w-full flex justify-start md:justify-end">
          <p className="text-[#11111] text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] max-w-md font-medium text-left">
            Built within a collaborative<br className="hidden md:block" />
            IEEE-CS environment, these<br className="hidden md:block" />
            projects represent shared<br className="hidden md:block" />
            learning, peer feedback, and<br className="hidden md:block" />
            the collective drive to raise<br className="hidden md:block" />
            creative standards
          </p>
        </div>
      </div>
    </section>
  );
}
