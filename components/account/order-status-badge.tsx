const STYLES: Record<string, { label: string; classes: string }> = {
  PENDING: { label: "Pending", classes: "bg-gray-100 text-gray-700" },
  PENDING_APPROVAL: {
    label: "Awaiting pharmacist",
    classes: "bg-yellow-100 text-yellow-800",
  },
  CONFIRMED: { label: "Confirmed", classes: "bg-blue-100 text-blue-700" },
  PACKED: { label: "Packed", classes: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "Shipped", classes: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Delivered", classes: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", classes: "bg-red-100 text-red-700" },
  RETURNED: { label: "Returned", classes: "bg-orange-100 text-orange-700" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? { label: status, classes: "bg-gray-100 text-gray-700" };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.classes}`}>
      {style.label}
    </span>
  );
}