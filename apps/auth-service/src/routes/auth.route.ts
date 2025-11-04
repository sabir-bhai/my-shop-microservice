import express, { Router } from "express";
import {
  userRegistration,
  verifyOtp,
  resendOtp,
  loginUser,
  refreshToken,
  verifyUserForgotPassword,
  verifyForgotPasswordOtp,
  resetPasswordWithToken,
  logoutUser,
  loginAdmin,
  refreshAdminToken,
  getAdmin,
  logoutAdmin,
  googleAuth,
  googleCallback,
} from "../controllers/auth.controller";
import isAuthenticated from "../../../../packages/middleware/isAuthenticated";
import isAdminAuthenticated from "../../../../packages/middleware/isAdminAuthenticated";

const router: Router = express.Router();

// 🔐 Registration & Verification
router.post("/user-registration", userRegistration);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// 🔐 Login, Logout & Token Refresh
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.post("/refresh-token", refreshToken);

// 🔐 Forgot Password Flow
router.post("/forgot-password", verifyUserForgotPassword);
router.post("/reset-password", resetPasswordWithToken);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOtp); // Legacy OTP endpoint

// 🔐 Google OAuth
router.get("/login-with-google", googleAuth);
router.get("/google/callback", googleCallback);

// 🔐 Admin Authentication
router.post("/login-admin", loginAdmin);
router.post("/admin-refresh-token", refreshAdminToken);
router.get("/logged-in-admin", isAdminAuthenticated, getAdmin);
router.post("/logout-admin", isAdminAuthenticated, logoutAdmin);

// 🔔 Device Token endpoint moved to notification-service

export default router;
