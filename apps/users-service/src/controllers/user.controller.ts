import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../packages/libs/prisma";
import redis from "../../../../packages/libs/redis";
import {
  AuthError,
  ValidationError,
} from "../../../../packages/error-handler";
import { imagekit } from "../../../../packages/libs/imagekit";

// Get logged-in user
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

// Update user password
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

// Get all users (Admin only)
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
    console.log(err);
    return next(new AuthError("Failed to fetch users"));
  }
};

// Update user status (Admin only)
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

    // INSTANT LOGOUT: If user is marked as inactive/banned/suspended, emit Socket.IO event
    if (status !== "active") {
      try {
        await redis.publish(
          "updates",
          JSON.stringify({
            event: "user:force-logout",
            payload: { userId: id, status, reason: `Account ${status}` },
          })
        );
        console.log(`📢 Published force-logout event for user: ${id}`);
      } catch (redisErr) {
        console.error("❌ Failed to publish force-logout event:", redisErr);
        // Don't fail the request if Redis is down
      }
    }

    res.status(200).json({
      success: true,
      message: `User status updated to ${status} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete user (Admin only)
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

    // INSTANT LOGOUT: Emit Socket.IO event for deleted user
    try {
      await redis.publish(
        "updates",
        JSON.stringify({
          event: "user:force-logout",
          payload: { userId: id, status: "deleted", reason: "Account deleted" },
        })
      );
      console.log(`📢 Published force-logout event for deleted user: ${id}`);
    } catch (redisErr) {
      console.error("❌ Failed to publish force-logout event:", redisErr);
      // Don't fail the request if Redis is down
    }

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

// Update user profile (name, phone, avatar)
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

// Add address
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

// Get addresses
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
