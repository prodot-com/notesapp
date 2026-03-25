"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, FileText, ExternalLink, ArrowLeft, Loader2, Layers } from "lucide-react";

export default function FileViewer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const token = searchParams.get("token");

  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUrl = async () => {
      try {
        const res = await fetch(
          `/api/upload/${id}/view?token=${token || ""}`
        );

        const data = await res.json();

        if (!res.ok) throw new Error("Failed");

        setUrl(data.url);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, [id, token]);

  // Premium Loading State matching the UploadPage aesthetic
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl p-14 flex flex-col items-center justify-center 
                     bg-white/70 dark:bg-[#0f0f0f]/70 backdrop-blur-2xl 
                     border border-neutral-200/60 dark:border-neutral-800/60 
                     shadow-[0_40px_120px_-20px_rgba(0,0,0,0.15)] overflow-hidden w-full max-w-sm"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-150 bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full" />
          </div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative mb-10"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-60" />
            <div className="relative p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-blue-500">
              <Loader2 className="animate-spin" size={30} />
            </div>
          </motion.div>

          <div className="text-center space-y-2 mb-8">
            <motion.h3
              className="text-xl font-medium tracking-tight font-serif italic text-neutral-900 dark:text-white"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Decrypting Asset
            </motion.h3>
            <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-blue-500/70">
              Securing Connection
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Premium Error State
  if (!url) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-12 flex flex-col items-center justify-center text-center
                     bg-white/70 dark:bg-[#0f0f0f]/70 backdrop-blur-2xl 
                     border border-red-100 dark:border-red-900/30 
                     shadow-2xl overflow-hidden w-full max-w-md"
        >
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-red-100 dark:border-red-500/20">
            <AlertCircle size={32} strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-light tracking-tight italic font-serif text-neutral-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
            The secure link to this vault asset has expired or is invalid.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition-all active:scale-95 shadow-lg flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Return to Vault
          </button>
        </motion.div>
      </div>
    );
  }

  // Main Viewer Interface matching paperless aesthetic
  return (
    <div className="h-screen w-full flex flex-col bg-[#FDFDFD] dark:bg-[#0a0a0a] transition-colors overflow-hidden">
      
      {/* Paperless Branding Header */}
      <header className="flex-shrink-0 px-4 md:px-8 py-5 border-b border-neutral-100 dark:border-neutral-900 bg-[#FDFDFD]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl z-50 flex justify-between items-center">
        <div className="flex items-center gap-4 md:gap-8">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 dark:hover:text-white dark:hover:border-neutral-700 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
              <Layers size={12} />
              <span>Paperless Vault</span>
            </div>
            <h1 className="text-xl md:text-2xl font-light tracking-tight italic font-serif text-neutral-900 dark:text-white leading-none">
              Asset Viewer
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-600 bg-white border border-neutral-200 hover:border-neutral-300 hover:text-neutral-900 dark:text-neutral-400 dark:bg-[#0d0d0d] dark:border-neutral-800 dark:hover:border-neutral-600 dark:hover:text-white transition-all shadow-sm"
          >
            <span className="hidden sm:inline">Open Original</span>
            <ExternalLink size={14} strokeWidth={2.5} />
          </a>
        </div>
      </header>

      {/* Viewer Canvas Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 w-full bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xl shadow-neutral-200/50 dark:shadow-none overflow-hidden relative group flex items-center justify-center p-2 md:p-4"
          >
            {/* Ambient Background for Dark Mode */}
            <div className="absolute inset-0 pointer-events-none hidden dark:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            {url.includes("pdf") ? (
              <iframe
                src={url}
                className="relative z-10 w-full h-full border border-neutral-100 dark:border-neutral-800/50 rounded-2xl bg-[#FDFDFD] dark:bg-[#0a0a0a]"
                title="PDF Viewer"
              />
            ) : (
              <img
                src={url}
                alt="File Preview"
                className="relative z-10 max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}