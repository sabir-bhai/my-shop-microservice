import { NextFunction, Request, Response } from "express";
import redis from "../../../../packages/libs/redis";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../packages/libs/prisma";
import { sendEmail } from "../utils/sendEmail/sendEmail";
import {
  AuthError,
  ConflictError,
  ValidationError,
} from "../../../../packages/error-handler";
import { setCookie } from "../utils/cookies/setCookies";
import jwt from "jsonwebtoken";
import { imagekit } from "../../../../packages/libs/imagekit";
import { generateCodeVerifier, generateState } from "arctic";
import { googleClient } from "../../../../packages/libs/gooole/Index";
import fetch from "node-fetch";

import ejs from "ejs";
import puppeteer, { Browser } from "puppeteer";
import path from "path";
import fs from "fs";

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      // return res.status(400).json({ message: "All fields are required" });
      throw new ValidationError("All fields are required");
    }

    if (password !== confirmPassword) {
      // return res.status(400).json({ message: "Passwords do not match" });
      throw new ValidationError("Passwords do not match");
    }

    // Check if user already exists in DB
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const passwordHash = await bcrypt.hash(password, 10);

    // Save in Redis for 10 min
    await redis.set(
      `signup:${email}`,
      JSON.stringify({ name, email, passwordHash, otpHash }),
      "EX",
      600
    );

    await sendEmail(email, "Verify Your Email", "user-activation.mail.ejs", {
      name,
      otp,
    });

    return res.json({ message: "OTP sent to your email" });
  } catch (err) {
    return next(err);
  }
};

//it is for user verify the otp
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const data = await redis.get(`signup:${email}`);
    if (!data) {
      return res
        .status(400)
        .json({ message: "OTP expired or registration not found" });
    }

    const userData = JSON.parse(data);
    const isOtpValid = await bcrypt.compare(otp, userData.otpHash);

    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Save verified user in DB
    await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.passwordHash,
        isVerified: true,
      },
    });

    // Remove from Redis
    await redis.del(`signup:${email}`);

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

//It is for login
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    debugger;
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError("Email and password are required!");
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AuthError("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      throw new AuthError("Invalid email or password.");
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // Set user tokens
    setCookie(res, "access_token", accessToken);
    setCookie(res, "refresh_token", refreshToken);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
      },
    });
    // Success response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

//it is get the loged in user
export const getUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // 1) All fields present?
    if (!currentPassword || !newPassword || !confirmPassword) {
      return next(new ValidationError("All fields are required"));
    }

    // 2) New & confirm match?
    if (newPassword !== confirmPassword) {
      return next(new ValidationError("New passwords do not match"));
    }

    // 3) New ≠ current?
    if (currentPassword === newPassword) {
      return next(
        new ValidationError(
          "New password cannot be the same as the current password"
        )
      );
    }

    // 4) Load user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      return next(new AuthError("User not found or password not set"));
    }

    // 5) Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new AuthError("Current password is incorrect"));
    }

    // 6) Hash & store the new one
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    // 7) Success
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return next(err);
  }
};

// 🔄 Refresh Access Token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken =
      req.cookies["refresh_token"] || req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      return next(new ValidationError("Unauthorized! No refresh token."));
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string; role: "user" };

    console.log("decoded token:", decoded);
    if (!decoded || !decoded.id || decoded.role !== "user") {
      return next(new AuthError("Forbidden! Invalid refresh token."));
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return next(new AuthError("Forbidden! Account not found."));
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    setCookie(res, "access_token", newAccessToken);

    return res.status(201).json({ success: true });
  } catch (error) {
    return next(error);
  }
};

// 🔑 Request Forgot Password OTP
// Step 1: Request OTP
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) throw new ValidationError("Email is required!");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ValidationError("User not found!");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    await redis.set(`forgot:${email}`, JSON.stringify({ otpHash }), "EX", 600);

    const resetLink = `http://localhost:3000/reset-password?email=${encodeURIComponent(
      email
    )}`;

    await sendEmail(
      email,
      "Reset Your Password",
      "forgot-password-user.mail.ejs",
      {
        otp,
        resetLink, // ✅ Pass reset link to email template
        name: user?.name || "User",
      }
    );

    res.status(200).json({
      message: "OTP and reset link sent to email. Please verify your account.",
    });
  } catch (error) {
    next(error);
  }
};

