/**
 * Utility to fetch user data from User Service database
 */

import { PrismaClient as UserPrismaClient } from ".prisma/users-client";

const userPrisma = new UserPrismaClient();

/**
 * Fetch user details by userId
 */
export const fetchUserById = async (userId: string) => {
  try {
    const user = await userPrisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    });

    if (!user) {
      console.warn(`⚠️ User not found: ${userId}`);
      return null;
    }

    return user;
  } catch (error: any) {
    console.error(`❌ Error fetching user ${userId}:`, error.message);
    return null;
  }
};
