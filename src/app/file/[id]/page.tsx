"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Loader2,
  FileText,
  ImageIcon,
  Video,
  Music,
  File,
} from "lucide-react";

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

        console.log("json",json)
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

    if (mime.startsWith("image/")) return "image";
    if (mime === "application/pdf") return "pdf";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";
    if (
      mime.startsWith("text/") ||
      mime.includes("json") ||
      mime.includes("javascript")
    )
      return "text";

    return "unknown";
  };

  // const fileType = data?.fileType || "";
  // console.log(data + "data")

  const category = getCategory(data?.fileType);

  const handleDownload = async () => {
    if (!data?.url) return;

    try {
      const res = await fetch(data.url);
      const blob = await res.blob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = data.name || `file-${id}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!data?.url) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">File not available</p>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-black">
      
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="px-3 py-2 border rounded-lg text-sm flex items-center gap-2"
          >
            <Download size={16} />
            Download
          </button>

          <a
            href={data.url}
            target="_blank"
            className="px-3 py-2 border rounded-lg text-sm flex items-center gap-2"
          >
            <ExternalLink size={16} />
            Open
          </a>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {category === "image" && (
          <img
            src={data.url}
            className="max-w-full max-h-full object-contain"
          />
        )}

        {category === "pdf" && (
          <iframe
            src={data.url}
            className="w-full h-full border-none"
          />
        )}

        {category === "video" && (
          <video
            src={data.url}
            controls
            className="max-w-full max-h-full"
          />
        )}

        {category === "audio" && (
          <audio src={data.url} controls className="w-full max-w-md" />
        )}

        {category === "text" && (
          <iframe
            src={data.url}
            className="w-full h-full border rounded"
          />
        )}

        {category === "unknown" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <File size={40} />
            <p className="text-sm text-neutral-500">
              Preview not available for this file type
            </p>
            <button
              onClick={handleDownload}
              className="px-4 py-2 border rounded-lg"
            >
              Download File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}