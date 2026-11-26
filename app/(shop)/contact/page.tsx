import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/shop/contact-form";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12">
            <h1 className="text-3xl font-bold">Contact us</h1>
            <p className="mt-2 text-[color:var(--color-muted)]">
                Questions about an order, a product, or a prescription? We&apos;re here to help.
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div className="space-y-5">
                    <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-5 w-5 text-[color:var(--color-primary)]" />
                        <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-[color:var(--color-muted)]">support@pharmacare.example</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-5 w-5 text-[color:var(--color-primary)]" />
                        <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-[color:var(--color-muted)]">+91 98765 43210</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-[color:var(--color-primary)]" />
                        <div>
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-sm text-[color:var(--color-muted)]">
                                123 Health Street, Bengaluru 560001, India
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock className="mt-0.5 h-5 w-5 text-[color:var(--color-primary)]" />
                        <div>
                            <p className="text-sm font-medium">Hours</p>
                            <p className="text-sm text-[color:var(--color-muted)]">
                                Mon–Sat 9:00 AM – 9:00 PM · Sun 10:00 AM – 6:00 PM
                            </p>
                        </div>
                    </div>
                </div>

                <ContactForm />
            </div>
        </div>
    );
}