"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DesigningTomorrowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const scrollProgressRef = useRef(0);
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Track scroll progress and velocity, and pin securely
    let lastProgress = 0;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=1100%",
      pin: true,
      pinSpacing: false,
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        
        // Boost velocity multiplier since the scroll window represents more raw physical pixels now
        const vel = Math.abs(p - lastProgress) * 150; 
        scrollVelocityRef.current = vel;
        scrollProgressRef.current = p;
        lastProgress = p;

        // Trigger text entrance when revealed at 750vh/1100vh = 0.681
        if (p > 0.681 && !textAnimated && contentRef.current) {
          textAnimated = true;
          gsap.fromTo(
            contentRef.current.children,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: "power3.out" }
          );
        } else if (p <= 0.68 && textAnimated && contentRef.current) {
          textAnimated = false;
          gsap.killTweensOf(contentRef.current.children);
          gsap.set(contentRef.current.children, { opacity: 0, y: 50 });
        }

        // Fade out during the last 50vh of its 1100vh pin duration
        if (p > 0.954) {
          const exitProg = (p - 0.954) / 0.046;
          gsap.set(section, { autoAlpha: 1 - exitProg });
        } else {
          gsap.set(section, { autoAlpha: 1 });
        }
      },
    });

    // Initial state for text
    if (contentRef.current) {
      gsap.set(contentRef.current.children, { opacity: 0, y: 50 });
    }

    let textAnimated = false;

    // Render loop for the vortex grid
    let time = 0;
    const render = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const progress = scrollProgressRef.current;
      const velocity = scrollVelocityRef.current;
      const speedMult = 1 + velocity * 12; // slightly more velocity sensitivity
      
      // Heavily boost baseline time increment so it continuously flies forward without scrolling
      time += 0.03 * speedMult; 

      const cx = w / 2;
      const cy = h / 2;
      const gridSpacing = 20; // tighter grid
      const maxLines = 100; // sufficiently dense

      // Floor grid (perspective)
      ctx.save();
      ctx.strokeStyle = `rgba(0, 0, 0, ${0.4 + progress * 0.4})`; // sharp dark black lines
      ctx.lineWidth = 1;

      // Horizontal lines (radiate from center)
      for (let i = -maxLines; i <= maxLines; i++) {
        const baseY = cy + i * gridSpacing;
        const expansion = progress * 2.5 + time * 0.3;

        // Push lines outward from center
        const distFromCenter = baseY - cy;
        const expandedY = cy + distFromCenter * (1 + expansion);

        if (expandedY < -100 || expandedY > h + 100) continue;

        ctx.globalAlpha = 0.6; // Bold, consistent opacity instead of radial fade

        ctx.beginPath();
        ctx.moveTo(0, expandedY);
        ctx.lineTo(w, expandedY);
        ctx.stroke();
      }

      // Vertical lines (radiate from center)
      for (let i = -maxLines; i <= maxLines; i++) {
        const baseX = cx + i * gridSpacing;
        const expansion = progress * 2.5 + time * 0.3;
        const distFromCenter = baseX - cx;
        const expandedX = cx + distFromCenter * (1 + expansion);

        if (expandedX < -100 || expandedX > w + 100) continue;

        ctx.globalAlpha = 0.6; // Bold, consistent opacity instead of radial fade

        ctx.beginPath();
        ctx.moveTo(expandedX, 0);
        ctx.lineTo(expandedX, h);
        ctx.stroke();
      }

      // Diagonal lines for extra depth
      ctx.strokeStyle = `rgba(0, 0, 0, 0.4)`; // dark black diagonal
      for (let i = -maxLines / 2; i <= maxLines / 2; i++) {
        const expansion = progress * 1.5 + time * 0.2;
        const offset = i * gridSpacing * (1 + expansion);

        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(cx + offset - h, cy - h);
        ctx.lineTo(cx + offset + h, cy + h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx - offset + h, cy - h);
        ctx.lineTo(cx - offset - h, cy + h);
        ctx.stroke();
      }

      // Center glow / vanishing point
      if (progress > 0.2) {
        const glowRadius = 50 + progress * 100 + Math.sin(time) * 20;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
        gradient.addColorStop(0, `rgba(0, 168, 150, ${progress * 0.15})`);
        gradient.addColorStop(1, "rgba(0, 168, 150, 0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = gradient;
        ctx.fillRect(cx - glowRadius, cy - glowRadius, glowRadius * 2, glowRadius * 2);
      }

      ctx.restore();
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="tomorrow"
      ref={sectionRef}
      className="snap-section relative w-full min-h-[100vh] py-24 md:py-0 flex flex-col justify-center overflow-hidden bg-[#008f7f] text-[#111]"
    >
      {/* Animated Vortex Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      <div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-12"
      >
        {/* Left Side: Title */}
        <div className="flex-1 w-full flex flex-col items-start justify-center font-sans">
          <h2 className="text-[45px] sm:text-[60px] md:text-[80px] lg:text-[100px] font-bold leading-[1] md:leading-[0.9] tracking-tight text-[#1a1a1a]">
            Designing<br />
            Tomorrow
          </h2>
          <p className="mt-4 md:mt-4 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.1em] md:tracking-[0.2em] text-[#1a1a1a] uppercase">
            POWERED BY IEEE-CS DESIGNATHON
          </p>
        </div>

        {/* Right Side: Description */}
        <div className="flex-1 w-full flex justify-start md:justify-end">
          <p className="text-[#1a1a1a] text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] max-w-md font-medium text-left">
            Built within a collaborative IEEE-<br className="hidden md:block" />
            CS environment, these projects<br className="hidden md:block" />
            represent shared learning, peer<br className="hidden md:block" />
            feedback, and the collective drive<br className="hidden md:block" />
            to raise creative standards
          </p>
        </div>
      </div>
    </section>
  );
}
