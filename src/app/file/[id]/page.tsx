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
        const res = await fetch(
          `/api/upload/${id}/view?token=${token || ""}`
        );
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

    if (
      m === "application/msword" ||
      m ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return "doc";

    if (
      m ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
      return "ppt";

    if (m === "application/zip") return "zip";

    return "unknown";
  };

  const category = getCategory(data?.fileType);

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/upload/${id}/download?token=${token || ""}`);

      if (!res.ok) throw new Error("Download failed");

      const { url } = await res.json();

      const link = document.createElement("a");
      link.href = url;
      link.download = data?.name || "";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <h3 className="font-serif italic text-xl dark:text-white mt-6">
          Accessing Vault...
        </h3>
      </div>
    );
  }

  if (!data?.url) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <AlertCircle size={48} className="text-red-500 mb-6 mx-auto" />
          <h2 className="text-3xl font-serif italic mb-4">
            Asset Unavailable
          </h2>
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-black text-white rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] dark:bg-[#0a0a0a]">
      
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b bg-white/70 dark:bg-black/70 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-3">
            <Logo className="w-7 h-7" />
            <span className="font-serif italic text-lg dark:text-white">
              paperless
            </span>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-2 text-blue-600 text-[10px] uppercase">
              <ShieldCheck size={12} />
              Verified
            </div>
            <p className="text-sm text-neutral-500 truncate max-w-[200px]">
              {data.name}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2 border rounded-lg flex items-center gap-2 text-sm"
          >
            <Download size={16} />
            Download
          </button>

          <a
            href={data.url}
            target="_blank"
            className="px-4 py-2 bg-black text-white rounded-lg text-sm flex items-center gap-2"
          >
            <Maximize2 size={14} />
            Open
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
            <img
              src={data.url}
              alt={data.name}
              className="max-w-full max-h-full object-contain"
            />
          )}

          
          {category === "pdf" && (
            <iframe
              src={data.url}
              className="w-full h-[85vh]"
            />
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
    </div>
  );
}


function TextViewer({ url }: { url: string }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then(setContent)
      .catch(() => setContent("Failed to load file"));
  }, [url]);

  return (
    <pre className="w-full h-full p-6 overflow-auto text-sm whitespace-pre-wrap">
      {content}
    </pre>
  );
}