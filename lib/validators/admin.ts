import { z } from "zod";

export const productSchema = z
  .object({
    name: z.string().min(2),
    slug: z
      .string()
      .min(2)
      .regex(/^[a-z0-9-]+$/, "Lowercase, digits, hyphens only"),
    sku: z.string().min(2),
    shortDescription: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
    ingredients: z.string().optional().or(z.literal("")),
    dosage: z.string().optional().or(z.literal("")),
    manufacturer: z.string().optional().or(z.literal("")),
    costPrice: z.number().nonnegative().default(0),
    price: z.number().nonnegative(),
    mrp: z.number().nonnegative(),
    stock: z.number().int().nonnegative(),
    categoryId: z.string().min(1),
    brandId: z.string().optional().or(z.literal("")),
    requiresPrescription: z.boolean(),
    isActive: z.boolean(),
    images: z.array(z.string().min(1)).default([]),
    expiryDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
      .optional()
      .or(z.literal("")),
    expiryAlertDays: z.number().int().nonnegative().default(90),
    batchNumber: z.string().optional().or(z.literal("")),
  })
  .refine((d) => d.price <= d.mrp, {
    message: "Selling price cannot exceed MRP",
    path: ["price"],
  })
  .refine((d) => d.costPrice <= d.price, {
    message: "Cost price cannot exceed selling price (would be selling at a loss)",
    path: ["costPrice"],
  });

export type ProductInput = z.infer<typeof productSchema>;