import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import NotesClient from "@/components/NotesClient";
import EditNote from "@/components/EditNotes";
import NoteLogo from "@/lib/logo";
import { Search, Plus, Filter, LayoutGrid, List as ListIcon } from "lucide-react";
import Link from "next/link";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { q } = await searchParams;
  const query = q ?? "";

  const notes = await prisma.note.findMany({
    where: {
      userId: session.user.id,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] text-[#1A1A1A] dark:text-neutral-100 flex transition-colors">
      
      {/* Permanent Sidebar Wrapper (Keeping consistency with Dashboard) */}
      <div className="flex-1 flex flex-col md:flex-row h-screen overflow-hidden">
        
        {/* Notes List Column */}
        <aside className="w-full md:w-[400px] border-r border-neutral-100 dark:border-neutral-800 flex flex-col bg-white dark:bg-[#0a0a0a] overflow-hidden">
          
          {/* Header & Search */}
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-serif italic tracking-tight">Your Notes</h1>
              <div className="flex gap-2">
                 <button className="p-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                   <LayoutGrid size={18} />
                 </button>
                 <NotesClient /> {/* Assuming this might be your 'Add Note' trigger */}
              </div>
            </div>

            <form className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                name="q"
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 py-2.5 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:border-neutral-300 dark:focus:border-neutral-700 transition-all"
                placeholder="Search vault..."
                defaultValue={query}
              />
            </form>
          </div>

          {/* Scrollable Notes List */}
          <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-3 custom-scrollbar">
            {notes.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="flex justify-center opacity-10">
                  <NoteLogo className="w-12 h-12" />
                </div>
                <p className="text-sm text-neutral-400 font-light italic">No thoughts found in the vault.</p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="group relative">
                  {/* We wrap EditNote to provide the card-style container */}
                  <div className="p-1 hover:translate-x-1 transition-transform">
                     <EditNote note={note} />
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Workspace Preview Column (Experimental) */}
        <main className="hidden md:flex flex-1 bg-[#F9F9F9] dark:bg-[#0d0d0d] items-center justify-center relative">
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="grid-notes" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-notes)" />
            </svg>
          </div>

          <div className="text-center space-y-6 max-w-sm relative z-10">
             <div className="w-16 h-16 bg-white dark:bg-neutral-900 rounded-3xl shadow-xl shadow-neutral-200 dark:shadow-none mx-auto flex items-center justify-center border border-neutral-100 dark:border-neutral-800 rotate-3">
               <Plus className="text-neutral-300" size={32} />
             </div>
             <div>
               <h3 className="text-lg font-medium">Select a note to view</h3>
               <p className="text-sm text-neutral-400 font-light mt-2">
                 Or start a fresh draft to capture your next big idea.
               </p>
             </div>
          </div>
        </main>

      </div>
    </div>
  );
}