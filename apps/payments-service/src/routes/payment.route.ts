/**
 * Payment Service Routes
 *
 * Defines all payment-related API endpoints.
 */

import express, { Router } from "express";
import {
  createPaymentOrder,
  verifyPayment,
  capturePayment,
  getPayment,
  getUserPayments,
  initiateRefund,
} from "../controllers/payment.controller";
import isAuthenticated from "../../../../packages/middleware/isAuthenticated";
import isAdminAuthenticated from "../../../../packages/middleware/isAdminAuthenticated";

const router: Router = express.Router();

// 💳 Payment Operations (User)
router.post("/create-order", isAuthenticated, createPaymentOrder);
router.post("/verify", verifyPayment);
router.post("/capture", isAuthenticated, capturePayment);

// 📄 Payment Information (User)
router.get("/user/payments", isAuthenticated, getUserPayments);
router.get("/:paymentId", isAuthenticated, getPayment);

// 💰 Refund Operations (Admin)
router.post("/refund", isAdminAuthenticated, initiateRefund);

export default router;
