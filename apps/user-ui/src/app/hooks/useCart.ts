"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosinstance";
import { useAppDispatch } from "../store/hook";
import { setCartItems } from "../store/slices/cartSlice";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    slug: string;
    description?: string;
  };
}

interface CartResponse {
  success: boolean;
  data: {
    items: CartItem[];
  };
}

const fetchCart = async (): Promise<CartItem[]> => {
  try {
    const response = await axiosInstance.get<CartResponse>(
      "/cart/api/get-all-cart"
    );
    return response.data.data.items || [];
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
