export default function DesignHeadSection() {
  return (
    <section id="head" className="relative w-full min-h-[100vh] py-24 md:py-0 flex flex-col justify-center overflow-hidden bg-[#003d73] text-white">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '25% 33.33%' // Creates a 4x3 primary grid roughly
        }}
      />
      
      {/* Diamond Accents */}
      <div className="absolute top-[10%] left-[15%] w-6 h-6 md:w-8 md:h-8 bg-[#002b54] rotate-45 z-0"></div>
      <div className="absolute top-[35%] right-[10%] md:right-[25%] w-6 h-6 md:w-8 md:h-8 bg-[#002b54] rotate-45 z-0"></div>
      
      {/* Complex Diamond Pattern Bottom Left */}
      <div className="absolute bottom-[5%] md:bottom-[15%] left-[20%] md:left-[35%] w-24 h-24 md:w-32 md:h-32 flex items-center justify-center opacity-70 z-0 hidden sm:flex">
        <div className="absolute w-full h-full border border-white/20 rotate-45"></div>
        <div className="absolute w-[70%] h-[70%] border border-white/20 rotate-45"></div>
        <div className="absolute w-6 h-6 md:w-8 md:h-8 bg-[#002b54] rotate-45"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
        
        {/* Left Side: Title */}
        <div className="flex-1 w-full flex flex-col items-start justify-center font-sans">
          <h2 className="text-[45px] sm:text-[60px] md:text-[80px] lg:text-[100px] font-bold leading-[1] md:leading-[0.9] tracking-tight text-[#f4f4f5]">
            Design<br />
            Head
          </h2>
          <p className="mt-4 md:mt-4 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.1em] md:tracking-[0.2em] text-[#f4f4f5] uppercase">
            IEEE-CS DESIGN TALENT
          </p>
        </div>

        {/* Right Side: Description */}
        <div className="flex-1 w-full flex justify-start md:justify-end">
          <p className="text-[#001f3b] text-base sm:text-lg md:text-xl lg:text-[22px] leading-[1.6] max-w-md font-medium text-left">
            Built within a collaborative<br className="hidden md:block"/>
            IEEE-CS environment, these<br className="hidden md:block"/>
            projects represent shared<br className="hidden md:block"/>
            learning, peer feedback, and<br className="hidden md:block"/>
            the collective drive to raise<br className="hidden md:block"/>
            creative standards
          </p>
        </div>
      </div>
    </section>
  );
}
