"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/auth-admin";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function uploadProductImageAction(
  formData: FormData
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No file selected" };
  }
  if (file.size > MAX_BYTES) {
    return { success: false, error: "File must be under 5 MB" };
  }
  if (!ALLOWED.includes(file.type)) {
    return { success: false, error: "Only JPG, PNG, WEBP, or AVIF allowed" };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return { success: true, url: `/uploads/products/${filename}` };
}