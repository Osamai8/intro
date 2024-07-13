import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AddCartBtnType } from "./types/AddCartBtnType";

type CartState = {
  isOpen: boolean;
  cart: AddCartBtnType[];
  toggleCart: () => void;
  addProduct: (item: AddCartBtnType) => void;
  removeProduct: (item: AddCartBtnType) => void;
  paymentIntent: string;
  setPaymentIntent: (value: string) => void;
  onCheckout: "cart" | "checkout" | "success";
  setCheckout: (val: "cart" | "checkout" | "success") => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      isOpen: false,
      cart: [],
      paymentIntent: "",
      onCheckout: "cart",
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addProduct: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          );
          if (existingItem) {
            const updatedItems = state.cart.map((cartItem) => {
              if (cartItem.id === item.id) {
                return {
                  ...cartItem,
                  quantity: cartItem.quantity! + 1,
                };
              }
              return cartItem;
            });
            return { cart: updatedItems };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),
      removeProduct: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          );
          if (existingItem && existingItem.quantity! > 1) {
            const updatedItems = state.cart.map((cartItem) => {
              if (cartItem.id === item.id) {
                return { ...cartItem, quantity: cartItem.quantity! - 1 };
              }
              return cartItem;
            });
            return { cart: updatedItems };
          } else {
            const filteredItems = state.cart.filter(
              (cartItem) => cartItem.id !== item.id
            );
            return { cart: filteredItems };
          }
        }),
      setPaymentIntent: (value) =>
        set((state) => ({
          paymentIntent: value,
        })),
      setCheckout: (value) =>
        set((state) => ({
          onCheckout: value,
        })),
      clearCart: () => set(() => ({ cart: [] })),
    }),
    { name: "cart-store" }
  )
);
type ThemeState = {
  mode: 'light' | 'dark',
  toggleTheme: (theme: 'light' | 'dark') => void
}
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleTheme: (theme) => set((state) => ({ mode: theme })),
    }),
    { name: "theme-store" }
  )
);
