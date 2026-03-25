import { Mail, Instagram, Youtube, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-[#1e1e1e] text-white pt-16 md:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12 mb-16 md:mb-32">
          
          {/* Header */}
          <h2 className="text-[35px] sm:text-[45px] md:text-[60px] font-bold leading-[1.1] md:leading-[1.1] tracking-tight text-left">
            Be Part of <span className="text-[#F5A623]">IEEE-CS</span><br/>
            Design Culture
          </h2>

          {/* Newsletter Input */}
          <div className="w-full md:w-auto flex items-center gap-3 md:gap-4 mt-6 md:mt-0">
            <div className="relative w-full md:w-[350px]">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full bg-[#333] border border-transparent focus:border-[#F5A623] text-white placeholder-gray-500 rounded-full py-3 md:py-4 px-6 outline-none transition-all text-sm md:text-base"
              />
            </div>
            <button className="bg-[#F5A623] hover:bg-[#dba120] text-black w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-colors shrink-0">
              <Mail className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Links Array */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16 border-b border-gray-800 pb-12 md:pb-16 text-left">
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 tracking-wider">DESIGNATHON</h4>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-sm md:max-w-xs pr-4">
              IEEE-CS fosters creativity and innovation among students. This gallery celebrates design talent developed through our annual Designathon.
            </p>
          </div>
          
          <div className="col-span-1 flex flex-col gap-3 md:gap-4">
            <h4 className="text-[#F5A623] font-bold tracking-widest text-[10px] md:text-xs uppercase mb-1 md:mb-2">Explore</h4>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">Featured Works</Link>
          </div>

          <div className="col-span-1 flex flex-col gap-3 md:gap-4">
            <h4 className="text-[#F5A623] font-bold tracking-widest text-[10px] md:text-xs uppercase mb-1 md:mb-2">About</h4>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">Designathon</Link>
          </div>

          <div className="col-span-2 md:col-span-1 flex flex-col gap-3 md:gap-4">
            <h4 className="text-[#F5A623] font-bold tracking-widest text-[10px] md:text-xs uppercase mb-1 md:mb-2">Resources</h4>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">Guidelines</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center md:items-center gap-6 md:gap-6 mt-8">
          <p className="text-gray-500 text-[10px] md:text-xs text-center md:text-left mt-4 md:mt-0">
            © IEEE Computer Society – Designathon Gallery
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-800 hover:border-gray-500 transition-all text-gray-400 hover:text-white">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-800 hover:border-gray-500 transition-all text-gray-400 hover:text-white">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-800 hover:border-gray-500 transition-all text-gray-400 hover:text-white">
              <MessageCircle className="w-4 h-4" /> {/* Discord icon placeholder */}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
