"use client";

import { useRef, useState } from "react";
import { Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadPrescriptionAction } from "@/lib/actions/prescription";

export function PrescriptionUpload({
  prescriptionId,
  onChange,
}: {
  prescriptionId: string | null;
  onChange: (id: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadPrescriptionAction(fd);
    setUploading(false);
    if (result.success) {
      onChange(result.prescriptionId);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="rounded-lg border border-[color:var(--color-warning)] bg-yellow-50 p-4">
      <h3 className="mb-1 text-sm font-semibold">Prescription required</h3>
      <p className="mb-3 text-xs text-[color:var(--color-muted)]">
        One or more items in your cart require a valid prescription.
        Upload it here to proceed.
      </p>

      {prescriptionId ? (
        <div className="flex items-center gap-2 text-sm text-green-700">
          <Check className="h-4 w-4" />
          Prescription uploaded and will be reviewed by our pharmacist.
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
            className="text-[color:var(--color-muted)]"
          >
            Replace
          </Button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading…" : "Choose file (JPG, PNG, PDF · max 5 MB)"}
          </Button>
          {error && <p className="mt-2 text-xs text-[color:var(--color-danger)]">{error}</p>}
        </>
      )}
    </div>
  );
}