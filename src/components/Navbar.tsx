import Link from 'next/link';
import { Layers } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
      <div className="bg-[#2A2A2A] rounded-full px-8 py-4 flex items-center justify-between shadow-2xl backdrop-blur-md bg-opacity-95">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 text-white font-bold tracking-widest text-sm">
          <Layers className="text-[#F5A623] w-5 h-5" />
          <span>DESIGNATHON</span>
          <span className="text-gray-400 font-normal">/26</span>
        </div>

        {/* Links Section */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300 font-medium">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="#gallery" className="hover:text-white transition-colors">Gallery</Link>
          <Link href="#about" className="hover:text-white transition-colors">About IEEE-CS</Link>
          <Link href="#contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        {/* Right Logo (IEEE Computer Society) */}
        <div className="flex items-center pr-2">
          <img 
            src="/ieee-logo.png" 
            alt="IEEE Computer Society" 
            className="h-7 w-auto object-contain mix-blend-screen"
          />
        </div>
      </div>
    </nav>
  );
}
