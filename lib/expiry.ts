export function daysUntil(date: Date | string | null): number | null {
  if (!date) return null;
  const target = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(target.getTime())) return null;
  return Math.floor((target.getTime() - Date.now()) / 86_400_000);
}

export type ExpiryState = "expired" | "soon" | "ok";

export function expiryState(
  date: Date | string | null,
  alertDays: number
): ExpiryState | null {
  const days = daysUntil(date);
  if (days === null) return null;
  if (days < 0) return "expired";
  return days < alertDays ? "soon" : "ok";
}
