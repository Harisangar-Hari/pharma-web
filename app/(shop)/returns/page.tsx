export const metadata = { title: "Return Policy" };

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Return Policy</h1>

      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-sm text-[color:var(--color-muted)]">
        <section>
          <h2 className="text-base font-semibold text-[color:var(--color-foreground)]">
            Non-returnable items
          </h2>
          <p className="mt-2">
            For patient safety, medicines, baby food, and personal care products cannot be
            returned once the seal is broken or the product has left our pharmacy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[color:var(--color-foreground)]">
            Wrong or damaged products
          </h2>
          <p className="mt-2">
            If you receive a wrong, damaged, or expired product, contact us within 48 hours of
            delivery with photos. We will arrange a replacement or refund at no cost.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[color:var(--color-foreground)]">
            Refunds
          </h2>
          <p className="mt-2">
            Approved refunds are processed to the original payment method within 5–7 business
            days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[color:var(--color-foreground)]">
            How to start a return
          </h2>
          <p className="mt-2">
            Email support@pharmacare.example with your order number and photos of the issue.
            Our team will respond within 24 hours.
          </p>
        </section>
      </div>
    </div>
  );
}