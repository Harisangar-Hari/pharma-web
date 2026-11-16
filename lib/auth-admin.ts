import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/admin");
  if (session.role !== "ADMIN") redirect("/");
  return session;
}

export async function requireStaff() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/admin");
  if (session.role !== "ADMIN" && session.role !== "PHARMACIST") {
    redirect("/");
  }
  return session;
}