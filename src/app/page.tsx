"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Note from "@/lib/logo";
import { Sun, Moon, X, ArrowRight, Github } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Landing = () => {
  const [loginModal, setLoginModal] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
  };

  const manageSignin = () => {
    session ? router.push('/dashboard') : setLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#050505] text-[#1A1A1A] dark:text-neutral-100 font-sans selection:bg-orange-100 overflow-x-hidden transition-colors duration-500">
      
      {/* --- SARVAM STYLE GRADIENT HEADER GLOW --- */}
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[140%] h-[400px] bg-gradient-to-b from-orange-400/40 via-blue-400/20 to-transparent blur-[120px] dark:from-orange-600/20 dark:via-blue-600/10" />
      </div>

      {/* --- REFINED NAV --- */}
      <nav className="relative z-50 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push('/')}>
          <Note className="text-3xl text-neutral-900 dark:text-white transition-transform group-hover:rotate-12"/>
          <span className="text-xl font-bold tracking-tighter uppercase">paperless</span>
        </div>
        
        {/* Sarvam Center Links Mockup */}
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
          <Link href="/dashboard" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">Workspace <ArrowRight size={10}/></Link>
          <Link href="https://github.com/prodot-com/paperless" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">Open Source <ArrowRight size={10}/></Link>
          <Link href="https://probalghosh.dev" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">Developer <ArrowRight size={10}/></Link>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2.5 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-full hover:scale-110 transition-all">
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </button>
          <button 
            onClick={manageSignin}
            className="bg-neutral-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all active:scale-95"
          >
            {session ? "Enter Workspace" : "Experience Paperless"}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 max-w-5xl mx-auto pt-20 md:pt-32 pb-24 px-6 text-center">
        
        {/* India Sovereign Label Style */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-10"
        >
          Built by Probal Ghosh • India
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-7xl md:text-[5.5rem] font-serif tracking-tight leading-[1.05] text-neutral-900 dark:text-white mb-8"
        >
          Digital archives for <br /> all from India
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-12"
        >
          Built on minimalist architecture. Powered by Probal Ghosh. <br className="hidden md:block" />
          Delivering high-fidelity asset management at scale.
        </motion.p>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={manageSignin}
          className="bg-neutral-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-2xl hover:shadow-orange-500/20 transition-all mb-32"
        >
          Experience Paperless
        </motion.button>

        {/* --- DUAL MOCKUP SECTION (Light/Dark Switch) --- */}
        <div className="relative w-full aspect-video max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-500/10 blur-[100px] opacity-50 -z-10" />
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full h-full rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden bg-white dark:bg-black"
          >
            <Image src="/light.png" alt="Light UI" fill className="object-contain p-2 dark:hidden" priority />
            <Image src="/dark.png" alt="Dark UI" fill className="object-contain p-2 hidden dark:block" priority />
          </motion.div>
        </div>
      </main>

      {/* --- FOOTER --- */}
    <footer className="relative w-full bg-white dark:bg-[#0a0a0a] overflow-hidden transition-colors">
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-10 px-4">
        {[
          { label: "Github", href: "https://github.com/prodot-com/paperless" },
          { label: "Contact", href: "https://probalghosh.dev" },
          { label: "Documentation", href: "https://github.com/prodot-com/paperless/blob/main/README.md" },
          { label: "License", href: "https://github.com/prodot-com/paperless/tree/main?tab=GPL-3.0-1-ov-file#readme" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="group relative px-5 py-2 transition-all duration-300 active:scale-95"
          >
            <span className="relative z-10 text-[10px] md:text-xs uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              {link.label}
            </span>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-1px bg-blue-500 transition-all duration-300 group-hover:w-1/3 opacity-50" />
          </a>
        ))}
      </div>

      <p className="mt-5 text-center text-xs md:text-sm text-gray-500 dark:text-neutral-600">
        Build by{" "}
        <a 
        href="https://probalghosh.dev"
        target="_blank">
          <span className="font-bold hover:underline cursor-pointer">Probal</span>
        </a>
      </p>
      <p className="mt-5 text-center text-xs md:text-sm text-gray-500 dark:text-neutral-600">
        © 2026 Notes Buddy. All rights reserved.
      </p>

      <div className="pointer-events-none select-none mt-5 text-center">
        <h1 className="text-[4rem] sm:text-[8rem] md:text-[14rem] font-extrabold text-gray-200 dark:text-neutral-900 leading-none mb-1">
          paperless<span className="text-indigo-600 font-normal">.</span>
        </h1>
        <div className="absolute bottom-0 w-full bg-linear-to-t from-gray-500/20 dark:from-neutral-900/40 via-transparent to-transparent h-5"></div>
      </div>
    </footer>

      {/* --- MODAL (Kept consistent with your style) --- */}
      <AnimatePresence>
        {loginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-white/20 dark:bg-black/20">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] shadow-2xl p-10 text-center">
              <button onClick={() => setLoginModal(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-black dark:hover:text-white"><X size={20}/></button>
              <Note className="text-5xl mx-auto mb-6 dark:text-white" />
              <h3 className="text-2xl font-serif italic mb-2">Welcome back</h3>
              <p className="text-xs text-neutral-400 mb-8 uppercase tracking-widest">Select your identity to continue</p>
              <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-neutral-50 transition-all shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;