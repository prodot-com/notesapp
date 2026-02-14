"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  File, 
  MoreVertical, 
  Eye, 
  Download, 
  Trash2, 
  Share2, 
  Type, 
  Search,
  HardDrive
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FileItem = {
  id: string;
  name: string;
  path: string;
  size: number;
  createdAt: string;
};

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/upload").then((res) => res.json()).then(setFiles);
    }
  }, [status]);

  async function uploadFile(selectedFile?: File) {
    const fileToUpload = selectedFile || file;
    if (!fileToUpload) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", fileToUpload);

    await fetch("/api/upload", { method: "POST", body: formData });
    setFile(null);
    setLoading(false);

    const res = await fetch("/api/upload");
    setFiles(await res.json());
  }

  if (status === "loading") return <div className="p-12 animate-pulse text-neutral-400">Syncing vault...</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] transition-colors p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
              <HardDrive size={14} />
              <span>Digital Asset Manager</span>
            </div>
            <h1 className="text-4xl font-light tracking-tight italic font-serif italic text-neutral-900 dark:text-white">File Vault</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">
              Logged in as <span className="font-medium text-neutral-800 dark:text-neutral-200">{session?.user?.email}</span>
            </p>
          </div>
        </header>

        {/* Drag & Drop Zone */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) uploadFile(droppedFile);
          }}
          className={`relative group border-2 border-dashed rounded-3xl p-12 transition-all duration-500 flex flex-col items-center justify-center bg-white dark:bg-[#0d0d0d] ${
            isDragging ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-[0.99]" : "border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-100 dark:shadow-none"
          }`}
        >
          <div className={`p-4 rounded-2xl mb-4 transition-colors ${isDragging ? "bg-blue-500 text-white" : "bg-neutral-50 dark:bg-neutral-900 text-neutral-400"}`}>
            <Upload size={32} className={loading ? "animate-bounce" : ""} />
          </div>
          <h3 className="text-lg font-medium mb-1">
            {loading ? "Uploading your asset..." : "Drop file to store"}
          </h3>
          <p className="text-sm text-neutral-400 mb-6">PDF, Images, or Documents up to 50MB</p>
          
          <label className="cursor-pointer bg-[#1A1A1A] dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition-all">
            Choose File
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => uploadFile(e.target.files?.[0] || undefined)} 
            />
          </label>
        </div>

        {/* File List */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Stored Assets ({files.length})</h2>
            <div className="h-[1px] flex-1 bg-neutral-100 dark:bg-neutral-900 mx-6" />
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {files.length === 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-neutral-300 italic">The vault is currently empty.</motion.p>
              )}
              {files.map((f) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={f.id}
                  className="group bg-white dark:bg-[#0d0d0d] border border-neutral-100 dark:border-neutral-800 p-4 rounded-2xl flex items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-600 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-neutral-50 dark:bg-neutral-900 rounded-xl flex items-center justify-center text-neutral-400 group-hover:text-blue-500 transition-colors">
                      <File size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate pr-4">{f.name}</p>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-tighter font-bold">
                        {Math.round(f.size / 1024)} KB • {new Date(f.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <FileActionBtn icon={<Eye size={16} />} onClick={() => handleAction(f.id, 'view')} label="View" />
                    <FileActionBtn icon={<Type size={16} />} onClick={() => handleRename(f)} label="Rename" />
                    <FileActionBtn icon={<Download size={16} />} onClick={() => handleAction(f.id, 'download')} label="Save" />
                    <FileActionBtn icon={<Share2 size={16} />} onClick={() => handleShare(f.id)} label="Share" />
                    <div className="w-[1px] h-4 bg-neutral-100 dark:bg-neutral-800 mx-2" />
                    <button 
                      onClick={() => handleDelete(f.id)}
                      className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper logic functions to keep TSX clean
  async function handleAction(id: string, action: string) {
    const res = await fetch(`/api/upload/${id}/${action}`);
    const { url } = await res.json();
    window.open(url, "_blank");
  }

  async function handleRename(f: FileItem) {
    const newName = prompt("Enter a new identifier", f.name);
    if (!newName || newName === f.name) return;
    await fetch(`/api/upload/${f.id}/rename`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    setFiles((prev) => prev.map((x) => (x.id === f.id ? { ...x, name: newName } : x)));
  }

  async function handleShare(id: string) {
    const res = await fetch("/api/share/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "file", resourceId: id, expiresInHours: 24 }),
    });
    const { url } = await res.json();
    await navigator.clipboard.writeText(url);
    alert("Share link copied to clipboard");
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this asset forever?")) return;
    await fetch(`/api/upload/${id}`, { method: "DELETE" });
    setFiles((prev) => prev.filter((x) => x.id !== id));
  }
}

function FileActionBtn({ icon, onClick, label }: { icon: any, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 p-2 px-3 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-all"
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">{label}</span>
    </button>
  );
}