"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Carousel3D from "./Carousel3D";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ripCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ripCanvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ScrollTrigger for the layered pinning effect
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=350%", // Extended pin time: 300vh reading time, 50vh exit
      pin: true,
      pinSpacing: false, // Core of overlapping: next section slides up underneath
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Draw the rip based on progress (rip goes from 0 to 1 over the full 350vh of scroll)
        drawRip(ctx, canvas.width, canvas.height, progress);

        // Fade out entirely at the very end so the next section takes focus completely
        if (progress > 0.99) {
          gsap.set(section, { autoAlpha: 0 });
        } else {
          gsap.set(section, { autoAlpha: 1 });
        }
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="snap-section relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      {/* 2D Typography Layer */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none mt-10 px-4">
        <div className="relative font-sans uppercase flex flex-col items-start w-max mx-auto">
          {/* IEEE CS */}
          <h2 className="text-[#F5A623] text-[28px] sm:text-[40px] md:text-[50px] lg:text-[60px] font-black leading-none tracking-normal mb-[-2px] md:mb-[-10px] z-10 relative">
            IEEE CS
          </h2>

          {/* DESIGN DOMAIN */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start relative z-0">
            <h1 className="text-[18vw] lg:text-[190px] font-black leading-[0.8] tracking-[-0.01em] text-ieee-dark whitespace-nowrap">
              DESIGN
            </h1>
            <h1 className="text-[18vw] lg:text-[190px] font-black leading-[0.8] tracking-[-0.01em] text-ieee-dark mt-[-2vw] lg:mt-[150px] ml-0 lg:ml-[-120px] whitespace-nowrap">
              DOMAIN
            </h1>
          </div>
        </div>
      </div>

      {/* 3D Carousel Layer */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-auto">
        <Carousel3D className="w-full h-full" />
      </div>

      {/* Rip Effect Canvas */}
      <canvas
        ref={ripCanvasRef}
        className="absolute inset-0 w-full h-full z-30 pointer-events-none"
      />
    </section>
  );
}

function drawRip(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  ctx.clearRect(0, 0, width, height);

  if (progress < 0.1) return;

  const adjustedProgress = Math.min((progress - 0.1) / 0.7, 1);
  const ripHeight = adjustedProgress * height;

  if (ripHeight <= 0) return;

  ctx.save();

  // Create jagged rip path starting from top
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  ctx.lineTo(width, ripHeight);

  // Jagged bottom edge (V-shape peaking at center where figure pulls)
  const segments = 40;
  const segWidth = width / segments;
  const centerX = width / 2;

  for (let i = segments; i >= 0; i--) {
    const x = i * segWidth;
    
    // The rip pulls down most in the center, tapering to the sides
    const distFromCenter = Math.abs(x - centerX);
    const pullAmount = Math.max(0, 1 - distFromCenter / (width * 0.4));
    
    // Add jaggedness
    const jaggedOffset =
      Math.sin(i * 1.5 + progress * 10) * 15 +
      Math.sin(i * 3.7) * 8 +
      Math.cos(i * 2.1 + progress * 5) * 10;
      
    // The actual Y incorporates the overall rip height, the V-shape pull, and the jagged edge
    const y = ripHeight + (pullAmount * ripHeight * 0.3) + jaggedOffset;
    
    ctx.lineTo(x, y);
  }

  ctx.closePath();

  // Draw torn paper edge shadow/glow to separate layers
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;

  // Fill with a dark color representing the next section or a void
  ctx.fillStyle = "#222222"; 
  ctx.fill();
  
  // Clear the shadow for subsequent drawing
  ctx.shadowColor = "transparent";

  // Draw torn paper edge explicitly
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Add paper fiber texture at the rip edge
  if (adjustedProgress > 0) {
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < segments; i++) {
      const x = i * segWidth + segWidth / 2;
      const distFromCenter = Math.abs(x - centerX);
      const pullAmount = Math.max(0, 1 - distFromCenter / (width * 0.4));
      
      const baseY =
        ripHeight + (pullAmount * ripHeight * 0.3) +
        Math.sin(i * 1.5 + progress * 10) * 15 +
        Math.sin(i * 3.7) * 8;

      // Draw small fiber lines
      for (let j = 0; j < 4; j++) {
        const fiberX = x + (Math.random() - 0.5) * 12;
        const fiberLen = 4 + Math.random() * 12;
        ctx.beginPath();
        ctx.moveTo(fiberX, baseY);
        ctx.lineTo(fiberX + (Math.random() - 0.5) * 5, baseY - fiberLen);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}
