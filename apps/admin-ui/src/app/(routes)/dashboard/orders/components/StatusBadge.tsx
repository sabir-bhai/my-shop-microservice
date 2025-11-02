import React from "react";

type OrderStatus =
  | "delivered"
  | "processing"
  | "shipped"
  | "pending"
  | "cancelled";

interface StatusBadgeProps {
  status: OrderStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<OrderStatus, string> = {
    delivered: "bg-green-500/20 text-green-400 border-green-500/30",
    processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    shipped: "bg-blue-600/20 text-blue-300 border-blue-600/30",
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
