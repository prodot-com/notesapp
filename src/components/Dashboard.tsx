"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Note from "@/lib/logo";
import {
  FileText,
  Upload,
  Settings,
  Sun,
  Moon,
  LogOut,
  Home,
} from "lucide-react";

export default function Dashboard({
  session,
  children,
}: {
  session: any;
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] text-[#1A1A1A] dark:text-neutral-100 flex transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-neutral-300 dark:border-neutral-800 flex flex-col bg-white dark:bg-[#0a0a0a] sticky top-0 h-screen z-20">
        
        <div className="p-6 flex items-center gap-3">
          <Note className="text-2xl text-neutral-900 dark:text-white" />
          <span className="hidden md:block font-medium tracking-tight">
            paperless
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard">
            <SidebarItem icon={<Home size={20} />} label="Home" />
          </Link>

          <Link href="/dashboard/notes">
            <SidebarItem icon={<FileText size={20} />} label="Notes" />
          </Link>

          <Link href="/dashboard/upload">
            <SidebarItem icon={<Upload size={20} />} label="Files" />
          </Link>

          <Link href="/dashboard/settings">
            <SidebarItem icon={<Settings size={20} />} label="Settings" />
          </Link>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="hidden md:block text-sm font-medium">
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={session?.user?.image}
                alt="profile"
                className="w-10 h-10 rounded-full border"
              />
              <div className="hidden md:block">
                <p className="font-bold text-indigo-500">
                  {session?.user?.name}
                </p>
                <p className="text-xs truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-neutral-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="cursor-pointer flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-all">
      {icon}
      <span className="hidden md:block text-sm font-medium">
        {label}
      </span>
    </div>
  );
}
