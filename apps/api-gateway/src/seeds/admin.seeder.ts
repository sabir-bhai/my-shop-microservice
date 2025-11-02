import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@myshop.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "SuperSecure123";

  // Check if ANY admin exists
  const existingAdmin = await prisma.admin.findFirst();

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.admin.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        permissions: ["ALL"],
      },
    });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin already exists: ${existingAdmin.email}`);
  }
}
