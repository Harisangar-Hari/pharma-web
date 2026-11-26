import Link from "next/link";
import { requireStaff } from "@/lib/auth-admin";
import { prisma } from "@/lib/prisma";
import { PrescriptionReviewCard } from "@/components/admin/prescription-review-card";

export default async function AdminPrescriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireStaff();
  const sp = await searchParams;
  const status = sp.status ?? "PENDING";

  const prescriptions = await prisma.prescription.findMany({
    where: status === "ALL" ? {} : { status: status as any },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      orders: { select: { id: true, orderNumber: true }, take: 1 },
    },
    take: 100,
  });

  const TABS = ["PENDING", "APPROVED", "REJECTED", "ALL"];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Prescriptions</h1>

      <div className="flex gap-2 border-b border-[color:var(--color-border)]">
        {TABS.map((t) => (
          <Link
            key={t}
            href={`/admin/prescriptions?status=${t}`}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${status === t
                ? "border-[color:var(--color-primary)] text-[color:var(--color-primary)]"
                : "border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
              }`}
          >
            {t}
          </Link>
        ))}
      </div>

      {prescriptions.length === 0 ? (
        <p className="rounded-lg border border-[color:var(--color-border)] bg-white p-8 text-center text-sm text-[color:var(--color-muted)]">
          No prescriptions with this status.
        </p>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((rx) => (
            <PrescriptionReviewCard
              key={rx.id}
              prescription={{
                id: rx.id,
                fileUrl: rx.fileUrl,
                status: rx.status,
                createdAt: rx.createdAt.toISOString(),
                pharmacistNote: rx.pharmacistNote,
                userName: rx.user.name,
                userEmail: rx.user.email,
                userPhone: rx.user.phone,
                orderNumber: rx.orders[0]?.orderNumber ?? null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}