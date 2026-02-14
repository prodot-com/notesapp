"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Added to highlight active tabs
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
    storageUsed,
    children,
}: {
    session: any;
    storageUsed: number;
    children: React.ReactNode;
}) {
    const [isDark, setIsDark] = useState(false);
    const pathname = usePathname();

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

    const maxStorage = 1 * 1024 * 1024 * 1024;
    const percent = Math.min((storageUsed / maxStorage) * 100, 100);
    const roundedPercent = percent.toFixed(2);

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] text-[#1A1A1A] dark:text-neutral-100 flex flex-col md:flex-row transition-colors duration-300">

            <aside className="hidden md:flex w-64 border-r border-neutral-300 dark:border-neutral-800 flex-col bg-white dark:bg-[#0a0a0a] sticky top-0 h-screen z-20">
              
                <div className="p-6 flex items-center gap-3">
                    <Note className="text-2xl text-neutral-900 dark:text-white" />
                    <span className="font-medium tracking-tight">paperless</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link href="/dashboard">
                        <SidebarItem icon={<Home size={20} />} label="Home" active={pathname === "/dashboard"} />
                    </Link>
                    <Link href="/dashboard/notes">
                        <SidebarItem icon={<FileText size={20} />} label="Notes" active={pathname.startsWith("/dashboard/notes")} />
                    </Link>
                    <Link href="/dashboard/upload">
                        <SidebarItem icon={<Upload size={20} />} label="Files" active={pathname.startsWith("/dashboard/upload")} />
                    </Link>
                    <Link href="/dashboard/settings">
                        <SidebarItem icon={<Settings size={20} />} label="Settings" active={pathname.startsWith("/dashboard/settings")} />
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="text-sm font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                </nav>

                
                <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="mb-4">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2">
                            <span>Storage</span>
                            <span>{roundedPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all" style={{ width: `${percent}%` }} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <img src={session?.user?.image} alt="profile" className="w-8 h-8 rounded-full border border-neutral-200" />
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-indigo-500 truncate">{session?.user?.name}</p>
                            </div>
                        </div>
                        <button onClick={() => signOut({ callbackUrl: "/" })} className="text-neutral-400 hover:text-red-500 transition-colors">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            
            <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-[#0a0a0a] border-b border-neutral-100 dark:border-neutral-900 sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <Note className="text-xl" />
                    <span className="font-medium text-sm tracking-tight">paperless</span>
                </div>
                <button onClick={toggleTheme} className="p-2 text-neutral-500">
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </header>

            
            <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
                {children}
            </main>

            
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-neutral-100 dark:border-neutral-800 px-6 py-3 flex justify-between items-center z-40">
                <MobileTab href="/dashboard" icon={<Home size={22} />} active={pathname === "/dashboard"} />
                <MobileTab href="/dashboard/notes" icon={<FileText size={22} />} active={pathname.startsWith("/dashboard/notes")} />
                <MobileTab href="/dashboard/upload" icon={<Upload size={22} />} active={pathname.startsWith("/dashboard/upload")} />
                <MobileTab href="/dashboard/settings" icon={<Settings size={22} />} active={pathname.startsWith("/dashboard/settings")} />
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-neutral-400 p-2">
                    <LogOut size={22} />
                </button>
            </nav>
        </div>
    );
}

function SidebarItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <div className={`cursor-pointer flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
            active ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white"
        }`}>
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}

function MobileTab({ href, icon, active }: { href: string; icon: React.ReactNode; active: boolean }) {
    return (
        <Link href={href} className={`p-2 rounded-lg transition-colors ${active ? "text-blue-600 dark:text-blue-400" : "text-neutral-400"}`}>
            {icon}
        </Link>
    );
}