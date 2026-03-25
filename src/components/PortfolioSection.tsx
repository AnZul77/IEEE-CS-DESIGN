export default function PortfolioSection() {
  return (
    <section id="gallery" className="relative w-full py-16 md:py-24 bg-[#f4ebe1]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full flex flex-col items-start md:items-center">
        
        {/* Top Pill */}
        <div className="bg-[#333] text-white text-[10px] font-bold tracking-wider px-4 py-1.5 rounded-full mb-6 md:mb-8 uppercase self-start md:self-center">
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

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {/* Item 1 */}
          <div className="w-full aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-lg relative group">
            {/* Placeholder using a gradient and shapes since we don't have the exact image */}
            <div className="absolute inset-0 bg-[#f8f1e7] flex items-center justify-center overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-[60%] bg-[#2a7a78] rotate-12 transform origin-top-left"></div>
               <div className="absolute bottom-0 right-0 w-[80%] h-[50%] bg-[#e07a5f] -rotate-12 transform origin-bottom-right"></div>
               <div className="absolute w-[40%] aspect-square bg-[#ffdfba] rounded-full z-10 shadow-xl"></div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="w-full aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-lg relative group">
            {/* Placeholder for plants image */}
            <div className="absolute inset-0 bg-[#e3ecd7] flex items-center justify-center p-6 md:p-8">
               <div className="w-full h-full border-4 border-[#c3d6ac] rounded-lg relative overflow-hidden bg-white/50">
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-[#81b255] rounded-t-full"></div>
               </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="w-full aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-lg relative group sm:col-span-2 md:col-span-1 sm:w-1/2 md:w-full sm:mx-auto md:mx-0">
            {/* Placeholder for statue illustration */}
            <div className="absolute inset-0 bg-white flex items-center justify-center">
               <div className="w-[60%] h-[80%] border-2 border-black rounded-t-full relative">
                  <div className="absolute top-1/4 left-[-10%] w-6 h-6 md:w-8 md:h-8 rounded-full bg-pink-500"></div>
                  <div className="absolute top-10 right-[-10%] w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-400"></div>
                  <div className="absolute bottom-0 w-full h-1/4 bg-yellow-400 border-t-2 border-black"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
