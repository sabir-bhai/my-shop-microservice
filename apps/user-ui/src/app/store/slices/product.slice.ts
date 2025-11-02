import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Image1 from "../../../../public/assets/Applegreensmith.png";
import Image2 from "../../../../public/assets/Avocado.jpg";
import Image3 from "../../../../public/assets/Orange.jpg";
import Image4 from "../../../../public/assets/Watermelon.jpg";
import Image5 from "../../../../public/assets/Strawberry.jpg";
// Product Interface
import { StaticImageData } from "next/image";

export interface ProductImage {
  id: string;
  url: string;
  productId: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  regularPrice: number;
  salePrice: number;
  warranty: string;
  category: string;
  sku: string;
  stockQuantity: number;
  discountCode: string;
  tags: string[];
  publicationStatus: string;
  featuredProduct: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  discountPercentage?: number;
  imageUrl?: string;
  secondaryImageUrl?: string;
}

// Product State
interface ProductState {
  products: Product[];
}

// // Initial State with 5 mock products
const initialState: ProductState = {
  products: [],
};

// Create Slice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
  },
});

// Export Actions & Reducer
export const { setProducts, addProduct, removeProduct } = productSlice.actions;
export default productSlice.reducer;
