export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-xs text-[color:var(--color-muted)]">Last updated: today</p>

      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-sm text-[color:var(--color-muted)]">
        <section>
          <h2 className="text-base font-semibold text-[color:var(--color-foreground)]">
            Acceptance
          </h2>
          <p className="mt-2">
            By using PharmaCare, you agree to these terms. If you do not agree,
            please do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[color:var(--color-foreground)]">
            Prescription medicines
          </h2>
          <p className="mt-2">
            You may not order prescription-only medicines without a valid prescription from a
            registered medical practitioner. Orders containing prescription items are held until
            a pharmacist approves your uploaded prescription.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[color:var(--color-foreground)]">
            Accounts
          </h2>
          <p className="mt-2">
            You are responsible for keeping your login credentials secure. Notify us immediately
            if you suspect unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[color:var(--color-foreground)]">
            Limitation of liability
          </h2>
          <p className="mt-2">
            PharmaCare dispenses medicines exactly as prescribed. We are not liable for
            outcomes resulting from incorrect prescriptions, misuse of medicines, or delays
            caused by events outside our control.
          </p>
        </section>
      </div>
    </div>
  );
}