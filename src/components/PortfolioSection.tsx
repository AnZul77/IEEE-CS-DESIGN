"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Abstract Landscapes",
    category: "Illustration",
    colors: ["#2a7a78", "#e07a5f", "#ffdfba", "#f8f1e7"],
  },
  {
    id: 2,
    title: "Indoor Garden",
    category: "Digital Art",
    colors: ["#81b255", "#c3d6ac", "#e3ecd7", "#5a9e3f"],
  },
  {
    id: 3,
    title: "Neo-Classical",
    category: "Mixed Media",
    colors: ["#ff69b4", "#32cd32", "#ffd700", "#ffffff"],
  },
  {
    id: 4,
    title: "Typography Series",
    category: "Branding",
    colors: ["#1a1a1a", "#F8A519", "#f2f1eb", "#333"],
  },
  {
    id: 5,
    title: "Wave Motion",
    category: "Motion Design",
    colors: ["#003d73", "#0066cc", "#339dff", "#99ccff"],
  },
  {
    id: 6,
    title: "Minimal Forms",
    category: "UI Design",
    colors: ["#00a896", "#02c39a", "#f0f3bd", "#028090"],
  },
];

function PortfolioCard({
  item,
}: {
  item: (typeof PORTFOLIO_ITEMS)[0];
}) {
  return (
    <div className="flex-shrink-0 w-[320px] md:w-[400px] group">
      <div className="w-full aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-lg relative transition-transform duration-500 group-hover:scale-[1.02]">
        {/* Generated visual using colors */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: item.colors[3] }}
          />
          <div
            className="absolute top-0 left-0 w-full h-[60%] transform -skew-y-6 origin-top-left"
            style={{ backgroundColor: item.colors[0] }}
          />
          <div
            className="absolute bottom-0 right-0 w-[80%] h-[50%] transform skew-y-3 origin-bottom-right"
            style={{ backgroundColor: item.colors[1] }}
          />
          <div
            className="absolute w-[35%] aspect-square rounded-full z-10 shadow-xl"
            style={{ backgroundColor: item.colors[2] }}
          />
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end p-6 opacity-0 group-hover:opacity-100">
          <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#F8A519] mb-1">
              {item.category}
            </p>
            <h3 className="text-xl font-bold">{item.title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const inner = innerRef.current;
    if (!section || !track || !inner) return;

    // Double the items for seamless loop
    const totalWidth = inner.scrollWidth / 2;
    let scrollOffset = 0;

    // GSAP infinite marquee
    const marquee = gsap.to(inner, {
      x: -totalWidth,
      duration: 40,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: number) => {
          // Combine native time-based marquee position with scroll-driven offset
          const currentX = parseFloat(x as unknown as string);
          return (currentX + scrollOffset) % totalWidth;
        }),
      },
    });

    // ScrollTrigger: vertical scroll → horizontal movement
    const scrollDriven = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=200%",
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        // Just update the variable, the modifier loop picks it up seamlessly!
        scrollOffset = -(self.progress * totalWidth * 0.5);
      },
    });

    return () => {
      marquee.kill();
      scrollDriven.kill();
    };
  }, []);

  // Hover speed control
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const currentTween = gsap.getTweensOf(inner)[0];
    if (currentTween) {
      gsap.to(currentTween, {
        timeScale: isHovered ? 0.1 : 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [isHovered]);

  // Create doubled array for seamless loop
  const doubledItems = [...PORTFOLIO_ITEMS, ...PORTFOLIO_ITEMS, ...PORTFOLIO_ITEMS];

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="snap-section relative w-full min-h-screen bg-[#f4ebe1] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full pt-16 md:pt-24">
        {/* Top Pill */}
        <div className="bg-[#333] text-white text-[10px] font-bold tracking-wider px-4 py-1.5 rounded-full mb-6 md:mb-8 uppercase inline-block">
          Branding
        </div>

        {/* Title */}
        <div className="w-full text-left mb-10 md:mb-16">
          <p className="text-[#ff9900] text-sm sm:text-lg md:text-xl font-bold mb-1">
            All Designs
          </p>
          <h2 className="text-[45px] sm:text-[60px] md:text-[80px] font-black leading-[1] text-[#1a1a1a] tracking-tight">
            Portfolio
          </h2>
        </div>
      </div>

      {/* Infinite Carousel Track */}
      <div
        ref={trackRef}
        className="w-full overflow-hidden pb-16 md:pb-24"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={innerRef}
          className="flex gap-6 md:gap-8 will-change-transform"
          style={{ width: "max-content" }}
        >
          {doubledItems.map((item, i) => (
            <PortfolioCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
