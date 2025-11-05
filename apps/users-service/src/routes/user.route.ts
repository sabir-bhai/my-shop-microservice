import express, { Router } from "express";
import {
  getUser,
  updateUserPassword,
  getAllUser,
  updateUserStatus,
  softDeleteUser,
  updateUserProfile,
  addAddress,
  getAddresses,
} from "../controllers/user.controller";

import isAuthenticated from "../../../../packages/middleware/isAuthenticated";
import isAdminAuthenticated from "../../../../packages/middleware/isAdminAuthenticated";
import { exportUsersPDF } from "../assets/pdf-export.controller";

const router: Router = express.Router();



router.get("/all", getAllUser);
// 👤 User Profile Management
router.get("/profile", isAuthenticated, getUser);
router.put("/profile", isAuthenticated, updateUserProfile);
router.put("/password", isAuthenticated, updateUserPassword);

// 📍 Address Management
router.post("/address", isAuthenticated, addAddress);
router.get("/address", isAuthenticated, getAddresses);

// 👥 Admin: User Management

router.patch("/status/:id", updateUserStatus);
router.delete("/:id", isAdminAuthenticated, softDeleteUser);

// 📄 Admin: Export Users
router.get("/export/pdf", isAdminAuthenticated, exportUsersPDF);

export default router;
