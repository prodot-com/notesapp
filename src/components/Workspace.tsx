"use client";

import {
  Clock,
  FileText,
  HardDrive,
  Plus,
  Search,
  User,
  ArrowRight,
  X,
  Database,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  totalNotes: number;
  totalFiles: number;
  storageUsed: number;

  recentNotes: {
    id: string;
    title: string | null;
  }[];

  recentFiles: {
    name: string;
  }[];

  session?: {
    name?: string;
    email?: string;
    image?: string;
    id: string;
  };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

export default function Workspace({
  totalNotes,
  totalFiles,
  storageUsed,
  recentNotes,
  recentFiles,
  session,
}: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!search.trim()) return;
    setHasSearched(true);
    router.push(`/dashboard/notes?q=${encodeURIComponent(search)}`);
  };

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  }

  return (
    <main className="relative min-h-screen w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 selection:bg-blue-500/30 overflow-hidden font-sans">
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-400/20 blur-[140px] dark:bg-blue-600/10"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[140px] dark:bg-indigo-600/10"
        />
      </div>

      <div className="relative z-10 p-6 md:p-10 lg:p-16 max-w-7xl mx-auto min-h-screen flex flex-col gap-12">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 w-full"
        >
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-indigo-500 rounded-[24px] blur opacity-20 group-hover:opacity-40 transition duration-500" />
              {session?.image ? (
                <img
                  src={session.image}
                  alt="Avatar"
                  className="relative w-16 h-16 rounded-full border-2 border-white dark:border-neutral-800 object-cover shadow-xl transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="relative w-16 h-16 rounded-[22px] bg-linear-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border-2 border-white dark:border-neutral-700 flex items-center justify-center text-2xl font-serif text-neutral-700 dark:text-neutral-300 shadow-xl transition-transform duration-300 group-hover:scale-105">
                  {session?.email?.[0].toUpperCase() || <User size={24} />}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl tracking-tight text-neutral-900 dark:text-white font-serif flex items-baseline gap-2">
                <span className="italic text-neutral-500 dark:text-neutral-400 font-light">
                  Welcome,
                </span>
                <span className="font-sans font-semibold bg-linear-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {session?.name?.split(" ")[0] || "User"}
                </span>
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-0.5 font-medium">
                {session?.email}
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto relative z-20">
            <div
              className={`relative flex items-center transition-all duration-300 rounded-2xl ${
                isFocused
                  ? "ring-4 ring-blue-500/20 scale-[1.02]"
                  : "hover:scale-[1.01]"
              }`}
            >
              <div
                className={`absolute inset-0 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border transition-all duration-300 rounded-2xl ${
                  isFocused
                    ? "border-blue-500/50 shadow-lg"
                    : "border-neutral-200 dark:border-neutral-800 shadow-sm"
                }`}
              />

              <div className="relative flex items-center w-full md:w-[320px] px-2 py-1.5">
                <Search
                  className={`ml-3 transition-colors duration-300 ${
                    isFocused ? "text-blue-500" : "text-neutral-400"
                  }`}
                  size={18}
                />

                <input
                  value={search}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your workspace..."
                  className="bg-transparent px-3 py-2.5 outline-none flex-1 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400/80 w-full"
                />

                <AnimatePresence>
                  {search && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearch("")}
                      className="p-1.5 mr-1 rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </motion.button>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleSearch}
                  className={`flex items-center justify-center h-8 w-8 rounded-xl transition-all duration-300 ${
                    search.trim() && !hasSearched
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/20 translate-x-0 opacity-100"
                      : "bg-transparent text-transparent pointer-events-none translate-x-2 opacity-0 absolute right-2"
                  }`}
                >
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants}>
            <StatBox
              label="Active Notes"
              value={totalNotes}
              icon={<FileText className="text-blue-500" size={18} />}
              accentColor="group-hover:border-blue-500/30"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatBox
              label="Vault Assets"
              value={totalFiles}
              icon={<HardDrive className="text-emerald-500" size={18} />}
              accentColor="group-hover:border-emerald-500/30"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatBox
              label="Storage Used"
              value={formatBytes(storageUsed)}
              icon={<Database className="text-amber-500" size={18} />}
              accentColor="group-hover:border-amber-500/30"
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          
          <motion.section
            variants={itemVariants}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Recent Sheets
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {recentNotes.length === 0 ? (
                <EmptyState
                  message="No sheets found. Start writing."
                  icon={<FileText size={24} className="opacity-20 mb-2" />}
                />
              ) : (
                recentNotes.map((note) => (
                  <Link
                    key={note.id}
                    href={`/dashboard/notes?id=${note.id}`}
                    className="group relative overflow-hidden p-4 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl transition-all duration-300 hover:shadow-md hover:border-blue-500/30 hover:bg-white dark:hover:bg-neutral-900"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-left duration-300 ease-out rounded-l-2xl" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-400 group-hover:text-blue-500 transition-colors border border-neutral-100 dark:border-neutral-700/50">
                          <FileText size={18} />
                        </div>
                        <span className="font-medium text-[15px] text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                          {note.title || "Untitled Draft"}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-800/50 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <ChevronRight
                          size={16}
                          className="text-neutral-600 dark:text-neutral-300"
                        />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Vault Assets
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {recentFiles.length === 0 ? (
                <EmptyState
                  message="The vault is empty. Upload files."
                  icon={<HardDrive size={24} className="opacity-20 mb-2" />}
                />
              ) : (
                recentFiles.map((file, index) => (
                  <div
                    key={index}
                    className="group p-4 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 w-full overflow-hidden">
                      <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-400 border border-neutral-100 dark:border-neutral-700/50">
                        <HardDrive size={18} />
                      </div>
                      <span className="font-medium text-[15px] text-neutral-700 dark:text-neutral-300 truncate pr-4">
                        {file.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                      Recent
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}

function StatBox({
  label,
  value,
  icon,
  accentColor,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: string;
}) {
  return (
    <div
      className={`group relative p-6 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-lg ${accentColor}`}
    >
      <div className="absolute top-0 right-0 p-6 opacity-5 transform scale-150 -translate-y-4 translate-x-4 transition-transform duration-500 group-hover:scale-[2]">
        {icon}
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700">
            {icon}
          </div>
          <p className="text-[11px] uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-400">
            {label}
          </p>
        </div>
        <p className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 dark:text-white font-serif">
          {value}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  message,
  icon,
}: {
  message: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-10 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center bg-white/30 dark:bg-neutral-900/20 backdrop-blur-sm">
      {icon}
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {message}
      </p>
    </div>
  );
}
