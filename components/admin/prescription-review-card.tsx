"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  approvePrescriptionAction,
  rejectPrescriptionAction,
} from "@/lib/actions/admin";

export function PrescriptionReviewCard({
  prescription,
}: {
  prescription: {
    id: string;
    fileUrl: string;
    status: string;
    createdAt: string;
    pharmacistNote: string | null;
    userName: string;
    userEmail: string;
    userPhone: string | null;
    orderNumber: string | null;
  };
}) {
  const router = useRouter();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const approve = async () => {
    setLoading(true);
    const r = await approvePrescriptionAction(prescription.id);
    setLoading(false);
    if (r.success) {
      toast.success("Prescription approved");
      router.refresh();
    } else {
      toast.error(r.error);
    }
  };

  const reject = async () => {
    setLoading(true);
    const r = await rejectPrescriptionAction(prescription.id, reason);
    setLoading(false);
    if (r.success) {
      toast.success("Prescription rejected");
      setShowReject(false);
      setReason("");
      router.refresh();
    } else {
      toast.error(r.error);
    }
  };

  return (
    <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
      <div className="grid gap-4 md:grid-cols-[120px_1fr]">
        <a
          href={prescription.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="block aspect-square overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
        >
          <img
            src={prescription.fileUrl}
            alt="Prescription"
            className="h-full w-full object-cover"
          />
        </a>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium">{prescription.userName}</p>
              <p className="text-xs text-[color:var(--color-muted)]">
                {prescription.userEmail}
                {prescription.userPhone ? ` · ${prescription.userPhone}` : ""}
              </p>
              <p className="text-xs text-[color:var(--color-muted)]">
                Uploaded {new Date(prescription.createdAt).toLocaleString()}
              </p>
              {prescription.orderNumber && (
                <p className="mt-1 text-xs">Order: {prescription.orderNumber}</p>
              )}
            </div>
            <span className="rounded-full bg-[color:var(--color-surface)] px-2 py-0.5 text-xs font-medium">
              {prescription.status}
            </span>
          </div>

          {prescription.pharmacistNote && (
            <p className="mt-2 rounded bg-red-50 px-2 py-1 text-xs text-red-800">
              Note: {prescription.pharmacistNote}
            </p>
          )}

          {prescription.status === "PENDING" && (
            <div className="mt-3 flex flex-wrap gap-2">
              {!showReject ? (
                <>
                  <Button size="sm" onClick={approve} disabled={loading}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowReject(true)}
                    disabled={loading}
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <div className="w-full space-y-2">
                  <Input
                    placeholder="Reason for rejection (sent to customer)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={reject}
                      disabled={loading || !reason.trim()}
                    >
                      Confirm reject
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowReject(false);
                        setReason("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}