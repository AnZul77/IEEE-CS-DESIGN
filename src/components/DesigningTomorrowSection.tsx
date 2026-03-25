export default function DesigningTomorrowSection() {
  return (
    <section id="tomorrow" className="relative w-full min-h-[100vh] py-24 md:py-0 flex flex-col justify-center overflow-hidden bg-[#00a896] text-[#111]">
      {/* 3D Perspective Grid Background */}
      <div className="absolute inset-0 pointer-events-none perspective-[1000px] overflow-hidden">
        <div 
          className="absolute w-[200%] h-[200%] left-[-50%] top-[-50%] opacity-20 origin-center"
          style={{
            backgroundImage: `
              linear-gradient(to right, #004d40 1px, transparent 1px),
              linear-gradient(to bottom, #004d40 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'rotateX(60deg) translateY(-100px) translateZ(-200px)'
          }}
        />
        {/* Top ceiling grid */}
        <div 
          className="absolute w-[200%] h-[200%] left-[-50%] top-[-150%] opacity-20 origin-center"
          style={{
            backgroundImage: `
              linear-gradient(to right, #004d40 1px, transparent 1px),
              linear-gradient(to bottom, #004d40 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'rotateX(-60deg) translateY(100px) translateZ(-200px)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
        
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
            Built within a collaborative IEEE-<br className="hidden md:block"/>
            CS environment, these projects<br className="hidden md:block"/>
            represent shared learning, peer<br className="hidden md:block"/>
            feedback, and the collective drive<br className="hidden md:block"/>
            to raise creative standards
          </p>
        </div>
      </div>
    </section>
  );
}
