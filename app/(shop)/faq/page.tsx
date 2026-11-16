export const metadata = { title: "FAQ" };

const FAQS = [
  {
    q: "How do I place an order?",
    a: "Browse products, add what you need to your cart, and go to checkout. You'll need an account to complete the order.",
  },
  {
    q: "Do I need a prescription to order medicines?",
    a: "Prescription-only medicines (marked with an Rx badge) require a valid prescription. Upload it at checkout or from your account; a licensed pharmacist will verify it before dispatch.",
  },
  {
    q: "How does prescription verification work?",
    a: "After you upload a prescription, our pharmacist reviews it within 24 hours. Once approved, your order moves forward automatically. If rejected, you'll see a note in your account.",
  },
  {
    q: "What are the delivery charges?",
    a: "Free delivery on orders above (Rs)499. Below that, a flat (Rs)49 delivery fee applies.",
  },
  {
    q: "Can I return a medicine?",
    a: "For safety reasons, medicines cannot be returned once opened. If you received a wrong or damaged item, contact support within 48 hours of delivery.",
  },
  {
    q: "How do I track my order?",
    a: "Go to your account → Orders. Each order shows its current status: Pending → Confirmed → Packed → Shipped → Delivered.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Frequently asked questions</h1>

      <div className="mt-8 divide-y divide-[color:var(--color-border)]">
        {FAQS.map((f, i) => (
          <details key={i} className="group py-4">
            <summary className="cursor-pointer list-none text-sm font-medium marker:hidden">
              <span className="flex items-center justify-between">
                {f.q}
                <span className="text-[color:var(--color-muted)] transition group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}