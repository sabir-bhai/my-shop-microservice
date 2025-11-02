import { Request, Response } from "express";
import { prisma } from "../../../../packages/libs/prisma";

// -------------------------------
// GET: Admin fetches messages with a user
// GET /chat/:userId/messages
export const getMessagesWithAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.userId;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            fromUserId: userId,
            toAdminId: { not: null },
          },
          {
            toUserId: userId,
            fromAdminId: { not: null },
          },
        ],
      },
      orderBy: { timestamp: "asc" },
    });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// -------------------------------
// POST: Send message from user or admin
// POST /chat/send

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fromUserId, toUserId, content } = req.body;

  // ✅ Validate content
  if (typeof content !== "string" || content.trim() === "") {
    res.status(400).json({ error: "Message content is required" });
    return;
  }

  // ✅ Validate that either a sender or recipient is present
  const isUserSending =
    typeof fromUserId === "string" && fromUserId.trim() !== "";
  const isAdminSending = typeof toUserId === "string" && toUserId.trim() !== "";

  if (!isUserSending && !isAdminSending) {
    res
      .status(400)
      .json({ error: "Either fromUserId or toUserId is required" });
    return;
  }

  try {
    // ✅ Get admin
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      res.status(500).json({ error: "Admin not found" });
      return;
    }

    // ✅ Create message
    let message;

    if (isUserSending) {
      // User → Admin
      message = await prisma.message.create({
        data: {
          content,
          fromUserId,
          toAdminId: admin.id,
        },
      });
    } else if (isAdminSending) {
      // Admin → User
      message = await prisma.message.create({
        data: {
          content,
          fromAdminId: admin.id,
          toUserId,
        },
      });
    }

    res.status(201).json(message);
  } catch (err) {
    console.error("Message error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// -------------------------------
// GET: Fetch messages for current user (user's perspective)
// GET /chat/me?userId=abc123
export const getMyMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.query.userId as string;

  if (!userId) {
    res.status(400).json({ error: "Missing userId" });
    return;
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            fromUserId: userId,
            toAdminId: { not: null },
          },
          {
            toUserId: userId,
            fromAdminId: { not: null },
          },
        ],
      },
      orderBy: { timestamp: "asc" },
    });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching user messages:", err);
    res.status(500).json({ error: "Failed to load messages" });
  }
};

export const getInboxUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            messagesSent: {
              some: {
                toAdminId: { not: null },
              },
            },
          },
          {
            messagesReceived: {
              some: {
                fromAdminId: { not: null },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json(users);
  } catch (err) {
    console.error("Error fetching inbox users:", err);
    res.status(500).json({ error: "Failed to fetch inbox users" });
  }
};
