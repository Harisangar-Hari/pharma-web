export type SerializedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  images: string[];
  stock: number;
  requiresPrescription: boolean;
  avgRating: number;
  reviewCount: number;
};

export function serializeProduct<T extends Omit<SerializedProduct, "price" | "mrp"> & {
  price: unknown;
  mrp: unknown;
}>(p: T): SerializedProduct {
  return {
    ...p,
    price: Number(p.price),
    mrp: Number(p.mrp),
  };
}