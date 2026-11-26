import { readdir, readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "private", "uploads", "prescriptions");

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const prescription = await prisma.prescription.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!prescription) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isStaff = session.role === "ADMIN" || session.role === "PHARMACIST";
  if (prescription.userId !== session.id && !isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // The file is named <id>.<ext>; only the directory listing decides the path.
  const files = await readdir(UPLOAD_DIR).catch(() => [] as string[]);
  const filename = files.find((f) => f.startsWith(`${id}.`));
  if (!filename) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const data = await readFile(path.join(UPLOAD_DIR, filename));

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
