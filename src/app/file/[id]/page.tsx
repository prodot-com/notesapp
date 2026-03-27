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
  AlertCircle,
  Download,
  ExternalLink,
  Lock,
  Info,
} from "lucide-react";
import Logo from "@/lib/logo";
import { useSession } from "next-auth/react";
import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";

type FileResponse = {
  url: string;
  name?: string;
  fileType?: string;
  size?: string; // Added for the footer info
};

export default function FileViewer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const token = searchParams.get("token");

  const [data, setData] = useState<FileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const from = searchParams.get("from");
  const showBack = from === "upload";
  const [scale, setScale] = useState(1);
  const [darkBg, setDarkBg] = useState(true);

  const isMobile = typeof window !== "undefined" &&
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

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
    if (m === "text/plain") return "text";
    if (m.includes("word") || m.includes("officedocument.wordprocessingml")) return "doc";
    if (m.includes("presentation") || m.includes("powerpoint")) return "ppt";
    if (m === "application/zip") return "zip";
    return "unknown";
  };

  const category = getCategory(data?.fileType);

  const handleRedirect = () => {
    session ? router.push("/dashboard") : router.push("/");
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/upload/${id}/download?token=${token || ""}`);
      if (!res.ok) throw new Error("Download failed");
      const { url } = await res.json();
      const link = document.createElement("a");
      link.href = url;
      link.download = data?.name || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#FDFDFD] dark:bg-[#050505] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600 absolute" size={48} strokeWidth={1} />
            <Logo className="w-6 h-6 opacity-50" />
        </div>
        <h3 className="font-serif italic text-xl dark:text-zinc-400 mt-8 animate-pulse">
          Decrypting Vault...
        </h3>
      </div>
    );
  }

  if (!data?.url) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center bg-[#FDFDFD] dark:bg-[#050505]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AlertCircle size={48} strokeWidth={1} className="text-zinc-400 mb-6 mx-auto" />
          <h2 className="text-3xl font-serif italic mb-2 dark:text-white">Asset Unavailable</h2>
          <p className="text-zinc-500 mb-8 max-w-xs mx-auto">This link may have expired or you lack the necessary permissions.</p>
          <button
            onClick={() => router.back()}
            className="px-10 py-3 bg-black dark:bg-white dark:text-black text-white rounded-full text-sm font-medium hover:opacity-80 transition-all"
          >
            Return to Safety
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 selection:bg-blue-100 dark:selection:bg-zinc-800">
      
      <header className="sticky top-0 z-50 px-6 py-3 flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-[4px]">
        <div className="flex items-center gap-5">
          
          {showBack && (
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
            >
              <ArrowLeft size={19} strokeWidth={1.5} />
            </button>
          )}

          {showBack && <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />}

          <div 
            className="group flex items-center gap-3 cursor-pointer"
            onClick={handleRedirect}
          >
            <div className="relative">
                <Logo className="w-8 h-8 transition-transform group-hover:scale-105" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-black" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-serif italic font-bold text-2xl leading-tight">paperless</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 cursor-pointer border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg flex items-center gap-2 text-xs font-medium transition-all"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Download</span>
          </button>

          <a
            href={data.url}
            target="_blank"
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded-lg text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <ExternalLink size={15} />
            <span className="hidden sm:inline">External View</span>
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-7xl min-h-[70vh] bg-white dark:bg-black border rounded-[5px] flex items-center justify-center overflow-hidden"
        >

          {category === "image" && (
            <div className={`relative w-full h-full flex items-center justify-center ${darkBg ? "bg-black" : "bg-white"}`}>

<button
  onClick={() => setDarkBg((p) => !p)}
  className="px-3 py-1 text-white text-xs"
>
  BG
</button>
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={5}
                doubleClick={{ mode: "zoomIn" }}
                pinch={{ step: 5 }}
                wheel={{ step: 0.2 }}
              >
                {({
                  zoomIn,
                  zoomOut,
                  resetTransform,
                }) => (
                  <>
                    {/* IMAGE */}
                    <TransformComponent
                      wrapperClass="!w-full !h-full flex items-center justify-center"
                      contentClass="flex items-center justify-center"
                    >
                      <img
                        src={data.url}
                        alt={data.name}
                        className="max-w-full max-h-full object-contain select-none"
                        draggable={false}
                      />
                    </TransformComponent>

                    {/* CONTROLS */}
                    <div className="absolute top-4 right-4 flex gap-2 bg-black/60 backdrop-blur-md p-2 rounded-xl">

                      <button
                        onClick={() => zoomIn()}
                        className="px-3 py-1 text-white text-sm"
                      >
                        +
                      </button>

                      <button
                        onClick={() => zoomOut()}
                        className="px-3 py-1 text-white text-sm"
                      >
                        −
                      </button>

                      <button
                        onClick={() => resetTransform()}
                        className="px-3 py-1 text-white text-sm"
                      >
                        Reset
                      </button>
                    </div>
                  </>
                )}
              </TransformWrapper>

              {/* FILE INFO */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-4 py-2 rounded-full backdrop-blur-md">
                {data.name}
              </div>
            </div>
          )}

          
          {category === "pdf" && (
            isMobile ? (
              <div className="flex flex-col items-center gap-6 py-20 text-center">
                <p className="text-sm text-neutral-500">
                  PDF preview is not supported on your device
                </p>

                <a
                  href={data.url}
                  target="_blank"
                  className="px-6 py-3 bg-black text-white rounded-xl text-sm"
                >
                  Open PDF
                </a>

                <button
                  onClick={handleDownload}
                  className="px-6 py-3 border rounded-xl text-sm"
                >
                  Download
                </button>
              </div>
            ) : (
              <iframe
                src={data.url}
                className="w-full min-h-[85vh]"
              />
            )
          )}

          {category === "text" && <TextViewer url={data.url} />}

          {["doc", "ppt", "zip", "unknown"].includes(category) && (
            <div className="flex flex-col items-center gap-6 text-center py-20">
              <FileIcon size={40} />
              <p>Preview not available</p>
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-black text-white rounded-xl"
              >
                Download File
              </button>
            </div>
          )}
        </motion.div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="px-8 py-6 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 dark:text-zinc-500 text-[13px]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="font-medium">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
                <Lock size={14} />
                <span>Private Access</span>
            </div>
          </div>

          <div className="flex items-center gap-4 truncate max-w-md italic">
            <Info size={14} />
            <span className="truncate">{data.name || "Unnamed Asset"}</span>
            <span className="opacity-50">|</span>
            <span className="uppercase">{category}</span>
          </div>

          <div className="opacity-60 text-[11px] uppercase tracking-widest">
            © {new Date().getFullYear()} Paperless Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}

function TextViewer({ url }: { url: string }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then(setContent)
      .catch(() => setContent("Failed to load file content."));
  }, [url]);

  return (
    <pre className="w-full h-full p-10 overflow-auto text-sm leading-relaxed whitespace-pre-wrap font-mono text-zinc-600 dark:text-zinc-400">
      {content}
    </pre>
  );
}