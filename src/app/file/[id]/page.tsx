"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function FileViewer() {
  const params = useParams();
  const searchParams = useSearchParams();

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

  if (loading) return <p className="p-6">Loading...</p>;

  if (!url)
    return <p className="p-6 text-red-500">Link expired or invalid</p>;

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="p-4 border-b flex justify-between">
        <h2 className="font-semibold">File Preview</h2>
      </div>

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