"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Layers, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className={`bg-[#1f1f1f] md:rounded-full px-6 py-[14px] flex flex-col md:flex-row items-center justify-between shadow-2xl border border-white/5 relative transition-all duration-300 ${isOpen ? 'rounded-3xl' : 'rounded-full'}`}>
        
        {/* Top bar (Always visible) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Layers className="text-[#F5A623] w-5 h-5 fill-transparent" />
            <div className="flex items-baseline gap-1">
              <span className="text-white font-[700] tracking-wider text-[13px]">DESIGN</span>
              <span className="text-gray-500 font-normal text-[13px]">/26</span>
            </div>
          </div>

          {/* Right Logo & Menu Button (Mobile) */}
          <div className="flex items-center gap-4 md:hidden">
            <img 
              src="/ieee-logo.png" 
              alt="IEEE Computer Society" 
              className="h-5 w-auto object-contain mix-blend-screen opacity-90"
            />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-1 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div className={`${isOpen ? 'flex' : 'hidden'} mt-6 md:mt-0 md:flex flex-col md:flex-row items-center gap-6 md:gap-7 text-[13px] text-[#A0A0A0] font-semibold w-full md:w-auto pb-4 md:pb-0 transition-all`}>
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Home</Link>
          <Link href="#excellence" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Excellence</Link>
          <Link href="#head" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Talent</Link>
          <Link href="#tomorrow" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Tomorrow</Link>
          <Link href="#gallery" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Gallery</Link>
          <Link href="#contact" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Contact</Link>
        </div>

        {/* Right Logo (Desktop) */}
        <div className="hidden md:flex items-center">
          <img 
            src="/ieee-logo.png" 
            alt="IEEE Computer Society" 
            className="h-6 w-auto object-contain mix-blend-screen opacity-90"
          />
        </div>

      </div>
    </nav>
  );
}
