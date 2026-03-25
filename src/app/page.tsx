import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DesignExcellenceSection from "@/components/DesignExcellenceSection";
import DesignHeadSection from "@/components/DesignHeadSection";
import DesigningTomorrowSection from "@/components/DesigningTomorrowSection";
import PortfolioSection from "@/components/PortfolioSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-ieee-dark">
      <Navbar />
      <HeroSection />
      <DesignExcellenceSection />
      <DesignHeadSection />
      <DesigningTomorrowSection />
      <PortfolioSection />
      <Footer />
    </main>
  );
}
