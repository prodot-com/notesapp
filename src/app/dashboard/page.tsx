import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Workspace from "@/components/Workspace";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);

  const totalNotes = await prisma.note.count({
    where: { userId: session?.user?.id },
  });

  const totalFiles = await prisma.file.count({
    where: { userId: session?.user?.id },
  });

  const storageAgg = await prisma.file.aggregate({
    where: { userId: session?.user?.id },
    _sum: { size: true },
  });

  const storageUsed = storageAgg._sum.size ?? 0;

  return (
    <Workspace
      totalNotes={totalNotes}
      totalFiles={totalFiles}
      storageUsed={storageUsed}
    />
  );
}
