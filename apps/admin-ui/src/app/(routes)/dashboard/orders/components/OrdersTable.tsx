// // app/components/OrdersTable.tsx
// "use client";

// import React, { useMemo, useState } from "react";
// import { Search, ChevronDown } from "lucide-react";

// type OrderStatus = "Pending" | "Paid" | "Shipped" | "Cancelled";

// type Order = {
//   id: string;
//   customer: string;
//   date: string; // YYYY-MM-DD
//   payment: "Card" | "PayPal" | "Cash on Delivery";
//   status: OrderStatus;
//   total: number;
// };

// const DUMMY_ORDERS: Order[] = [
//   {
//     id: "ORD-1000",
//     customer: "Ava",
//     date: "2025-08-09",
//     payment: "Card",
//     status: "Pending",
//     total: 54239,
//   },
//   {
//     id: "ORD-1001",
//     customer: "Noah",
//     date: "2025-08-08",
//     payment: "PayPal",
//     status: "Paid",
//     total: 54239,
//   },
//   {
//     id: "ORD-1002",
//     customer: "Mia",
//     date: "2025-08-07",
//     payment: "Cash on Delivery",
//     status: "Shipped",
//     total: 54239,
//   },
//   {
//     id: "ORD-1003",
//     customer: "Liam",
//     date: "2025-08-06",
//     payment: "Card",
//     status: "Cancelled",
//     total: 54239,
//   },
// ];

// const statusClasses: Record<OrderStatus, string> = {
//   Pending: "bg-zinc-800 text-zinc-200",
//   Paid: "bg-violet-600 text-white",
//   Shipped: "bg-slate-700 text-slate-100",
//   Cancelled: "bg-red-700 text-white",
// };

// export default function OrdersTable() {
//   const [query, setQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");

//   const filtered = useMemo(() => {
//     return DUMMY_ORDERS.filter((o) => {
//       const q = query.trim().toLowerCase();
//       const matchesQuery =
//         !q ||
//         o.id.toLowerCase().includes(q) ||
//         o.customer.toLowerCase().includes(q);
//       const matchesStatus =
//         statusFilter === "All" ? true : o.status === statusFilter;
//       return matchesQuery && matchesStatus;
//     });
//   }, [query, statusFilter]);

//   return (
//     <section className="w-full">
//       {/* Controls */}
//       <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-3 md:p-4">
//         <div className="flex flex-col md:flex-row gap-3">
//           {/* Search */}
//           <div className="relative flex-1">
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search by order ID or customer..."
//               className="w-full rounded-xl bg-zinc-900 border border-zinc-800/80 text-zinc-200 placeholder-zinc-400 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-violet-500/40"
//             />
//             <Search className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
//           </div>

//           {/* Status filter (simple select to match screenshot) */}
//           <div className="relative w-full md:w-56">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value as any)}
//               className="appearance-none w-full rounded-xl bg-zinc-900 border border-zinc-800/80 text-zinc-200 pl-4 pr-10 py-3 outline-none focus:ring-2 focus:ring-violet-500/40"
//             >
//               <option value="All">All statuses</option>
//               <option value="Pending">Pending</option>
//               <option value="Paid">Paid</option>
//               <option value="Shipped">Shipped</option>
//               <option value="Cancelled">Cancelled</option>
//             </select>
//             <ChevronDown className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="mt-4 overflow-x-auto">
//           <table className="w-full text-left text-sm">
//             <thead className="text-zinc-400">
//               <tr className="border-t border-b border-white/5">
//                 <th className="py-4 pl-4 pr-2 font-medium">Order</th>
//                 <th className="px-2 font-medium">Customer</th>
//                 <th className="px-2 font-medium">Date</th>
//                 <th className="px-2 font-medium">Payment</th>
//                 <th className="px-2 font-medium">Status</th>
//                 <th className="px-2 pr-4 font-medium text-right">Total</th>
//               </tr>
//             </thead>
//             <tbody className="text-zinc-200">
//               {filtered.map((o) => (
//                 <tr
//                   key={o.id}
//                   className="border-b border-white/5 hover:bg-zinc-900/40 transition-colors"
//                 >
//                   <td className="py-5 pl-4 pr-2 font-medium whitespace-nowrap">
//                     {o.id}
//                   </td>
//                   <td className="px-2 whitespace-nowrap">{o.customer}</td>
//                   <td className="px-2 whitespace-nowrap">{o.date}</td>
//                   <td className="px-2 whitespace-nowrap">{o.payment}</td>
//                   <td className="px-2">
//                     <span
//                       className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
//                         statusClasses[o.status]
//                       }`}
//                     >
//                       {o.status}
//                     </span>
//                   </td>
//                   <td className="px-2 pr-4 text-right whitespace-nowrap tabular-nums">
//                     ${o.total.toFixed(2)}
//                   </td>
//                 </tr>
//               ))}

//               {filtered.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="py-10 text-center text-zinc-400 italic"
//                   >
//                     No orders match your filters.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </section>
//   );
// }
