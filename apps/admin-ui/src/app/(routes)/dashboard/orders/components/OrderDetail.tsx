import React from "react";
import {
  ArrowLeft,
  Edit,
  Printer,
  Package,
  MapPin,
  Phone,
  Mail,
  CreditCard,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import OrderTimeline from "./OrderTimeline";
import { Order } from "../types/types";

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onBack }) => {
  return (
    <div className="bg-[#080c12] text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">{order.id}</h1>
            <p className="text-gray-400">Order placed on {order.date}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
            Edit Order
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-[#0e1620] rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Order Status</h2>
              <StatusBadge status={order.status} />
            </div>
            {order.timeline && <OrderTimeline timeline={order.timeline} />}
            {/* {order.tracking && (
              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className="text-sm text-gray-400">Tracking Number</div>
                <div className="text-white font-mono">{order.tracking}</div>
              </div>
            )} */}
          </div>

          {/* Order Items */}
          <div className="bg-[#0e1620]rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4  rounded-lg"
                >
                  <div className="p-3 rounded-lg  bg-[#182535]">
                    <Package className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-400 text-sm">SKU: {item.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${item.price.toFixed(2)}</div>
                    <div className="text-gray-400 text-sm">Qty: {item.qty}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-slate-600">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>
                    ${order.subtotal?.toFixed(2) || order.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {order.shipping === 0 || !order.shipping
                      ? "Free"
                      : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-white font-semibold text-lg pt-2 border-t border-slate-600">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-[#0e1620] rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Customer</h2>
            <div className="space-y-3">
              <div className="text-lg font-medium">{order.customer.name}</div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4" />
                {order.customer.email}
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4" />
                {order.customer.phone}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-[#0e1620] rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Shipping Address</h2>
            </div>
            <div className="text-gray-300 space-y-1">
              {/* <div>{order.address.street}</div> */}
              <div>
                {order.address.city}, {order.address.state} {order.address.zip}
              </div>
              {/* <div>{order.address.country}</div> */}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-[#0e1620] rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Payment</h2>
            </div>
            <div className="space-y-2">
              <div className="text-gray-300">Credit Card (****4532)</div>
              <div className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                Paid
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
