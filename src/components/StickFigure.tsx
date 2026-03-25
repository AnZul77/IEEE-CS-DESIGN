"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type IdleAnimation = "wave" | "checkWatch" | "sit" | "breathe";

export default function StickFigure() {
  const figureRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasFallen, setHasFallen] = useState(false);
  const [landed, setLandedState] = useState(false);
  const [currentIdle, setCurrentIdle] = useState<IdleAnimation>("breathe");
  const idleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const armRef = useRef<SVGGElement>(null);
  const leftLegRef = useRef<SVGGElement>(null);
  const rightLegRef = useRef<SVGGElement>(null);

  const startIdleAnimations = useCallback(() => {
    if (idleTimerRef.current) clearInterval(idleTimerRef.current);

    idleTimerRef.current = setInterval(() => {
      const animations: IdleAnimation[] = ["wave", "checkWatch", "sit", "breathe"];
      const random = animations[Math.floor(Math.random() * animations.length)];
      setCurrentIdle(random);

      setTimeout(() => setCurrentIdle("breathe"), 2000);
    }, 4000);
  }, []);

  const hasFallenRef = useRef(false);
  const landedStateRef = useRef(false);
  
  // Dragging states
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const hasBeenDraggedRef = useRef(false);

  useEffect(() => {
    const figure = figureRef.current;
    const container = containerRef.current;
    if (!figure || !container) return;

    // Initial position: hanging from navbar bottom (Centered)
    gsap.set(container, {
      position: "fixed",
      top: "75px",
      left: "50%",
      right: "auto",
      xPercent: -50,
      zIndex: 100, // Globally high z-index to overlay all pages
      opacity: 1,
    });

    // Scroll trigger for the scrub-fall
    const trigger = ScrollTrigger.create({
      trigger: "#hero-section",
      start: "top top",
      end: "+=350%",
      onUpdate: (self) => {
        const progress = self.progress;

        // Rope detach
        if (progress > 0.05 && !hasFallenRef.current) {
          hasFallenRef.current = true;
          setHasFallen(true);
        } else if (progress <= 0.05 && hasFallenRef.current) {
          hasFallenRef.current = false;
          setHasFallen(false);
        }

        // Calculate native rip pull at the center, exactly matching HeroSection canvas math
        const adjustedProgress = progress < 0.1 ? 0 : Math.min((progress - 0.1) / 0.7, 1);
        const ripY = adjustedProgress * window.innerHeight * 1.25; 
        const maxDrop = window.innerHeight - 144 - 75 - 20; // h: 144, top: 75, padding: 20

        if (ripY >= maxDrop) {
          // He has hit the floor
          if (!hasBeenDraggedRef.current) gsap.set(container, { y: maxDrop });
          
          if (!landedStateRef.current) {
            landedStateRef.current = true;
            setLandedState(true);

            // Squash on landing boundary
            const tl = gsap.timeline();
            tl.to(figure, {
              scaleY: 0.7,
              scaleX: 1.3,
              transformOrigin: "bottom center",
              duration: 0.1,
              ease: "power2.in",
            }).to(figure, {
              scaleY: 1,
              scaleX: 1,
              duration: 0.3,
              ease: "elastic.out(1, 0.3)",
            });

            // The Scurry! Run to the right side (Slower & Leg Animated)
            tl.to(figure, { rotation: 12, transformOrigin: "bottom center", duration: 0.1 }, "+=0.05")
              .to(container, {
                x: window.innerWidth / 2 - 100, // Move to right side
                duration: 1.2,
                ease: "power1.inOut"
              }, "<")
              .to(figure, { 
                y: -10, 
                duration: 0.15, 
                yoyo: true, 
                repeat: 7,
                ease: "sine.inOut"
              }, "<")
              .to(leftLegRef.current, { rotation: 15, transformOrigin: "25px 48px", duration: 0.15, yoyo: true, repeat: 7, ease: "sine.inOut" }, "<")
              .to(rightLegRef.current, { rotation: -15, transformOrigin: "25px 48px", duration: 0.15, yoyo: true, repeat: 7, ease: "sine.inOut" }, "<")
              .to([figure, leftLegRef.current, rightLegRef.current], {
                rotation: 0,
                y: 0,
                duration: 0.15,
                onComplete: startIdleAnimations
              });
          }
        } else {
          // He is actively holding/scrubbing the rip down
          if (!hasBeenDraggedRef.current) gsap.set(container, { y: ripY });

          // If he was on the floor but we scrubbed back up
          if (landedStateRef.current) {
            landedStateRef.current = false;
            setLandedState(false);
            hasBeenDraggedRef.current = false; // Reset drag override so he snaps back to the rip
            gsap.killTweensOf(figure);
            gsap.killTweensOf(container);
            gsap.killTweensOf([leftLegRef.current, rightLegRef.current]);
            gsap.set(figure, { scaleY: 1, scaleX: 1, rotation: 0, y: 0 });
            gsap.set([leftLegRef.current, rightLegRef.current], { rotation: 0 });
            gsap.to(container, { x: 0, scale: 1, duration: 0.2 }); // Reset x to center so he rides the rip up again!
            if (idleTimerRef.current) clearInterval(idleTimerRef.current);
          }
        }
      },
    });

    return () => {
      trigger.kill();
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
    };
  }, [startIdleAnimations]);

  // Idle animation styles
  const getIdleTransform = () => {
    if (isDragging) return { animation: "figure-wave 0.4s ease-in-out infinite" }; // wild flapping

    switch (currentIdle) {
      case "wave":
        return { animation: "figure-wave 1s ease-in-out" };
      case "checkWatch":
        return { animation: "figure-check-watch 1.5s ease-in-out" };
      case "sit":
        return { animation: "figure-sit 1s ease-in-out forwards" };
      case "breathe":
      default:
        return { animation: "figure-breathe 3s ease-in-out infinite" };
    }
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!landedStateRef.current) return;
    
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    hasBeenDraggedRef.current = true;
    
    // Interrupt any ongoing scurry or idle animations
    gsap.killTweensOf(figureRef.current);
    gsap.killTweensOf(containerRef.current);
    gsap.killTweensOf([leftLegRef.current, rightLegRef.current]);
    gsap.set(figureRef.current, { rotation: 0, y: 0 }); // reset scurry states
    gsap.set([leftLegRef.current, rightLegRef.current], { rotation: 0 });
    
    if (idleTimerRef.current) clearInterval(idleTimerRef.current);
    setCurrentIdle("wave"); 
    
    const container = containerRef.current;
    if (container) {
      const currentX = gsap.getProperty(container, "x") as number;
      const currentY = gsap.getProperty(container, "y") as number;
      dragOffsetRef.current = {
        x: e.clientX - currentX,
        y: e.clientY - currentY
      };
      
      gsap.to(container, { scale: 1.1, duration: 0.2, ease: "power2.out" });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (container) {
      gsap.set(container, { 
        x: e.clientX - dragOffsetRef.current.x, 
        y: e.clientY - dragOffsetRef.current.y 
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    startIdleAnimations();
    
    const container = containerRef.current;
    if (container) {
      gsap.to(container, { scale: 1, duration: 0.3, ease: "bounce.out" });
    }
  };

  return (
    <div ref={containerRef} className="pointer-events-none select-none" style={{ width: "90px", height: "144px" }}>
      <svg
        ref={figureRef}
        viewBox="0 0 50 80"
        width="90"
        height="144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ ... (landed || isDragging ? getIdleTransform() : {}), pointerEvents: landed ? "auto" : "none", cursor: landed ? (isDragging ? "grabbing" : "grab") : "default" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Head */}
        <circle cx="25" cy="12" r="7" fill="#ff9500ff" />

        {/* Body */}
        <line x1="25" y1="19" x2="25" y2="48" stroke="#ff9500ff" strokeWidth="2.5" strokeLinecap="round" />

        {/* Arms */}
        <g ref={armRef} style={(landed && currentIdle === "wave") || isDragging ? { animation: isDragging ? "figure-wave 0.5s ease-in-out infinite" : "figure-wave 1s ease-in-out", transformOrigin: "25px 28px" } : {}}>
          {/* Left arm */}
          <line 
            x1="25" y1="28" 
            x2={isDragging ? "5" : (hasFallen && !landed ? "15" : "12")} 
            y2={isDragging ? "5" : (hasFallen && !landed ? "5" : "38")} 
            stroke="#ff9500ff" strokeWidth="2.5" strokeLinecap="round" 
            style={{ transition: "all 0.2s" }}
          />
          {/* Right arm */}
          <line
            x1="25"
            y1="28"
            x2={isDragging ? "45" : (landed && currentIdle === "wave" ? "42" : hasFallen && !landed ? "35" : "38")}
            y2={isDragging ? "5" : (landed && currentIdle === "wave" ? "18" : hasFallen && !landed ? "5" : "38")}
            stroke="#ff9500ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ transition: "all 0.2s var(--ease-premium)" }}
          />
          {/* Watch on left wrist */}
          {landed && currentIdle === "checkWatch" && (
            <rect x="9" y="36" width="6" height="4" rx="1" fill="#F8A519" stroke="#ff9500ff" strokeWidth="0.5" />
          )}
        </g>

        {/* Left Leg & Foot */}
        <g ref={leftLegRef}>
          <line x1="25" y1="48" x2={isDragging ? "10" : "15"} y2={isDragging ? "65" : (hasFallen && !landed ? "75" : "68")} stroke="#ff9500ff" strokeWidth="2.5" strokeLinecap="round" style={{ transition: "all 0.2s" }} />
          <line x1={isDragging ? "10" : "15"} y1={isDragging ? "65" : (hasFallen && !landed ? "75" : "68")} x2={isDragging ? "5" : "10"} y2={isDragging ? "60" : "72"} stroke="#ff9500ff" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: (hasFallen && !landed && !isDragging) ? 0 : 1, transition: "opacity 0.2s, all 0.2s" }} />
        </g>

        {/* Right Leg & Foot */}
        <g ref={rightLegRef}>
          <line x1="25" y1="48" x2={isDragging ? "40" : "35"} y2={isDragging ? "65" : (hasFallen && !landed ? "75" : "68")} stroke="#ff9500ff" strokeWidth="2.5" strokeLinecap="round" style={{ transition: "all 0.2s" }} />
          <line x1={isDragging ? "40" : "35"} y1={isDragging ? "65" : (hasFallen && !landed ? "75" : "68")} x2={isDragging ? "45" : "40"} y2={isDragging ? "60" : "72"} stroke="#ff9500ff" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: (hasFallen && !landed && !isDragging) ? 0 : 1, transition: "opacity 0.2s, all 0.2s" }} />
        </g>

        {/* Hanging rope */}
        {!hasFallen && (
          <line x1="25" y1="-20" x2="25" y2="5" stroke="#666" strokeWidth="1.5" strokeDasharray="3 2" />
        )}
      </svg>
    </div>
  );
}
