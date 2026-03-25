"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DesignExcellenceSection from "@/components/DesignExcellenceSection";
import DesignHeadSection from "@/components/DesignHeadSection";
import DesigningTomorrowSection from "@/components/DesigningTomorrowSection";
import PortfolioSection from "@/components/PortfolioSection";
import Footer from "@/components/Footer";
import StickFigure from "@/components/StickFigure";

const ScrollContext = dynamic(() => import("@/components/ScrollContext"), {
  ssr: false,
});

export default function Home() {
  return (
    <ScrollContext>
      <main className="relative min-h-screen bg-background text-ieee-dark overflow-x-hidden selection:bg-ieee-blue selection:text-white">
        
        {/* Global StickFigure Overlay */}
        <StickFigure />

        <div className="relative z-[60]"><Navbar /></div>
        <div className="relative z-[50]"><HeroSection /></div>
        <div className="relative z-[40]"><DesignExcellenceSection /></div>
        <div className="relative z-[30]"><DesignHeadSection /></div>
        <div className="relative z-[20]"><DesigningTomorrowSection /></div>
        <div className="relative z-[10]" style={{ marginTop: '1000vh' }}>
          <PortfolioSection />
        </div>
        <div className="relative z-[0]"><Footer /></div>
      </main>
    </ScrollContext>
  );
}
