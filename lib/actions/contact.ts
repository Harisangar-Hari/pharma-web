"use server";

import { z } from "zod";

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function sendContactMessageAction(input: {
    name: string;
    email: string;
    message: string;
}): Promise<{ success: true } | { success: false; error: string }> {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    // TODO: send via Resend or store in a ContactMessage table
    console.log("[contact]", parsed.data);

    return { success: true };
}