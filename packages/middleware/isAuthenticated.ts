import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma";

interface AuthRequest extends Request {
  user?: any;
  role?: string;
}

interface JwtPayload {
  userId?: string;
  id?: string;
  role: "user";
}

const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try to read token from cookies or Authorization header
    const token =
      req.cookies?.["access_token"] || req.headers.authorization?.split(" ")[1];
    console.log("Token is ", token);
    if (!token) {
      res.status(401).json({ message: "Unauthorized! Token missing." });
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    const accountId = decoded.id || decoded.userId;

    if (!decoded || !accountId || !decoded.role) {
      res.status(401).json({ message: "Unauthorized! Invalid token." });
      return;
    }

    let account = null;

    // Check role and fetch account
    if (decoded.role === "user") {
      account = await prisma.user.findUnique({ where: { id: accountId } });
    }

    if (!account) {
      res.status(401).json({ message: "Account not found!" });
      return;
    }

    // Attach user & role to request
    req.user = account;
    req.role = decoded.role;

    // Continue to the next middleware/route
    return next();
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    res.status(401).json({
      message: "Unauthorized! Token expired or invalid.",
    });
    return;
  }
};

export default isAuthenticated;
