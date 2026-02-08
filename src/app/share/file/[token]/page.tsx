import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function SharedFile({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const share = await prisma.shareToken.findUnique({ where: { token } });

  if (
    !share ||
    share.type !== "file" ||
    (share.expiresAt && share.expiresAt < new Date())
  ) {
    notFound();
  }

  const file = await prisma.file.findUnique({
    where: { id: share.resourceId },
  });

  if (!file) notFound();

  redirect(file.path);
}
