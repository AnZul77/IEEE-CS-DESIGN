"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HarpLine from "./HarpLine";

gsap.registerPlugin(ScrollTrigger);

// Generate concentric curved lines for the topography effect
function generateHarpLines(width: number, height: number, count: number) {
  const lines = [];
  
  // The curves should nest from top-right to bottom-left 
  // similar to the user's screenshot
  const centerX = width * -0.2;
  const centerY = height * 1.2;
  
  for (let i = 0; i < count; i++) {
    // Increase spacing exponentially to spread them out
    const spacing = 15 + Math.pow(i, 1.4) * 8;
    
    // Instead of simple diagonal lines, we'll draw curved paths
    // A path starting from top, curving, and ending at bottom
    // We'll define start, control point, and end point for each
    
    // Start at the top edge (x changes based on i)
    const startX = width * 1.5 - spacing * 4;
    const startY = -100;
    
    // End at the bottom/left edge
    const endX = -100;
    const endY = height * 0.8 + spacing * 3;
    
    // Control point determines the bulge of the curve
    const controlX = centerX + spacing * 4;
    const controlY = centerY - spacing * 4;

    const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
    
    lines.push({ 
      id: i,
      pathData, 
      // Approximate length and midpoint for physics calculations later
      midX: (startX + endX) / 2 * 0.5 + controlX * 0.5,
      midY: (startY + endY) / 2 * 0.5 + controlY * 0.5,
      nx: (endY - startY) / 1000, // Approximated normal vector
      ny: -(endX - startX) / 1000  
    });
  }
  return lines;
}

export default function DesignExcellenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const updateDimensions = () => {
      setDimensions({
        width: section.offsetWidth,
        height: section.offsetHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Initial state for text
    if (contentRef.current) {
      gsap.set(contentRef.current.children, { opacity: 0, y: 40 });
    }

    let textAnimated = false;

    // Layered Pinning & Fade Exit (also controls Harp visibility)
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=600%",
      pin: true,
      pinSpacing: false,
      scrub: true,
      onEnter: () => setIsVisible(true),
      onLeave: () => setIsVisible(false),
      onEnterBack: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false),
      onUpdate: (self) => {
        // Trigger text entrance animation exactly when this section is revealed 
        // 250vh / 600vh = 0.416
        if (self.progress > 0.416 && !textAnimated && contentRef.current) {
          textAnimated = true;
          gsap.fromTo(
            contentRef.current.children,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: "power3.out" }
          );
        } else if (self.progress <= 0.41 && textAnimated && contentRef.current) {
          textAnimated = false;
          gsap.killTweensOf(contentRef.current.children);
          gsap.set(contentRef.current.children, { opacity: 0, y: 40 });
        }

        // Exit animation during the last 50vh of the 600vh pin
        if (self.progress > 0.916) {
          const exitProg = (self.progress - 0.916) / 0.084;
          gsap.set(section, { autoAlpha: 1 - exitProg });
        } else {
          gsap.set(section, { autoAlpha: 1 });
        }
      }
    });

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Generate enough lines to stretch completely across the middle of the page
  const harpLines = generateHarpLines(dimensions.width, dimensions.height, 40);

  return (
    <section
      id="excellence"
      ref={sectionRef}
      className="snap-section relative w-full min-h-[100vh] py-24 md:py-0 flex flex-col justify-center overflow-hidden bg-[#222222] text-white"
    >
      {/* Interactive Harp Lines Background */}
      {isVisible && (
        <svg
          className="absolute inset-0 w-full h-full z-0"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="none"
          style={{ opacity: 0.35 }}
        >
          {harpLines.map((line, i) => (
            <HarpLine
              key={i}
              pathData={line.pathData}
              midX={line.midX}
              midY={line.midY}
              nx={line.nx}
              ny={line.ny}
              index={i}
              totalLines={harpLines.length}
            />
          ))}
        </svg>
      )}

      {/* Removed contour rings as per request */}

      <div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full flex flex-col md:flex-row items-center md:items-center justify-between gap-12 mt-12 md:mt-20"
      >
        {/* Left Side: Title */}
        <div className="flex-1 w-full flex flex-col items-start justify-center font-sans text-center md:text-left">
          <h2 className="text-[45px] sm:text-[60px] md:text-[80px] lg:text-[100px] font-bold leading-[1] md:leading-[0.9] tracking-tight text-[#f4f4f5] w-full md:w-auto text-left">
            Design<br />
            Excellence
          </h2>
          <p className="mt-4 md:mt-6 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.1em] md:tracking-[0.2em] text-gray-400 w-full md:w-auto text-left">
            QUALITY OVER QUANTITY
          </p>
        </div>

        {/* Right Side: Description */}
        <div className="flex-1 w-full flex justify-start md:justify-end">
          <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] max-w-lg font-normal text-left md:text-left">
            Every design featured in our<br className="hidden md:block" />
            gallery is crafted by Junior Core<br className="hidden md:block" />
            members of IEEE Computer<br className="hidden md:block" />
            Society . These works reflect<br className="hidden md:block" />
            creativity, innovation, and<br className="hidden md:block" />
            problem-solving skills developed<br className="hidden md:block" />
            through real design challenges.
          </p>
        </div>
      </div>
    </section>
  );
}
