"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Note from "@/lib/logo";
import { ArrowRight, Github, X, Shield, Zap, Globe, Layout, PenTool, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Landing = () => {
  const [loginModal, setLoginModal] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const manageSignin = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      setLoginModal(true);
    }
  };

  const features = [
    {
      title: "Clean Canvas",
      desc: "Distraction-free markdown editor designed for focus.",
      icon: <PenTool size={20} className="text-blue-500" />,
      delay: 0.1
    },
    {
      title: "Universal Sync",
      desc: "Your notes follow you across every device instantly.",
      icon: <Globe size={20} className="text-orange-500" />,
      delay: 0.2
    },
    {
      title: "Encrypted Vault",
      desc: "Security-first architecture keeps your data private.",
      icon: <Shield size={20} className="text-emerald-500" />,
      delay: 0.3
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans selection:bg-blue-100 overflow-x-hidden transition-colors duration-300">
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-100/40 via-blue-100/40 to-transparent blur-3xl opacity-60" />
      </div>
      
      <div className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.5" className="fill-black" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* --- NAV BAR --- */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-[60] flex justify-between items-center
        px-4 md:px-8 py-3 rounded-2xl backdrop-blur-md bg-white/40 border border-white/20 shadow-sm">
        <div 
          className="flex items-center gap-2 group cursor-pointer" 
          onClick={() => router.push('/')}
        >
          <Note className="text-2xl text-neutral-900 group-hover:rotate-12 transition-transform duration-500" />
          <span className="text-sm md:text-base font-bold tracking-[-0.03em] uppercase text-neutral-900">
            paperless
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          <Link href="/dashboard" className="hover:text-neutral-900 transition-colors">Workspace</Link>
          <Link href="https://github.com/prodot-com/paperless" className="hover:text-neutral-900 transition-colors">Developers</Link>
          <Link href="https://probalghosh.dev" className="hover:text-neutral-900 transition-colors">Company</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="https://github.com/prodot-com/paperless"
            target="_blank"
            className="hidden sm:flex bg-[#1A1A1A] text-white p-2 rounded-full hover:bg-neutral-800 transition-all active:scale-95"
          >
            <Github className="h-4 w-4" />
          </Link>
          <button 
            onClick={manageSignin}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded-full text-xs font-medium hover:bg-blue-600 transition-all shadow-md active:scale-95"
          >
            {session ? "Go to Dashboard" : "Sign in"}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 max-w-7xl mx-auto pt-32 md:pt-48 pb-16 px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/50 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-8"
          >
            Built by Probal Ghosh • v2.0
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl md:text-9xl font-light tracking-tight leading-[1.1] text-neutral-900"
          >
            Thoughts, filed <br />
            <span className="font-serif italic text-neutral-400 underline decoration-blue-500/10 underline-offset-12">effortlessly.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-xl text-base md:text-lg text-neutral-500 font-light leading-relaxed"
          >
            A frictionless interface for your notes and documents. 
            No distractions, just a clean canvas for your digital life.
          </motion.p>

          <div className="mt-12 group relative">
            <button 
              className="cursor-pointer relative z-10 bg-black text-white px-10 py-4 rounded-2xl text-base font-medium hover:opacity-90 transition-all duration-300 flex items-center gap-3 shadow-xl active:scale-95"
              onClick={manageSignin}
            >
              Enter the Vault
              <ArrowRight size={18} />
            </button>
            <div className="absolute inset-0 bg-blue-400/20 blur-3xl -z-10 group-hover:bg-blue-400/40 transition-all duration-700" />
          </div>
        </div>

        {/* MOCKUP PREVIEW */}
        <div className="mt-24 md:mt-36 relative px-4">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full aspect-[16/10] max-w-5xl mx-auto bg-white border border-neutral-200 rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden"
          >
            <Image
              src="/light.png"
              alt="Dashboard Preview"
              fill
              className="object-cover p-2 md:p-4 rounded-2xl"
              priority
            />
          </motion.div>
        </div>

        {/* --- FEATURES GRID --- */}
        <section className="mt-32 md:mt-48">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: f.delay }}
                className="p-10 rounded-3xl border border-neutral-100 bg-white/40 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-medium mb-3 text-neutral-900">{f.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed font-light">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        <section className="mt-32 md:mt-48 mb-20 text-center">
          <div className="bg-neutral-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
             <div className="relative z-10">
                <h2 className="text-3xl md:text-6xl text-white font-light tracking-tight mb-8">
                  The future of filing is <span className="font-serif italic text-neutral-400">paperless.</span>
                </h2>
                <button 
                  onClick={manageSignin}
                  className="mx-auto bg-white text-black px-8 py-4 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-all flex items-center gap-2"
                >
                  Create your first note <ArrowRight size={16} />
                </button>
             </div>
          </div>
        </section>
      </main>

      {/* --- LOGIN MODAL --- */}
      <AnimatePresence>
        {loginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLoginModal(false)}
              className="absolute inset-0 bg-white/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white border border-neutral-100 rounded-3xl shadow-2xl p-10 text-center"
            >
              <button 
                onClick={() => setLoginModal(false)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 mx-auto mb-6 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100">
                <Note className="text-4xl text-neutral-900" />
              </div>
              <h2 className="text-2xl font-medium tracking-tight mb-2 italic font-serif">Welcome back</h2>
              <p className="text-neutral-500 text-sm mb-8">Your digital workspace is ready.</p>
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-200 py-4 rounded-2xl font-medium hover:bg-neutral-50 transition-all shadow-sm active:scale-95"
              >
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="relative w-full bg-[#FDFDFD] border-t border-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12">
            {[
              { label: "Github", href: "https://github.com/prodot-com/paperless" },
              { label: "Contact", href: "https://probalghosh.dev" },
              { label: "Documentation", href: "https://github.com/prodot-com/paperless" },
              { label: "License", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="text-center text-xs text-neutral-400">
            Built by <a href="https://probalghosh.dev" className="font-bold text-neutral-900 hover:underline">Probal</a> • © 2026 Paperless.
          </p>

          <div className="relative mt-16 h-24 md:h-48 overflow-hidden pointer-events-none select-none">
            <h1 className="text-[15vw] font-black text-neutral-100/80 text-center leading-none tracking-tighter">
              paperless<span className="text-blue-600/20">.</span>
            </h1>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;