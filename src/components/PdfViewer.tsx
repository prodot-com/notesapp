"use client";

import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
import "pdfjs-dist/build/pdf.worker.entry";

type Props = {
  url: string;
};

export default function PdfViewer({ url }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;

      const page = await pdf.getPage(1); // first page
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current!;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

    await page.render({
        canvas,
        viewport,
    }).promise;
    };

    loadPdf();
  }, [url]);

  return (
    <div className="w-full flex justify-center overflow-auto">
      <canvas ref={canvasRef} />
    </div>
  );
}