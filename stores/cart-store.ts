import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
};

export type CartItemInput = Omit<CartItem, "quantity">;

const MAX_QTY = 10;

const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, n));

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItemInput, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: clampQty(i.quantity + quantity) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: clampQty(quantity) }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: clampQty(quantity) } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "pharmacy-cart" }
  )
);
