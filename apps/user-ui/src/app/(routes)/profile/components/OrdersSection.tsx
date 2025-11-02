import { Check, Clock, Download, Truck, X } from "lucide-react";
import { Order } from "../types/type";

const OrdersSection = () => {
  const orders: Order[] = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 159.99,
      items: 3,
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "shipped",
      total: 89.5,
      items: 2,
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "processing",
      total: 245.0,
      items: 5,
    },
    {
      id: "ORD-004",
      date: "2024-01-01",
      status: "cancelled",
      total: 75.25,
      items: 1,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <Check size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "processing":
        return <Clock size={16} />;
      case "cancelled":
        return <X size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#773d4c] mb-6">My Orders</h2>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-[#773d4c]">{order.id}</span>
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {order.date} • {order.items} item{order.items > 1 ? "s" : ""}
                </p>
                <p className="text-lg font-semibold">${order.total}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 text-[#773d4c] border border-[#773d4c] rounded-2xl hover:bg-[#773d4c] hover:text-white transition-colors text-sm">
                  View Details
                </button>
                {order.status === "shipped" && (
                  <button className="px-4 py-2 text-[#773d4c] border border-[#773d4c] rounded-2xl hover:bg-[#773d4c] hover:text-white transition-colors text-sm">
                    Track Order
                  </button>
                )}
                <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors text-sm">
                  <Download size={16} className="inline mr-1" />
                  Invoice
                </button>
                {order.status === "delivered" && (
                  <button className="px-4 py-2 bg-[#773d4c] text-white rounded-2xl hover:opacity-90 transition-opacity text-sm">
                    Reorder
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersSection;