// Step 2: Verify OTP and Reset Password
export const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      throw new ValidationError("Email, OTP, and new password are required!");
    }

    if (newPassword.length < 8) {
      throw new ValidationError("Password must be at least 8 characters long.");
    }

    const data = await redis.get(`forgot:${email}`);
    if (!data) throw new ValidationError("OTP expired or invalid.");

    const { otpHash } = JSON.parse(data);
    const isOtpValid = await bcrypt.compare(otp, otpHash);
    if (!isOtpValid) throw new ValidationError("Invalid OTP");

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: passwordHash },
    });

    await redis.del(`forgot:${email}`);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

// 🔐 Logout User
export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear cookies
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return next(error);
  }
};

//@ Get All the user
export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, page = "1", limit = "10" } = req.query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    let whereClause: any = {};
    if (status && typeof status === "string" && status !== "all") {
      whereClause.status = status;
    }

    const total = await prisma.user.count({ where: whereClause });
    const users = await prisma.user.findMany({
      where: whereClause,
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      status: "success",
      page: pageNum,
      total,
      result: users.length,
      users,
    });
  } catch (err) {
    console.log(err); // 👉 see real cause
    return next(new AuthError("Failed to fetch users"));
  }
};

export const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate user ID
    if (!id) {
      throw new ValidationError("User ID is required");
    }

    // Validate status
    const validStatuses = ["active", "inactive", "banned", "suspended"];
    if (!status || !validStatuses.includes(status)) {
      throw new ValidationError(
        `Status must be one of: ${validStatuses.join(", ")}`
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, status: true, name: true },
    });

    if (!existingUser) {
      throw new ValidationError("User not found");
    }

    // Prevent updating already deleted users
    if (existingUser.status === "deleted") {
      throw new ValidationError("Cannot update status of deleted user");
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        status,
        // Update lastLogin to null if user is being deactivated/banned
        ...(status !== "active" && { lastLogin: null }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        lastLogin: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `User status updated to ${status} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const softDeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate user ID
    if (!id) {
      throw new ValidationError("User ID is required");
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        status: true,
        name: true,
      },
    });

    if (!existingUser) {
      throw new ValidationError("User not found");
    }

    // Check if user is already deleted
    if (existingUser.status === "deleted") {
      throw new ValidationError("User is already deleted");
    }

    // Soft delete user by updating status
    const deletedUser = await prisma.user.update({
      where: { id },
      data: {
        status: "deleted",
        lastLogin: null,
        // Optionally anonymize email for privacy
        email: `deleted_user_${Date.now()}@deleted.com`,
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {
        id: deletedUser.id,
        status: deletedUser.status,
        deletedAt: deletedUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
//========================ADMIN PART HERE =====================

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new ValidationError("Email and password are required!");

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new AuthError("Invalid email or password.");

    const isMatch = await bcrypt.compare(password, admin.password!);
    if (!isMatch) throw new AuthError("Invalid email or password.");

    const accessToken = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    setCookie(res, "admin_access_token", accessToken);
    setCookie(res, "admin_refresh_token", refreshToken);

    res.status(200).json({
      message: "Admin login successful",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    next(error);
  }
};

// 🔄 Refresh Token for Admin
export const refreshAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies["admin_refresh_token"] ||
      req.headers.authorization?.split(" ")[1];

    if (!token) throw new ValidationError("Unauthorized! No refresh token.");

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string; role: "admin" };

    if (!decoded || decoded.role !== "admin")
      throw new AuthError("Forbidden! Invalid refresh token.");

    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
    if (!admin) throw new AuthError("Forbidden! Admin not found.");

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: "admin" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    setCookie(res, "access_token", newAccessToken);

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// 👤 Get Logged-in Admin
export const getAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const admin = req.user;

    res.status(200).json({ success: true, admin });
  } catch (error) {
    next(error);
  }
};

// 🚪 Logout Admin
export const logoutAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("admin_access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.clearCookie("admin_refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// UPDATE: user profile (name, phone, avatar)

export const updateUserProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id as string | undefined;
    if (!userId) return next(new AuthError("Unauthorized"));

    const { name, phone, avatar } = req.body as {
      name?: string;
      phone?: string | null;
      avatar?: string | null; // base64 data URL or null to remove
    };

    if (
      typeof name === "undefined" &&
      typeof phone === "undefined" &&
      typeof avatar === "undefined"
    ) {
      return next(new ValidationError("No fields provided to update"));
    }

    const data: any = {};
    if (typeof name !== "undefined") data.name = name?.trim() || null;
    if (typeof phone !== "undefined") data.phone = phone?.trim() || null;

    // Handle avatar
    if (typeof avatar !== "undefined") {
      if (avatar === null) {
        data.avatar = null;
      } else if (avatar.startsWith("data:")) {
        const uploadRes = await imagekit.upload({
          file: avatar, // base64 data URL
          fileName: `avatar_${userId}_${Date.now()}`,
          folder: "/user-avatars",
        });
        data.avatar = uploadRes.url;
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updated,
    });
  } catch (error) {
    return next(error);
  }
};

// FCM TOKEN

export const saveDeviceToken = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const { token, platform } = req.body;
    const userId = req.user?.id;

    if (!token || !userId) {
      res
        .status(400)
        .json({ error: "Token and either userId or adminId are required" });
      return;
    }

    const deviceToken = await prisma.deviceToken.upsert({
      where: { token },
      update: { platform, userId },
      create: { token, platform, userId },
    });

    res.json({ success: true, data: deviceToken });
    return; // optional but keeps TypeScript happy
  } catch (error) {
    console.error("Error saving device token:", error);
    res.status(500).json({ error: "Failed to save device token" });
    return;
  }
};

//Gooole Auth

// Step 1: Redirect to Google OAuth

export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    res.cookie("oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 5 * 60 * 1000,
    });
    res.cookie("oauth_code_verifier", codeVerifier, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 5 * 60 * 1000,
    });

    const scopes = ["openid", "email", "profile"];
    const authURL = googleClient.createAuthorizationURL(
      state,
      codeVerifier,
      scopes
    );

    return res.redirect(authURL.toString());
  } catch (err) {
    next(err);
  }
};

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, state } = req.query;
    const savedState = req.cookies["oauth_state"];
    const codeVerifier = req.cookies["oauth_code_verifier"];

    if (
      !code ||
      !state ||
      !savedState ||
      state !== savedState ||
      !codeVerifier
    ) {
      res.status(400).json({ message: "Invalid state or code" });
      return;
    }

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    const tokens = await googleClient.validateAuthorizationCode(
      code as string,
      codeVerifier
    );
    const accessToken = tokens.accessToken();

    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const profile = (await profileRes.json()) as {
      email: string;
      name?: string;
      picture?: string;
    };

    let user = await prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      const randomPassword = await bcrypt.hash(
        Math.random().toString(36) + Date.now().toString(),
        10
      );

      user = await prisma.user.create({
        data: {
          name: profile.name ?? "Google User",
          email: profile.email,
          password: randomPassword,
          isVerified: true,
          avatar: profile.picture ?? null,
          role: "user", // set default role for new Google users
          lastLogin: new Date(),
        },
      });
    } else {
      // Update role and lastLogin for existing users
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          role: "user", // you can decide role logic here if needed
          lastLogin: new Date(),
        },
      });
    }

    const accessTokenJwt = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshTokenJwt = jwt.sign(
      { id: user.id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    setCookie(res, "access_token", accessTokenJwt);
    setCookie(res, "refresh_token", refreshTokenJwt);

    res.redirect(`${process.env.CLIENT_BASE_URL}/dashboard`);
  } catch (err) {
    next(err);
  }
};

//================================ADDRESS=======================
export const addAddress = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pincode, city, state, address, locality, type, name, phone } =
      req.body;
    const userId = req.user.id;
    if (
      !pincode ||
      !city ||
      !state ||
      !address ||
      !locality ||
      !name ||
      !phone
    ) {
      throw new ValidationError("All required fields must be filled");
    }
    if (type === "Home" || type === "Office") {
      const existingType = await prisma.address.findFirst({
        where: {
          userId,
          type: type,
        },
      });

      if (existingType) {
        throw new ValidationError(`${type} address already exists.`);
      }
    }

    const newAddress = await prisma.address.create({
      data: {
        pincode,
        city,
        state,
        address,
        locality,
        type,
        name,
        phone,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      data: newAddress,
      message: "Address added successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getAddresses = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    // Fetch all addresses of the current user
    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Improved users PDF export with nicer layout:
 * - Title + generation metadata (uses IST)
 * - Table-like layout with column headers
 * - Alternating row backgrounds
 * - Wrapped cells, automatic page breaks
 * - Header & footer on every page (page numbers)
 */

export const exportUsersPDF = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let browser: Browser | null = null;

  try {
    console.log("Starting PDF export process...");

    // 1. Fetch users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        lastLogin: true,
        isVerified: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${users.length} users for export`);

    // 2. Template path validation
    const templatePath = path.resolve(
      process.cwd(),
      "apps/auth-service/src/utils/pdf-template/users-report.ejs"
    );
    console.log("Template path:", templatePath);

    if (!fs.existsSync(templatePath)) {
      console.error("EJS template not found at:", templatePath);
      return res
        .status(500)
        .json({ error: "PDF template not found on server" });
    }

    // 3. Render HTML with error handling
    let html: string;
    try {
      html = await ejs.renderFile(templatePath, {
        users,
        exportDate: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      });
      console.log("HTML rendered successfully, length:", html.length);

      if (html.length < 100) {
        console.error("Rendered HTML is too short:", html);
        throw new Error("HTML template rendered but appears empty");
      }
    } catch (ejsError) {
      console.error("EJS rendering error:", ejsError);
      throw new Error(`Template rendering failed: ${ejsError}`);
    }

    // 4. Launch puppeteer with enhanced options
    console.log("Launching browser...");
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
        timeout: 30000,
      });
      console.log("Browser launched successfully");
    } catch (browserError) {
      console.error("Browser launch error:", browserError);
      throw new Error(`Failed to launch browser: ${browserError}`);
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    // 5. Set content with timeout and error handling
    console.log("Setting page content...");
    try {
      await page.setContent(html, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });
      console.log("Page content set successfully");
    } catch (contentError) {
      console.error("Error setting page content:", contentError);
      throw new Error(`Failed to set page content: ${contentError}`);
    }

    // 6. Generate PDF with detailed logging
    console.log("Generating PDF...");
    console.log("Memory before PDF:", process.memoryUsage());

    let pdfBuffer: Buffer;
    try {
      const pdfData = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
        timeout: 30000,
      });

      // Convert Uint8Array to Buffer if necessary
      pdfBuffer = Buffer.isBuffer(pdfData) ? pdfData : Buffer.from(pdfData);
      console.log("PDF generated successfully");
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
      throw new Error(`PDF generation failed: ${pdfError}`);
    }

    // 7. Validate PDF buffer with detailed logging
    console.log("PDF Buffer validation:", {
      exists: !!pdfBuffer,
      isBuffer: Buffer.isBuffer(pdfBuffer),
      length: pdfBuffer?.length,
      type: typeof pdfBuffer,
    });

    if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
      const error = "PDF buffer is invalid - not a proper Buffer object";
      console.error(error);
      throw new Error(error);
    }

    if (pdfBuffer.length < 100) {
      console.error("PDF buffer too small:", pdfBuffer.length);
      console.log(
        "Buffer start (hex):",
        pdfBuffer.slice(0, 50).toString("hex")
      );
      console.log("Buffer start (text):", pdfBuffer.slice(0, 50).toString());
      throw new Error(`PDF buffer too small: ${pdfBuffer.length} bytes`);
    }

    console.log("PDF buffer is valid, length:", pdfBuffer.length);

    // 8. Set headers and send response
    const filename = `users-export-${
      new Date().toISOString().split("T")[0]
    }.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Length", String(pdfBuffer.length));
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    console.log("Sending PDF response...");
    return res.end(pdfBuffer);
  } catch (error) {
    console.error("PDF export error:", error);

    // Close browser if it was opened
    if (browser) {
      try {
        await browser.close();
        console.log("Browser closed after error");
      } catch (closeErr) {
        console.error("Error closing browser:", closeErr);
      }
    }

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
    return;
  } finally {
    // Ensure browser cleanup
    if (browser) {
      try {
        await browser.close();
        console.log("Browser closed in finally block");
      } catch (closeErr) {
        console.error("Error closing browser in finally:", closeErr);
      }
    }
  }
};

// Export Users as CSV
