import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import OrdersOverview from "./OrdersOverview";
import OrderDetail from "./OrderDetail";
import { Order, OrdersApiResponse } from "../types/types";

type ViewType = "overview" | "detail";

// API function to fetch orders
const fetchOrders = async (
  page: number = 1,
  limit: number = 10,
  status?: string
): Promise<OrdersApiResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    params.append("status", status);
  }

  const response = await axios.get(
    `http://localhost:8080/order/api/get-all-orders?${params.toString()}`
  );

  return response.data;
};

const OrderManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("overview");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // TanStack Query to fetch orders
  const {
    data: ordersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders", currentPage, statusFilter],
    queryFn: () => fetchOrders(currentPage, 10, statusFilter),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setCurrentView("detail");
  };

  const handleBackToOrders = () => {
    setCurrentView("overview");
    setSelectedOrder(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-white text-xl">Loading orders...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-[#080C12] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">
            Error loading orders: {error?.message || "Something went wrong"}
          </div>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const orders = ordersResponse?.data?.orders || [];
  const pagination = ordersResponse?.data?.pagination;

  return (
    <div className="min-h-screen bg-[#080C12]">
      {currentView === "overview" ? (
        <OrdersOverview
          orders={orders}
          onViewOrder={handleViewOrder}
          pagination={pagination}
          onPageChange={handlePageChange}
          onStatusFilter={handleStatusFilter}
          currentStatusFilter={statusFilter}
          isLoading={isLoading}
          onRefresh={() => refetch()}
        />
      ) : (
        selectedOrder && (
          <OrderDetail order={selectedOrder} onBack={handleBackToOrders} />
        )
      )}
    </div>
  );
};

export default OrderManagement;
