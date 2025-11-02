import React from "react";
import { Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Order } from "../types/types";

interface OrderRowProps {
  order: Order;
  onViewOrder: (order: Order) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, onViewOrder }) => {
  return (
    <tr className="border-b border-slate-700 hover:bg-slate-800/50">
      <td className="py-4 px-4">
        <div>
          <div className="text-white font-medium">{order.id}</div>
          <div className="text-gray-400 text-sm">{order.items} items</div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div>
          <div className="text-white">{order.customer.name}</div>
          <div className="text-gray-400 text-sm">{order.customer.email}</div>
        </div>
      </td>
      <td className="py-4 px-4">
        {/* <StatusBadge status={order.status} /> */}
      </td>
      <td className="py-4 px-4 text-gray-300">{order.date}</td>
      <td className="py-4 px-4 text-white font-medium">${order.total}</td>
      <td className="py-4 px-4">
        <button
          onClick={() => onViewOrder(order)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4 text-gray-400" />
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;
