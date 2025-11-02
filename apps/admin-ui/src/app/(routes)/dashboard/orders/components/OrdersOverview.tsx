// import React from "react";
// import { Filter, Download, Package, CheckCircle } from "lucide-react";
// import StatCard from "./StatCard";
// import OrderRow from "./OrderRow";
// import { Order } from "../types/types";

// interface OrdersOverviewProps {
//   orders: Order[];
//   onViewOrder: (order: Order) => void;
// }

// const OrdersOverview: React.FC<OrdersOverviewProps> = ({
//   orders,
//   onViewOrder,
// }) => {
//   const stats = {
//     total: orders.length,
//     delivered: orders.filter((o) => o.status === "delivered").length,
//     pending: orders.filter((o) => o.status === "pending").length,
//     revenue: orders.reduce((sum, order) => sum + order.total, 0),
//   };

//   return (
//     <div className="bg-slate-900 text-white p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">Orders</h1>
//           <p className="text-gray-400">Manage and track all customer orders</p>
//         </div>
//         <div className="flex gap-3">
//           <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600">
//             <Filter className="w-4 h-4" />
//             Filter
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600">
//             <Download className="w-4 h-4" />
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatCard
//           icon={Package}
//           title="Total Orders"
//           value={stats.total}
//           color="bg-blue-500"
//         />
//         <StatCard
//           icon={CheckCircle}
//           title="Delivered"
//           value={stats.delivered}
//           color="bg-green-500"
//         />
//         <StatCard
//           icon={Package}
//           title="Pending"
//           value={stats.pending}
//           color="bg-amber-500"
//         />
//         <StatCard
//           icon={Package}
//           title="Revenue"
//           value={`$${stats.revenue.toLocaleString()}`}
//           color="bg-blue-500"
//         />
//       </div>

//       {/* Orders Table */}
//       <div className="bg-slate-800 rounded-lg border border-slate-700">
//         <div className="p-6 border-b border-slate-700">
//           <h2 className="text-xl font-semibold">Recent Orders</h2>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-slate-750">
//               <tr className="border-b border-slate-700">
//                 <th className="text-left py-4 px-4 text-gray-400 font-medium">
//                   Order
//                 </th>
//                 <th className="text-left py-4 px-4 text-gray-400 font-medium">
//                   Customer
//                 </th>
//                 <th className="text-left py-4 px-4 text-gray-400 font-medium">
//                   Status
//                 </th>
//                 <th className="text-left py-4 px-4 text-gray-400 font-medium">
//                   Date
//                 </th>
//                 <th className="text-left py-4 px-4 text-gray-400 font-medium">
//                   Total
//                 </th>
//                 <th className="text-left py-4 px-4 text-gray-400 font-medium">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <OrderRow
//                   key={order.id}
//                   order={order}
//                   onViewOrder={onViewOrder}
//                 />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrdersOverview;

import React, { useState } from "react";
import {
  Filter,
  Download,
  Package,
  CheckCircle,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Truck,
  Clock,
  X,
} from "lucide-react";
import StatCard from "./StatCard";
import OrderRow from "./OrderRow";
import { Order, Pagination } from "../types/types";

interface OrdersOverviewProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  pagination?: Pagination;
  onPageChange: (page: number) => void;
  onStatusFilter: (status: string) => void;
  currentStatusFilter: string;
  isLoading: boolean;
  onRefresh: () => void;
}

const OrdersOverview: React.FC<OrdersOverviewProps> = ({
  orders,
  onViewOrder,
  pagination,
  onPageChange,
  onStatusFilter,
  currentStatusFilter,
  isLoading,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Calculate stats from current orders
  const stats = {
    total: pagination?.totalOrders || orders.length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    pending: orders.filter((o) => o.status === "pending" || o.status === "paid")
      .length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "processing":
      case "paid":
        return <Package className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-[#080C12] text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-400">Manage and track all customer orders</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ${
              showFilters
                ? "bg-blue-600 border-blue-500"
                : "bg-[#0b1119] hover:bg-slate-700 border-slate-600"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#0b1119] hover:bg-slate-700 rounded-lg transition-colors border border-slate-600 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0b1119] hover:bg-slate-700 rounded-lg transition-colors border border-slate-600">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={currentStatusFilter}
                onChange={(e) => onStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Package}
          title="Total Orders"
          value={stats.total}
          color="bg-blue-500"
        />
        <StatCard
          icon={CheckCircle}
          title="Delivered"
          value={stats.delivered}
          color="bg-green-500"
        />
        <StatCard
          icon={Package}
          title="Pending"
          value={stats.pending}
          color="bg-amber-500"
        />
        <StatCard
          icon={Package}
          title="Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          color="bg-blue-500"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-[#0e1620] rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            {pagination && (
              <div className="text-sm text-gray-400">
                Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
                {Math.min(pagination.currentPage * 10, pagination.totalOrders)}{" "}
                of {pagination.totalOrders} orders
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-750">
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">
                  Order ID
                </th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">
                  Customer
                </th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">
                  Date
                </th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">
                  Total
                </th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">
                  Items
                </th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-700 hover:bg-slate-700/30"
                  >
                    <td className="py-4 px-4">
                      <span className="text-blue-400 font-mono">
                        #{order.id.slice(-8)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-gray-400">
                          {order.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{order.date}</td>
                    <td className="py-4 px-4 font-medium">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {order.items} item{order.items !== 1 ? "s" : ""}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 px-4 text-center text-gray-400"
                  >
                    {isLoading ? "Loading orders..." : "No orders found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-700 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersOverview;
