import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./product.slice";

export interface CartItem {
  id: string; // unique cart entry id (use productId for now)
  quantity: number;
  product: Product; // nested product details
}
interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items:
    typeof window !== "undefined" && localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems") as string)
      : [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    openCart(state) {
      state.isOpen = true;
    },
    closeCart(state) {
      state.isOpen = false;
    },

    // Add product to cart
    addToCartLocalStorage(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: product.id,
          quantity: 1,
          product,
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // Increment product quantity
    incrementQuantityLocalStorage(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity += 1;
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },

    // Decrement product quantity (remove if zero)
    decrementQuantityLocalStorage(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },

    // Remove product from cart
    removeFromCartLocalStorage(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
  },
});

export const {
  toggleCart,
  openCart,
  closeCart,
  addToCartLocalStorage,
  incrementQuantityLocalStorage,
  decrementQuantityLocalStorage,
  removeFromCartLocalStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
