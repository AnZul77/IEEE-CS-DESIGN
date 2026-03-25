"use client";

import { useEffect, useState } from "react";

export default function DesignExcellenceSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section id="excellence" className="relative w-full min-h-[100vh] py-24 md:py-0 flex flex-col justify-center overflow-hidden bg-[#222222] text-white">
      {/* Background Topography Pattern Generator */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='curve' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 100 Q 50 50 100 0' fill='none' stroke='white' stroke-width='1.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23curve)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}
      />
      {/* For authentic curved look, using multiple massive rounded divs with borders */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center items-center opacity-[0.03]">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute border-[1.5px] border-white rounded-[40%] animate-spin-slow"
            style={{
              width: `${(i + 1) * 150}px`,
              height: `${(i + 1) * 120}px`,
              animationDuration: `${100 + i * 10}s`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full flex flex-col md:flex-row items-center md:items-center justify-between gap-12 mt-12 md:mt-20">
        
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
            Every design featured in our<br className="hidden md:block"/>
            gallery is crafted by Junior Core<br className="hidden md:block"/>
            members of IEEE Computer<br className="hidden md:block"/>
            Society during our annual<br className="hidden md:block"/>
            Designathon. These works<br className="hidden md:block"/>
            reflect creativity, innovation, and<br className="hidden md:block"/>
            problem-solving skills developed<br className="hidden md:block"/>
            through real design challenges.
          </p>
        </div>
      </div>
    </section>
  );
}
