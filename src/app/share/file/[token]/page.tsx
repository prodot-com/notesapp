import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function SharedFile({
  params,
}: {
  params: Promise<{ token: string }>; // ✅ Promise
}) {
  const { token } = await params; // ✅ MUST await

  console.log("TOKEN:", token);

  const share = await prisma.shareToken.findUnique({
    where: { token },
  });

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

  redirect(`/file/${file.id}`);
}