import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma";
import { AuthError } from "../../packages/error-handler";
interface AuthRequest extends Request {
  user?: any;
  role?: string;
}
const isAdminAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies["access_token"] || req.headers.authorization?.split(" ")[1];

    if (!token) throw new AuthError("Unauthorized!");

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as { id: string; role: string };

    if (!decoded || decoded.role !== "admin")
      throw new AuthError("Forbidden! Invalid admin token.");

    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
    if (!admin) throw new AuthError("Admin not found.");

    req.user = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: "admin",
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default isAdminAuthenticated;
