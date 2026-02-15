import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/settingsClient";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");

  const storageAgg = await prisma.file.aggregate({
    where: { userId: session.user.id },
    _sum: { size: true },
  });

  const totalFiles = await prisma.file.count({
    where: { userId: session.user.id },
  });

  const totalNotes = await prisma.note.count({
    where: { userId: session.user.id },
  });

  return (
    <SettingsClient
      session={session.user}
      storageUsed={storageAgg._sum.size ?? 0}
      totalFiles={totalFiles}
      totalNotes={totalNotes}
    />
  );
}
