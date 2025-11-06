"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import OrderSummary from "./components/OrderSummary";
import CheckoutStepper from "./components/CheckoutStepper";
import CartItemList from "./components/CartItemList";
import AddressList from "./components/AddressList";
import AddAddressModal from "./components/AddAddressModal";
import MyOrderSummary from "./components/MyOrderSummary";
import MainPaymentComponent from "./components/MainPaymentComponent";
import axiosInstance from "../../utils/axiosinstance";
import loadRazorpayScript from "../../utils/razorpay";
import useUser from "../../hooks/useUser";

import { toast } from "sonner";

// Types
type Product = {
  id: string;
  title: string;
  salePrice: number;
  regularPrice: number;
  discountPercentage?: number;
  name?: string;
  sku?: string;
  images: { url: string }[];
  category: string;
};

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
};

type CartApiResponse = {
  cartItems: CartItem[];
  summary: {
    totalItems: number;
    totalAmount: number;
    itemCount: number;
  };
};

const Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stepParam = parseInt(searchParams.get("step") || "0", 10);
  const [step, setStep] = useState(stepParam);
  type Address = {
    id: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    locality?: string;
    type?: string;
    name?: string;
    phone?: string;
    [key: string]: any;
  };
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const handleAddAddress = () => {
    setEditingAddress(null); // Clear any editing address
    setIsModalOpen(true);
  };

  const handleEditAddress = (address: any) => {
    debugger;
    setEditingAddress(address); // Set address to edit
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };
  // ✅ Fetch Cart (with proper API response parsing)
  const { data, isLoading, isError } = useQuery<CartApiResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axiosInstance.get("/cart/api/get-all-cart", {
        withCredentials: true,
      });
      return res.data.data;
    },
  });

  const cartItems: CartItem[] = data?.cartItems ?? [];
  const summary = data?.summary;

  // ✅ Mutations
  const increaseMutation = useMutation({
    mutationFn: (productId: string) =>
      axiosInstance.patch(
        "/cart/api/increase-to-cart",
        { productId },
        { withCredentials: true }
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const decreaseMutation = useMutation({
    mutationFn: (productId: string) =>
      axiosInstance.patch(
        "/cart/api/decrease-to-cart",
        { productId },
        { withCredentials: true }
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) =>
      axiosInstance.delete("/cart/api/remove-to-cart", {
        data: { productId },
        withCredentials: true,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // ✅ Quantity Change Handler
  const handleQuantityChange = (id: string, newQty: number) => {
    const item = cartItems.find((item) => item.productId === id);
    if (!item) return;

    if (newQty <= 0) removeMutation.mutate(id);
    else if (newQty > item.quantity) increaseMutation.mutate(id);
    else if (newQty < item.quantity) decreaseMutation.mutate(id);
  };

  const handleRemove = (id: string) => removeMutation.mutate(id);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 2));
  // const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const processedToPay = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    const preparedItems = cartItems.map((item) => ({
      id: item.product.id,
      quantity: item.quantity,
      salePrice: item.product.salePrice,
      name: item.product.title,
      sku: item.product.sku,
    }));

    const orderData = {
      subtotal: totalAmount,
      shipping: 50,
      total: totalAmount + 50,
      itemsCount: cartItems.length,
      cartItems: preparedItems,
      addressId: selectedAddress.id,
    };

    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded || !(window as any).Razorpay) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    try {
      // Step 1: Create order in Order Service
      const { data: orderResponse } = await axiosInstance.post(
        "/order/api/create",
        orderData,
        { withCredentials: true }
      );

      if (!orderResponse.success || !orderResponse.data?.orderId) {
        console.error("Invalid order response", orderResponse);
        toast.error("Could not create order.");
        return;
      }

      const orderId = orderResponse.data.orderId;
      const orderTotal = orderResponse.data.total;

      // Step 2: Create payment order in Payment Service
      const { data: paymentResponse } = await axiosInstance.post(
        "/payment/api/create-order",
        {
          orderId,
          amount: orderTotal,
          currency: "INR",
        },
        { withCredentials: true }
      );

      if (!paymentResponse.success || !paymentResponse.data) {
        console.error("Invalid payment response", paymentResponse);
        toast.error("Could not create payment order.");
        return;
      }

      const {
        razorpayOrderId,
        razorpayKeyId,
        paymentId,
        amount: amountInPaise,
        currency,
      } = paymentResponse.data;

      // Step 3: Initialize Razorpay
      const rzp = new (window as any).Razorpay({
        key: razorpayKeyId,
        order_id: razorpayOrderId,
        amount: amountInPaise,
        currency,
        name: "MyShop",
        description: "Order Payment",
        handler: async (response: any) => {
          try {
            const verifyRes = await axiosInstance.post(
              "/payment/api/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId,
              },
              { withCredentials: true }
            );

            if (verifyRes.data?.success) {
              toast.success("Payment successful! 🎉");
              window.location.href = `/order-success?orderId=${orderId}`;
            } else {
              toast.error("Payment verification failed!");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => console.log("Payment modal closed by user"),
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#F37254" },
        timeout: 300, // seconds
        retry: { enabled: false },
      });

      rzp.on("payment.failed", (resp: any) => {
        console.error("Payment failed:", resp?.error);
        toast.error(
          `Payment failed: ${resp?.error?.description ?? "Unknown error"}`
        );
      });

      rzp.open();
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error("Could not initiate payment.");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (step === 0) params.append("orderAndReviews", "");
    else if (step === 1) params.append("shippingAndAddress", "");
    else if (step === 2) params.append("payment", "");
    params.set("step", step.toString());
    router.push(`?${params.toString()}`);
  }, [step]);

  // ✅ Totals
  const totalMrp = cartItems.reduce(
    (sum: number, item: CartItem) =>
      sum + item.product.regularPrice * item.quantity,
    0
  );

  const totalAmount = cartItems.reduce(
    (sum: number, item: CartItem) =>
      sum + item.product.salePrice * item.quantity,
    0
  );

  const totalDiscount = totalMrp - totalAmount;

  // ✅ Render
  return (
    <div className="min-h-screen bg-[#F9F6F4]">
      <CheckoutStepper
        currentStep={step}
        onStepClick={(clickedStep) => {
          // Allow backward navigation, block forward
          if (clickedStep <= step) {
            setStep(clickedStep);
          }
        }}
      />

      <div className="max-w-7xl mx-auto py-8 px-4">
        {isLoading ? (
          <p>Loading cart...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load cart.</p>
        ) : (
          <>
            {step === 0 && (
              <div className="flex justify-between gap-6">
                <div className="flex-[7]">
                  <CartItemList
                    items={cartItems.map((item) => ({
                      ...item.product,
                      quantity: item.quantity,
                    }))}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                </div>
                <div className="flex-[4]">
                  <OrderSummary
                    onChooseAddress={handleNext}
                    totalMrp={totalMrp}
                    totalDiscount={totalDiscount}
                    totalAmount={totalAmount}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col lg:flex-row gap-8 w-full">
                <div className="flex-1">
                  <AddressList
                    onAddAddress={() => setIsModalOpen(true)}
                    onEditAddress={handleEditAddress}
                    selectedAddressId={selectedAddress?.id}
                    onSelectAddress={setSelectedAddress}
                    showSelection={true}
                  />
                  <AddAddressModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    editAddress={editingAddress}
                  />
                </div>
                <MyOrderSummary
                  cartItems={cartItems.map((item) => ({
                    ...item.product,
                    quantity: item.quantity,
                  }))}
                  totalMRP={totalMrp}
                  totalAmount={totalAmount}
                  discount={totalDiscount}
                  handleNext={handleNext}
                  processedToPay={processedToPay}
                />
              </div>
            )}

            {step === 2 && (
              <div className="w-full">
                <MainPaymentComponent />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
