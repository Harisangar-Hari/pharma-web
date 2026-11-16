import { ShieldCheck, Truck, Users, Award } from "lucide-react";

export const metadata = { title: "About Us" };

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12">
            <h1 className="text-3xl font-bold">About PharmaCare</h1>
            <p className="mt-4 text-[color:var(--color-muted)]">
                PharmaCare is a licensed online pharmacy committed to making genuine
                medicines and health essentials accessible to every household. We combine
                licensed pharmacists, verified suppliers, and fast delivery to keep you
                and your family healthy.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-lg border border-[color:var(--color-border)] p-5">
                    <ShieldCheck className="mb-2 h-6 w-6 text-[color:var(--color-primary)]" />
                    <h2 className="font-semibold">100% genuine medicines</h2>
                    <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                        Sourced only from licensed distributors. Every batch is verified
                        before it reaches you.
                    </p>
                </div>
                <div className="rounded-lg border border-[color:var(--color-border)] p-5">
                    <Truck className="mb-2 h-6 w-6 text-[color:var(--color-primary)]" />
                    <h2 className="font-semibold">Fast, tracked delivery</h2>
                    <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                        Same-day dispatch in most cities, with live tracking from order to door.
                    </p>
                </div>
                <div className="rounded-lg border border-[color:var(--color-border)] p-5">
                    <Users className="mb-2 h-6 w-6 text-[color:var(--color-primary)]" />
                    <h2 className="font-semibold">Licensed pharmacists</h2>
                    <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                        Every prescription is verified by a registered pharmacist before
                        dispatch.
                    </p>
                </div>
                <div className="rounded-lg border border-[color:var(--color-border)] p-5">
                    <Award className="mb-2 h-6 w-6 text-[color:var(--color-primary)]" />
                    <h2 className="font-semibold">Trusted by thousands</h2>
                    <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                        Over 50,000 customers rely on PharmaCare for their monthly health needs.
                    </p>
                </div>
            </div>

            <h2 className="mt-10 text-xl font-semibold">Our promise</h2>
            <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-muted)]">
                <li>• No counterfeit products — ever.</li>
                <li>• Prescriptions handled privately and only by licensed staff.</li>
                <li>• Transparent pricing — no hidden charges.</li>
                <li>• Free delivery on orders above 499.</li>
            </ul>
        </div>
    );
}