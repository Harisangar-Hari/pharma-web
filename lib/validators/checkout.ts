import { z } from "zod";

export const addressSchema = z.object({
    label: z.string().max(40).optional().or(z.literal("")),
    line1: z.string().min(3, "Address line 1 is required").max(120),
    line2: z.string().max(120).optional().or(z.literal("")),
    city: z.string().min(2, "City is required").max(60),
    state: z.string().min(2, "State is required").max(60),
    pincode: z.string().regex(/^[0-9]{4,10}$/, "Invalid pincode"),
    phone: z.string().regex(/^[0-9+\-\s]{7,15}$/, "Invalid phone number"),
});

export type AddressInput = z.infer<typeof addressSchema>;