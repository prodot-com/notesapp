"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  File as FileIcon,
  ShieldCheck,
  Maximize2,
  Info,
  AlertCircle
} from "lucide-react";
import Logo from "@/lib/logo";

type FileResponse = {
  url: string;
  name?: string;
  fileType?: string;
};

export default function FileViewer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const token = searchParams.get("token");

  const [data, setData] = useState<FileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchFile = async () => {
      try {
        const res = await fetch(`/api/upload/${id}/view?token=${token || ""}`);
        const json = await res.json();
        if (!res.ok) throw new Error();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [id, token]);

  const getCategory = (mime?: string) => {
    if (!mime) return "unknown";
    const m = mime.toLowerCase();
    if (m.startsWith("image/")) return "image";
    if (m === "application/pdf") return "pdf";
    if (m.startsWith("video/")) return "video";
    if (m.startsWith("audio/")) return "audio";
    if (m.startsWith("text/") || m.includes("json") || m.includes("javascript")) return "text";
    return "unknown";
  };

  const category = getCategory(data?.fileType);

  if (loading) {
    return (
      <div className="h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} strokeWidth={1.5} />
        <h3 className="font-serif italic text-xl dark:text-white mt-6">Accessing Vault...</h3>
      </div>
    );
  }

  if (!data?.url) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] flex items-center justify-center p-6 text-center">
        <div className="max-w-sm">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-3xl font-serif italic mb-4 dark:text-white">Asset Offline</h2>
          <button onClick={() => router.back()} className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-xs font-bold uppercase tracking-widest transition-transform active:scale-95">
            Return to Vault
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#FDFDFD] dark:bg-[#0a0a0a] transition-colors relative">
      {/* Signature Grid Pattern - Fixed so it stays while scrolling */}
      <div className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2.5 mr-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-4 border-l border-neutral-200 dark:border-neutral-800 pl-6">
            <div className="flex items-center gap-2 group cursor-default">
              <Logo className="w-8 h-8 dark:text-white text-black -rotate-6 transition-transform duration-500" />
              <span className="font-serif font-bold italic text-xl tracking-tight dark:text-white">paperless</span>
            </div>
            
            <div className="hidden md:block ml-4">
              <div className="flex items-center gap-2 text-blue-600 text-[9px] uppercase font-black tracking-[0.2em] mb-0.5">
                <ShieldCheck size={10} />
                <span>Identity Verified</span>
              </div>
              <h1 className="text-sm font-medium text-neutral-900 dark:text-white truncate max-w-[200px]">
                {data.name || "Unnamed Asset"}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <a
            href={data.url}
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-all shadow-xl active:scale-95"
          >
            <Maximize2 size={14} />
            <span className="hidden sm:inline">Open Original</span>
          </a>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        
        {/* The Archive Canvas - Height now adapts or uses a large min-height */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full min-h-[60vh] bg-white dark:bg-[#050505] rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] dark:shadow-none border border-neutral-200 dark:border-neutral-800 overflow-hidden flex items-center justify-center p-1"
        >
          <div className="w-full h-full min-h-[60vh] rounded-[2.2rem] overflow-hidden bg-neutral-50 dark:bg-[#080808] flex items-center justify-center">
            {category === "image" && (
              <img 
                src={data.url} 
                alt={data.name} 
                className="w-full h-auto max-w-full object-contain drop-shadow-2xl p-4 md:p-8" 
              />
            )}

            {category === "pdf" && (
              <iframe 
                src={`${data.url}#toolbar=0`} 
                className="w-full min-h-[85vh] border-none" 
                title="Vault PDF" 
              />
            )}

            {category === "video" && (
              <video src={data.url} controls className="max-w-full h-auto rounded-xl shadow-2xl p-4 md:p-8" />
            )}

            {category === "audio" && (
              <div className="my-20 flex flex-col items-center gap-8 p-12 w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-xl">
                 <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <div className="flex gap-1 items-end h-8">
                       {[0.4, 0.7, 1, 0.6, 0.8].map((v, i) => (
                          <motion.div 
                            key={i}
                            animate={{ height: ["20%", "100%", "20%"] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                            className="w-1.5 bg-current rounded-full"
                          />
                       ))}
                    </div>
                 </div>
                 <audio src={data.url} controls className="w-full" />
              </div>
            )}

            {category === "text" && (
              <iframe src={data.url} className="w-full min-h-[80vh] border-none bg-white p-8" />
            )}

            {category === "unknown" && (
              <div className="py-32 flex flex-col items-center gap-6 text-center">
                <div className="w-24 h-24 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-300">
                  <FileIcon size={40} strokeWidth={1} />
                </div>
                <p className="text-sm font-serif italic text-neutral-900 dark:text-white">Preview unavailable</p>
              </div>
            )}
          </div>
        </motion.div>
  
      </main>
    </div>
  );
}