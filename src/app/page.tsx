"use client";

import React from "react";
import { useRouter } from "next/navigation";

const PaperlessLanding = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-yellow-300 overflow-x-hidden">
      {/* SVG Background Pattern - Grid Paper */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 border-b-4 border-black bg-white">
        <div className="flex items-center gap-2">
          <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <rect width="40" height="40" fill="white" stroke="black" strokeWidth="4" />
            <path d="M10 10H30M10 20H30M10 30H20" stroke="black" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="text-2xl font-black italic tracking-tighter">PAPERLESS</span>
        </div>
        <button 
          onClick={() => router.push("/auth")}
          className="bg-yellow-300 border-4 border-black px-6 py-2 font-bold text-lg hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all"
        >
          LOG IN
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="relative">
          {/* Decorative SVG Sparkle */}
          <svg className="absolute -top-12 -right-12 w-24 h-24 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
          </svg>

          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
            Kill the <br /> 
            <span className="bg-black text-white px-4 py-2 rotate-1 inline-block">Clutter.</span>
          </h1>
        </div>

        <p className="mt-8 max-w-xl text-xl font-medium leading-relaxed border-l-8 border-black pl-4 text-left">
          The minimalist workspace for your thoughts, files, and wild ideas. 
          No paper. No limits. Just pure productivity.
        </p>

        <div className="mt-12 flex flex-wrap gap-6 justify-center">
          <button 
            onClick={() => router.push("/auth")}
            className="bg-black text-white text-2xl px-10 py-5 font-black hover:bg-yellow-300 hover:text-black border-4 border-black shadow-[8px_8px_0px_rgba(254,240,138,1)] transition-all active:translate-y-1"
          >
            START WRITING →
          </button>
        </div>
      </main>

      {/* Feature Grid - Experimental Layout */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 border-t-4 border-black bg-white">
        <div className="p-10 border-b-4 md:border-b-0 md:border-r-4 border-black hover:bg-blue-50 transition-colors group">
          <div className="w-16 h-16 mb-6 bg-blue-400 border-4 border-black flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M12 19l7-7-7-7M5 12h14" /></svg>
          </div>
          <h3 className="text-3xl font-black mb-4 uppercase">Fast Notes</h3>
          <p className="font-bold opacity-70 text-lg">Instant markdown-ready notes that sync before you can blink.</p>
        </div>

        <div className="p-10 border-b-4 md:border-b-0 md:border-r-4 border-black hover:bg-yellow-50 transition-colors group">
          <div className="w-16 h-16 mb-6 bg-yellow-400 border-4 border-black flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
          </div>
          <h3 className="text-3xl font-black mb-4 uppercase">File Vault</h3>
          <p className="font-bold opacity-70 text-lg">Drop images, PDFs, or docs directly into your notes. Boundless storage.</p>
        </div>

        <div className="p-10 hover:bg-green-50 transition-colors group text-black">
          <div className="w-16 h-16 mb-6 bg-green-500 border-4 border-black flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <h3 className="text-3xl font-black mb-4 uppercase">OCR Search</h3>
          <p className="font-bold opacity-70 text-lg">Experimental: We read your uploaded files so you can find them later.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black text-white p-12 overflow-hidden">
         <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <h2 className="text-8xl md:text-[12rem] font-black opacity-20 leading-none -mb-8">PAPERLESS</h2>
            <div className="text-right flex flex-col gap-2 font-bold uppercase tracking-widest">
                <a href="#" className="hover:text-yellow-300 transition-colors">Twitter/X</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Github</a>
                <a href="#" className="hover:text-green-400 transition-colors">Privacy</a>
                <p className="mt-4 text-xs opacity-50 italic">© 2026 Paperless Lab. Build with chaos.</p>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default PaperlessLanding;