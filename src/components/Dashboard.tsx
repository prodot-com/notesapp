"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Note from "@/lib/logo";
import { 
  FileText, 
  Upload, 
  Settings, 
  Search, 
  Plus, 
  Sun, 
  Moon, 
  LogOut, 
  Clock, 
  HardDrive 
} from "lucide-react";

export default function DashboardClient({ session }: { session: any }) {
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

  useEffect(()=>{
    console.log(session)
  })

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] text-[#1A1A1A] dark:text-neutral-100 flex transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 border-r border-neutral-100 dark:border-neutral-800 flex flex-col bg-white dark:bg-[#0a0a0a] sticky top-0 h-screen z-20 transition-colors">
        <div className="p-6 flex items-center gap-3">
          <Note className="text-2xl text-neutral-900 dark:text-white" />
          <span className="hidden md:block font-medium tracking-tight">paperless</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem href="/dashboard" icon={<FileText size={20} />} label="Notes" active />
          <SidebarItem href="/upload" icon={<Upload size={20} />} label="Files" />
          <SidebarItem href="/settings" icon={<Settings size={20} />} label="Settings" />
          
          {/* Theme Toggle in Sidebar for Mobile/Cleanliness */}
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all group"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="hidden md:block text-sm font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </nav>

        {/* Added: Storage Meter */}
        <div className="px-6 py-4 hidden md:block">
          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2">
            <span>Storage</span>
            <span>65%</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[65%] rounded-full" />
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
           <div className="flex items-center justify-between gap-3 px-2 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group relative">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-600">
                  {/* {session.user?.email?.[0].toUpperCase()} */}
                </div>
                <div className="hidden md:block overflow-hidden">
                  {/* <p className="text-xs font-medium truncate">{session.user?.email}</p> */}
                </div>
              </div>
              <button 
                onClick={() => signOut()}
                className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="relative z-10 p-8 md:p-12 max-w-6xl mx-auto">
          
          {/* Welcome Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-neutral-400 text-sm mb-2">
                <Clock size={14} />
                <span>Last synced: Just now</span>
              </div>
              <h1 className="text-4xl font-light tracking-tight italic font-serif italic">Workspace</h1>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium hover:border-neutral-900 dark:hover:border-neutral-400 transition-all">
                <Search size={18} />
                <span className="hidden sm:inline">Search</span>
              </button>
              <button className="bg-[#1A1A1A] dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg shadow-neutral-200 dark:shadow-none">
                <Plus size={18} />
                New Entry
              </button>
            </div>
          </header>

          {/* Added: Quick Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <StatBox label="Total Notes" value="24" />
            <StatBox label="Attached Files" value="142" />
            <StatBox label="Space Used" value="1.2 GB" />
            <StatBox label="Drafts" value="3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DashboardCard 
              href="/notes"
              title="Notes"
              description="Capture thoughts in markdown. Organized by date and relevance."
              icon={<FileText size={24} className="text-blue-500" />}
              color="bg-blue-50/50 dark:bg-blue-500/10"
            />
            <DashboardCard 
              href="/upload"
              title="File Vault"
              description="Your encrypted storage for PDFs, images, and documents."
              icon={<HardDrive size={24} className="text-emerald-500" />}
              color="bg-emerald-50/50 dark:bg-emerald-500/10"
            />
          </div>

        </div>
      </main>
    </div>
  );
}

// Internal Sub-components
function SidebarItem({ href, icon, label, active = false }: any) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${active ? 'bg-neutral-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400' : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white'}`}>
      {icon}
      <span className="hidden md:block text-sm font-medium">{label}</span>
    </Link>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-white dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 p-5 rounded-2xl">
      <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-1">{label}</p>
      <p className="text-2xl font-light tracking-tight">{value}</p>
    </div>
  );
}

function DashboardCard({ href, title, description, icon, color }: any) {
  return (
    <Link href={href} className="group relative block h-full">
      <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-100 dark:border-neutral-800 p-8 rounded-3xl shadow-sm hover:border-neutral-300 dark:hover:border-neutral-600 transition-all flex flex-col h-full">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6`}>
          {icon}
        </div>
        <h2 className="text-xl font-medium mb-2 tracking-tight">{title}</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed flex-grow">
          {description}
        </p>
        <div className="mt-8 flex items-center text-xs font-bold uppercase tracking-wider text-neutral-300 group-hover:text-blue-500 transition-colors">
          Explore →
        </div>
      </div>
    </Link>
  );
}