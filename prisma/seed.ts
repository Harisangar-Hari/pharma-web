import { PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function monthsFromNow(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d;
}

const CATEGORIES = [
  { name: "Baby Care", slug: "baby-care", description: "Everything for your little one" },
  { name: "First Aid", slug: "first-aid", description: "Bandages, antiseptics, and emergency essentials" },
  { name: "Vitamins & Supplements", slug: "vitamins-supplements", description: "Daily nutrition and immunity support" },
  { name: "Personal Care", slug: "personal-care", description: "Skin, hair, and oral care" },
  { name: "Prescription Medicines", slug: "prescription-medicines", description: "Prescription-only medicines" },
  { name: "Health Devices", slug: "health-devices", description: "Monitors, thermometers, and more" },
  { name: "Mother Care", slug: "mother-care", description: "Care for expecting and new mothers" },
];

const BRANDS = [
  { name: "MediCare", slug: "medicare" },
  { name: "HealthPlus", slug: "healthplus" },
  { name: "PureLife", slug: "purelife" },
  { name: "BabySoft", slug: "babysoft" },
  { name: "VitaBoost", slug: "vitaboost" },
];

type SeedProduct = {
  name: string;
  slug: string;
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  requiresPrescription: boolean;
  categorySlug: string;
  brandSlug: string;
  shortDescription: string;
  description: string;
  totalSold: number;
  avgRating: number;
  reviewCount: number;
  expiryMonths: number;
};

const PRODUCTS: SeedProduct[] = [
  { name: "Baby Diapers Pack of 30", slug: "baby-diapers-pack-30", sku: "BC-001", price: 499, mrp: 599, stock: 120, requiresPrescription: false, categorySlug: "baby-care", brandSlug: "babysoft", shortDescription: "Soft, breathable diapers for newborns", description: "Ultra-soft diapers with a breathable back sheet to keep your baby dry and comfortable all day.", totalSold: 340, avgRating: 4.6, reviewCount: 88, expiryMonths: 24 },
  { name: "Baby Gentle Wash 400ml", slug: "baby-gentle-wash-400ml", sku: "BC-002", price: 249, mrp: 299, stock: 80, requiresPrescription: false, categorySlug: "baby-care", brandSlug: "babysoft", shortDescription: "Tear-free daily wash", description: "pH-balanced, tear-free formula suitable for newborn skin and daily use.", totalSold: 210, avgRating: 4.5, reviewCount: 47, expiryMonths: 24 },
  { name: "Baby Massage Oil 200ml", slug: "baby-massage-oil-200ml", sku: "BC-003", price: 189, mrp: 229, stock: 60, requiresPrescription: false, categorySlug: "baby-care", brandSlug: "purelife", shortDescription: "Light, non-greasy massage oil", description: "Enriched with almond and coconut oils to moisturize and soothe your baby's skin.", totalSold: 95, avgRating: 4.3, reviewCount: 21, expiryMonths: 18 },
  { name: "Adhesive Bandages 100 pcs", slug: "adhesive-bandages-100pcs", sku: "FA-001", price: 99, mrp: 149, stock: 300, requiresPrescription: false, categorySlug: "first-aid", brandSlug: "medicare", shortDescription: "Assorted sizes, waterproof", description: "Sterile, waterproof adhesive bandages in assorted sizes for minor cuts and scrapes.", totalSold: 780, avgRating: 4.7, reviewCount: 156, expiryMonths: 36 },
  { name: "Antiseptic Liquid 500ml", slug: "antiseptic-liquid-500ml", sku: "FA-002", price: 179, mrp: 210, stock: 90, requiresPrescription: false, categorySlug: "first-aid", brandSlug: "medicare", shortDescription: "Multi-purpose antiseptic", description: "Trusted antiseptic liquid for cuts, bites, and general disinfection.", totalSold: 420, avgRating: 4.6, reviewCount: 102, expiryMonths: 24 },
  { name: "Crepe Bandage 10cm", slug: "crepe-bandage-10cm", sku: "FA-003", price: 129, mrp: 160, stock: 150, requiresPrescription: false, categorySlug: "first-aid", brandSlug: "healthplus", shortDescription: "Elastic support bandage", description: "Lightweight, breathable crepe bandage for sprains and support.", totalSold: 180, avgRating: 4.2, reviewCount: 35, expiryMonths: 60 },
  { name: "Vitamin C 1000mg 60 Tablets", slug: "vitamin-c-1000mg-60tabs", sku: "VS-001", price: 399, mrp: 499, stock: 200, requiresPrescription: false, categorySlug: "vitamins-supplements", brandSlug: "vitaboost", shortDescription: "Immunity support, high-strength", description: "High-strength Vitamin C tablets to support daily immunity and skin health.", totalSold: 560, avgRating: 4.7, reviewCount: 130, expiryMonths: 18 },
  { name: "Omega-3 Fish Oil 1000mg", slug: "omega-3-fish-oil-1000mg", sku: "VS-002", price: 649, mrp: 799, stock: 110, requiresPrescription: false, categorySlug: "vitamins-supplements", brandSlug: "vitaboost", shortDescription: "Heart and brain support", description: "Purified omega-3 fish oil capsules for cardiovascular and cognitive support.", totalSold: 310, avgRating: 4.5, reviewCount: 72, expiryMonths: 18 },
  { name: "Multivitamin Daily 30 Tablets", slug: "multivitamin-daily-30tabs", sku: "VS-003", price: 299, mrp: 379, stock: 220, requiresPrescription: false, categorySlug: "vitamins-supplements", brandSlug: "healthplus", shortDescription: "Complete daily multivitamin", description: "Balanced multivitamin blend with essential vitamins and minerals for daily use.", totalSold: 430, avgRating: 4.4, reviewCount: 91, expiryMonths: 18 },
  { name: "Moisturizing Lotion 400ml", slug: "moisturizing-lotion-400ml", sku: "PC-001", price: 349, mrp: 420, stock: 130, requiresPrescription: false, categorySlug: "personal-care", brandSlug: "purelife", shortDescription: "24-hour hydration", description: "Fast-absorbing moisturizer with hyaluronic acid for daily hydration.", totalSold: 260, avgRating: 4.5, reviewCount: 62, expiryMonths: 24 },
  { name: "Sunscreen SPF 50 PA+++", slug: "sunscreen-spf-50", sku: "PC-002", price: 499, mrp: 649, stock: 90, requiresPrescription: false, categorySlug: "personal-care", brandSlug: "purelife", shortDescription: "Broad-spectrum protection", description: "Lightweight, non-greasy sunscreen with PA+++ protection against UVA and UVB.", totalSold: 340, avgRating: 4.6, reviewCount: 78, expiryMonths: 24 },
  { name: "Anti-Dandruff Shampoo 250ml", slug: "anti-dandruff-shampoo-250ml", sku: "PC-003", price: 229, mrp: 279, stock: 75, requiresPrescription: false, categorySlug: "personal-care", brandSlug: "healthplus", shortDescription: "Zinc pyrithione formula", description: "Gentle anti-dandruff shampoo that soothes the scalp and reduces flakes.", totalSold: 150, avgRating: 4.1, reviewCount: 33, expiryMonths: 24 },
  { name: "Paracetamol 500mg 20 Tablets", slug: "paracetamol-500mg-20tabs", sku: "RX-001", price: 35, mrp: 45, stock: 500, requiresPrescription: true, categorySlug: "prescription-medicines", brandSlug: "medicare", shortDescription: "Fever and pain relief", description: "Trusted paracetamol tablets for effective relief from mild to moderate pain and fever.", totalSold: 980, avgRating: 4.8, reviewCount: 240, expiryMonths: 18 },
  { name: "Amoxicillin 500mg 10 Capsules", slug: "amoxicillin-500mg-10caps", sku: "RX-002", price: 89, mrp: 110, stock: 180, requiresPrescription: true, categorySlug: "prescription-medicines", brandSlug: "medicare", shortDescription: "Antibiotic, prescription required", description: "Broad-spectrum antibiotic for bacterial infections. Requires a valid prescription.", totalSold: 620, avgRating: 4.4, reviewCount: 95, expiryMonths: 18 },
  { name: "Ibuprofen 400mg 10 Tablets", slug: "ibuprofen-400mg-10tabs", sku: "RX-003", price: 55, mrp: 70, stock: 260, requiresPrescription: true, categorySlug: "prescription-medicines", brandSlug: "healthplus", shortDescription: "Anti-inflammatory pain relief", description: "Non-steroidal anti-inflammatory tablets for pain and inflammation.", totalSold: 440, avgRating: 4.5, reviewCount: 87, expiryMonths: 18 },
  { name: "Digital Thermometer", slug: "digital-thermometer", sku: "HD-001", price: 299, mrp: 399, stock: 140, requiresPrescription: false, categorySlug: "health-devices", brandSlug: "medicare", shortDescription: "Fast, accurate reading", description: "Flexible-tip digital thermometer with a 10-second reading and fever alarm.", totalSold: 520, avgRating: 4.6, reviewCount: 118, expiryMonths: 60 },
  { name: "Blood Pressure Monitor", slug: "blood-pressure-monitor", sku: "HD-002", price: 1899, mrp: 2399, stock: 45, requiresPrescription: false, categorySlug: "health-devices", brandSlug: "healthplus", shortDescription: "Automatic upper-arm monitor", description: "Clinically validated upper-arm BP monitor with irregular heartbeat detection.", totalSold: 180, avgRating: 4.7, reviewCount: 43, expiryMonths: 60 },
  { name: "Pulse Oximeter", slug: "pulse-oximeter", sku: "HD-003", price: 799, mrp: 999, stock: 60, requiresPrescription: false, categorySlug: "health-devices", brandSlug: "medicare", shortDescription: "SpO2 and pulse rate", description: "Fingertip pulse oximeter with OLED display for SpO2 and pulse rate.", totalSold: 240, avgRating: 4.4, reviewCount: 51, expiryMonths: 60 },
  { name: "Prenatal Multivitamin 30 Tabs", slug: "prenatal-multivitamin-30tabs", sku: "MC-001", price: 549, mrp: 699, stock: 70, requiresPrescription: false, categorySlug: "mother-care", brandSlug: "vitaboost", shortDescription: "Folic acid and iron support", description: "Complete prenatal supplement with folic acid, iron, and DHA for expecting mothers.", totalSold: 220, avgRating: 4.6, reviewCount: 54, expiryMonths: 18 },
  { name: "Stretch Mark Cream 200ml", slug: "stretch-mark-cream-200ml", sku: "MC-002", price: 399, mrp: 499, stock: 55, requiresPrescription: false, categorySlug: "mother-care", brandSlug: "purelife", shortDescription: "Nourishing, non-greasy", description: "Cocoa butter and vitamin E cream to nourish skin during pregnancy.", totalSold: 120, avgRating: 4.2, reviewCount: 29, expiryMonths: 24 },
];

async function main() {
  console.log("Seeding database...");

  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const categories = await Promise.all(
    CATEGORIES.map((c) =>
      prisma.category.create({
        data: {
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: `https://picsum.photos/seed/cat-${c.slug}/400/300`,
        },
      })
    )
  );
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const brands = await Promise.all(
    BRANDS.map((b) =>
      prisma.brand.create({
        data: {
          name: b.name,
          slug: b.slug,
          logo: `https://picsum.photos/seed/brand-${b.slug}/200/200`,
        },
      })
    )
  );
  const brandBySlug = Object.fromEntries(brands.map((b) => [b.slug, b.id]));

  for (const p of PRODUCTS) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        mrp: p.mrp,
        costPrice: Math.round(p.price * 0.7),
        stock: p.stock,
        requiresPrescription: p.requiresPrescription,
        isActive: true,
        images: [
          `https://picsum.photos/seed/${p.slug}-1/600/600`,
          `https://picsum.photos/seed/${p.slug}-2/600/600`,
          `https://picsum.photos/seed/${p.slug}-3/600/600`,
        ],
        manufacturer: p.brandSlug,
        expiryDate: monthsFromNow(p.expiryMonths),
        expiryAlertDays: 90,
        batchNumber: `B${p.sku}-001`,
        totalSold: p.totalSold,
        avgRating: p.avgRating,
        reviewCount: p.reviewCount,
        categoryId: catBySlug[p.categorySlug],
        brandId: brandBySlug[p.brandSlug],
      },
    });
  }

  console.log(
    `Done. Created ${categories.length} categories, ${brands.length} brands, ${PRODUCTS.length} products.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });