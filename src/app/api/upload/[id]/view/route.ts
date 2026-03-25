import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
){
  console.log("started 2")
  const session = await getServerSession(authOptions);

  const {id} = await params;
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  const file = await prisma.file.findUnique({
    where: { id },
  });

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  let isAllowed = false;

  if (session?.user?.id === file.userId) {
    isAllowed = true;
  }

  console.log(isAllowed)

  if (!isAllowed && token) {
    const share = await prisma.shareToken.findUnique({
      where: { token },
    });

    console.log(share)
    if (
      share &&
      share.resourceId === file.id &&
      share.type === "file" &&
      (!share.expiresAt || share.expiresAt > new Date())
    ) {
      isAllowed = true;
    }
  }

  if (!isAllowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

let key: string;

try {
  const url = new URL(file.path);
  key = url.pathname.slice(1);
} catch {
  return NextResponse.json(
    { error: "Invalid file path" },
    { status: 500 }
  );
}

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  });

  const signedUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

  return NextResponse.json({ url: signedUrl });
}