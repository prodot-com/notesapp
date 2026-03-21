"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { useEffect, useState } from "react"

export default function TiptapEditor({
  content,
  onChange,
}: {
  content: string
  onChange: (val: string) => void
}) {
  const [preview, setPreview] = useState<any>(null)
  const [hoverUrl, setHoverUrl] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  /* --------- HOVER DETECTION --------- */
  useEffect(() => {
    if (!editor) return

    const el = editor.view.dom

    const handleMouseOver = async (e: any) => {
      const target = e.target

      if (target.tagName === "A") {
        const url = target.getAttribute("href")
        setHoverUrl(url)

        // fetch preview
        const res = await fetch("/api/link-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        })

        const data = await res.json()
        setPreview(data)
      }
    }

    const handleLeave = () => {
      setPreview(null)
      setHoverUrl(null)
    }

    el.addEventListener("mouseover", handleMouseOver)
    el.addEventListener("mouseout", handleLeave)

    return () => {
      el.removeEventListener("mouseover", handleMouseOver)
      el.removeEventListener("mouseout", handleLeave)
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="relative border">
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-none outline-none"
      />

      {/* 🔥 Hover Preview */}
      {preview && hoverUrl && (
        <div className="absolute z-50 top-10 left-0 w-72 bg-white dark:bg-neutral-900 border rounded-xl shadow-lg p-3">
          {preview.image && (
            <img
              src={preview.image}
              className="w-full h-36 object-cover rounded"
            />
          )}

          <h3 className="text-sm font-semibold mt-2">
            {preview.title}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2">
            {preview.description}
          </p>
        </div>
      )}
    </div>
  )
}