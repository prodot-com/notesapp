"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function FileViewer() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUrl = async () => {
      try {
        const res = await fetch(`/api/upload/${id}/view`);

        console.log("STATUS:", res.status);

        const data = await res.json();
        console.log("DATA:", data);

        if (!res.ok) throw new Error("Failed");

        setUrl(data.url);
      } catch (err) {
        console.error("ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!url) return <p className="p-6 text-red-500">Failed to load file</p>;

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex justify-between">
        <h2 className="font-semibold">File Preview</h2>
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="text-sm text-blue-500"
        >
          Share
        </button>
      </div>

      {/* Viewer */}
      <div className="flex-1">
        {url.includes("pdf") ? (
          <iframe src={url} className="w-full h-full" />
        ) : (
          <img src={url} className="w-full h-full object-contain" />
        )}
      </div>
    </div>
  );
}