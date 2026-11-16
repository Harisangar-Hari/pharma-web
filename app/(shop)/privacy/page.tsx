export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-xs text-[color:var(--color-muted)]">Last updated: today</p>

      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-sm text-[color:var(--color-muted)]">
        <section>
          <h2 className="text-base font-semibold text-[color:var(--color-foreground)]">
            What we collect
          </h2>
          <p className="mt-2">
            When you place an order, we collect your name, email, phone number, delivery address,
            and any prescription you upload. Payment information is handled by our payment
            provider and is never stored on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[color:var(--color-foreground)]">
            How we use it
          </h2>
          <p className="mt-2">
            We use your information to process orders, verify prescriptions, deliver products,
            and provide customer support. We do not sell your data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[color:var(--color-foreground)]">
            Prescriptions
          </h2>
          <p className="mt-2">
            Uploaded prescriptions are accessed only by licensed pharmacists for verification
            purposes. They are stored securely and are not shared outside the pharmacy team.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[color:var(--color-foreground)]">
            Your rights
          </h2>
          <p className="mt-2">
            You can request access to your data, ask us to correct it, or request deletion by
            contacting support@pharmacare.example.
          </p>
        </section>
      </div>
    </div>
  );
}