"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface HarpLineProps {
  pathData: string;
  midX: number;
  midY: number;
  nx: number;
  ny: number;
  index: number;
  totalLines: number;
}

// Pentatonic scale frequencies for harp-like sound
const PENTATONIC_FREQS = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0];

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playHarpNote(index: number) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const freq = PENTATONIC_FREQS[index % PENTATONIC_FREQS.length];

    // Create oscillator for pluck sound
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    // Harp-like timbre
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Quick high-frequency shimmer
    filterNode.type = "highpass";
    filterNode.frequency.setValueAtTime(200, ctx.currentTime);
    filterNode.Q.setValueAtTime(1, ctx.currentTime);

    // Pluck envelope: fast attack, medium decay
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } catch {
    // Audio not available
  }
}

export default function HarpLine({ pathData, midX, midY, nx, ny, index, totalLines }: HarpLineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [bowAmount, setBowAmount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animFrameRef = useRef<number>(0);
  const velocityRef = useRef(0);
  const positionRef = useRef(0);
  const targetRef = useRef(0);
  const hasPlayedRef = useRef(false);

  // Spring physics constants - looser, more bouncy
  const STIFFNESS = 250;
  const DAMPING = 50;
  const MASS = 1;

  const springAnimate = useCallback(() => {
    const dt = 0.016; // ~60fps

    // Spring force: F = -k * x - d * v
    const springForce = -STIFFNESS * (positionRef.current - targetRef.current);
    const dampingForce = -DAMPING * velocityRef.current;
    const acceleration = (springForce + dampingForce) / MASS;

    velocityRef.current += acceleration * dt;
    positionRef.current += velocityRef.current * dt;

    setBowAmount(positionRef.current);

    // Continue if still moving
    if (
      Math.abs(velocityRef.current) > 0.01 ||
      Math.abs(positionRef.current - targetRef.current) > 0.01
    ) {
      animFrameRef.current = requestAnimationFrame(springAnimate);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    targetRef.current = 2; // Bow amount in pixels - pulls much deeper now

    // Play harp note only once per hover
    if (!hasPlayedRef.current) {
      playHarpNote(index);
      hasPlayedRef.current = true;
    }

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(springAnimate);
  }, [index, springAnimate]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    hasPlayedRef.current = false;
    targetRef.current = 0;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(springAnimate);
  }, [springAnimate]);

  // Using regex to parse the simple M x y Q cx cy ex ey format we passed
  // and inject our bow amount into the control point
  const pathRegex = /M ([\d.-]+) ([\d.-]+) Q ([\d.-]+) ([\d.-]+) ([\d.-]+) ([\d.-]+)/;
  const match = pathData.match(pathRegex);
  
  let dynamicPath = pathData;
  if (match && Math.abs(bowAmount) > 0.1) {
    const [, startX, startY, origCx, origCy, endX, endY] = match.map(Number);
    // Add the bow amount in the direction of the normal
    const bowedCx = origCx + nx * bowAmount * 10;
    const bowedCy = origCy + ny * bowAmount * 10;
    
    dynamicPath = `M ${startX} ${startY} Q ${bowedCx} ${bowedCy} ${endX} ${endY}`;
  }

  // Smoothly interpolate the hue across the full 360 degree spectrum based on the string's index
  const hue = (index / totalLines) * 360;
  const hoverColor = `hsl(${hue}, 100%, 60%)`;
  
  const baseColor = "#555";
  const currentColor = isHovered || Math.abs(bowAmount) > 1 ? hoverColor : baseColor;

  return (
    <g
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: "pointer" }}
    >
      {/* Invisible thick path for MUCH easier hover detection */}
      <path
        d={dynamicPath}
        stroke="transparent"
        strokeWidth={40}
        fill="none"
        style={{ pointerEvents: "stroke" }}
        strokeLinecap="round"
      />
      
      {/* Visible string */}
      <path
        ref={pathRef}
        d={dynamicPath}
        stroke={currentColor}
        strokeWidth={isHovered ? 2.5 : 1.5}
        fill="none"
        style={{
          // Fast entrance, ultra-slow 3-second decay for the stroke color!
          transition: isHovered 
            ? "stroke 0.1s ease, stroke-width 0.1s ease" 
            : "stroke 3s cubic-bezier(0.25, 1, 0.5, 1), stroke-width 0.8s ease",
          filter: isHovered || Math.abs(bowAmount) > 1 ? `drop-shadow(0 0 8px ${hoverColor})` : "none",
          pointerEvents: "none", // Let the invisible path handle the events
        }}
        strokeLinecap="round"
      />
    </g>
  );
}
