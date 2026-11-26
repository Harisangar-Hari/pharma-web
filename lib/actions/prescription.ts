"use server";

import { writeFile, mkdir, rm } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

// Prescriptions are private: stored outside /public and served through an
// authenticated route handler that checks ownership or staff role.
const UPLOAD_DIR = path.join(process.cwd(), "private", "uploads", "prescriptions");

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

  const ext = ALLOWED[file.type];
  if (!ext) {
    return { success: false, error: "Only JPG, PNG, WEBP, or PDF allowed" };
  }

  const id = randomUUID();
  const filePath = path.join(UPLOAD_DIR, `${id}.${ext}`);

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    await prisma.prescription.create({
      data: {
        id,
        userId: session.id,
        fileUrl: `/api/prescriptions/${id}`,
        status: "PENDING",
      },
    });
  } catch {
    await rm(filePath, { force: true }).catch(() => {});
    return { success: false, error: "Could not save the prescription. Please try again." };
  }

  return { success: true, prescriptionId: id };
}
