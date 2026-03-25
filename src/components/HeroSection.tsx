"use client";

import Carousel3D from "./Carousel3D";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      
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

      {/* 3D Carousel Layer (Has pointer events, overlays the text with opacity blocks) */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-auto">
        <Carousel3D className="w-full h-full" />
      </div>
    </section>
  );
}
