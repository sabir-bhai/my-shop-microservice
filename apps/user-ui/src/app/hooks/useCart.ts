"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosinstance";
import { useAppDispatch } from "../store/hook";
import { setCartItems } from "../store/slices/cartSlice";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    title: string;
    regularPrice: number;
    salePrice?: number;
    images: Array<{ url: string }>;
    slug?: string;
    description?: string;
    category?: string;
    stockQuantity?: number;
  } | null;
}

interface CartResponse {
  success: boolean;
  data: {
    cartItems: CartItem[];
    summary: {
      totalItems: number;
      totalAmount: number;
      itemCount: number;
    };
  };
}

const fetchCart = async (): Promise<CartItem[]> => {
  try {
    const response = await axiosInstance.get<CartResponse>(
      "/cart/api/get-all-cart"
    );
    return response.data.data.cartItems || [];
  } catch (error: any) {
    // If user is not authenticated, return empty cart
    if (error.response?.status === 401) {
      return [];
    }
    throw error;
  }
};

export const useCart = () => {
  const dispatch = useAppDispatch();

  const { data: cartItems = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Update Redux store when cart data changes
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      dispatch(setCartItems(cartItems));
    }
  }, [cartItems, dispatch]);

  return {
    cartItems,
    isLoading,
    isError,
    refetch,
  };
};
