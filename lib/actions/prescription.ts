"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function uploadPrescriptionAction(
  formData: FormData
): Promise<{ success: true; prescriptionId: string } | { success: false; error: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No file selected" };
  }
  if (file.size > MAX_BYTES) {
    return { success: false, error: "File must be under 5 MB" };
  }
  if (!ALLOWED.includes(file.type)) {
    return { success: false, error: "Only JPG, PNG, WEBP, or PDF allowed" };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "prescriptions");
  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const rx = await prisma.prescription.create({
    data: {
      userId: session.id,
      fileUrl: `/uploads/prescriptions/${filename}`,
      status: "PENDING",
    },
  });

  return { success: true, prescriptionId: rx.id };
}