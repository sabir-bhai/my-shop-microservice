// apps/user-ui/src/app/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/product.slice";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
// ✅ Create store without exporting inferred state shape directly
const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
  },
});

// ✅ Explicitly export only RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Default export of store (optional, if you need it elsewhere)
export default store;
