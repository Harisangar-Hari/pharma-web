import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrescriptionUploadStandalone } from "@/components/account/prescription-upload-standalone";

export const metadata = { title: "My Prescriptions" };

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default async function PrescriptionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const prescriptions = await prisma.prescription.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[color:var(--color-border)] p-4">
        <h2 className="mb-2 text-sm font-semibold">Upload a new prescription</h2>
        <p className="mb-3 text-xs text-[color:var(--color-muted)]">
          Upload once, reuse for multiple orders. Our pharmacist reviews within 24 hours.
        </p>
        <PrescriptionUploadStandalone />
      </div>

      {prescriptions.length === 0 ? (
        <p className="rounded-lg border border-[color:var(--color-border)] p-8 text-center text-sm text-[color:var(--color-muted)]">
          No prescriptions uploaded yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {prescriptions.map((p) => (
            <li
              key={p.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-[color:var(--color-border)] p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm">{p.fileUrl.split("/").pop()}</p>
                <p className="text-xs text-[color:var(--color-muted)]">
                  Uploaded {p.createdAt.toLocaleDateString()}
                </p>
                {p.pharmacistNote && (
                  <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                    Note: {p.pharmacistNote}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[p.status] ?? ""}`}
                >
                  {p.status}
                </span>
                <Link
                  href={p.fileUrl}
                  target="_blank"
                  className="text-xs text-[color:var(--color-primary)] hover:underline"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}