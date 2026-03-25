import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function SharedFile({
  params,
}: {
  params: Promise<{ token: string }>;
}) {

  console.log("started")
  const { token } = await params;

  console.log(token)

  const share = await prisma.shareToken.findUnique({
    where: { token },
  });

  console.log(share)
  if (
    !share ||
    share.type !== "file" 
    // (share.expiresAt && share.expiresAt < new Date())
  ) {
    notFound();
  }

  redirect(`/file/${share.resourceId}?token=${token}`);
}