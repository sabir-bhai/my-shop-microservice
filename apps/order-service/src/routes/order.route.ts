/**
 * Order Service Routes (Refactored)
 *
 * Defines ONLY order-related endpoints.
 * Payment endpoints moved to Payment Service.
 */

import express, { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/order.controller";
import isAuthenticated from "../../../../packages/middleware/isAuthenticated";
import isAdminAuthenticated from "../../../../packages/middleware/isAdminAuthenticated";

const router: Router = express.Router();

// 📦 Order Operations (User)
router.post("/create", isAuthenticated, createOrder);
router.get("/user/orders", isAuthenticated, getUserOrders);
router.get("/:orderId", isAuthenticated, getOrderById);
router.patch("/:orderId/cancel", isAuthenticated, cancelOrder);

// 📊 Order Management (Admin)
router.get("/all", isAdminAuthenticated, getAllOrders);

export default router;
