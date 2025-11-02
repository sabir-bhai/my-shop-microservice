// pages/api/firebase/send.ts
import { NextApiRequest, NextApiResponse } from "next";
import { tokens } from "./subscribe";

interface FirebaseMessage {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  topic?: string;
  tokens?: string[];
  userId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const message: FirebaseMessage = req.body;

      // Determine which tokens to send to
      let targetTokens: string[] = [];

      if (message.tokens) {
        // Send to specific tokens
        targetTokens = message.tokens;
      } else if (message.userId) {
        // Send to specific user
        targetTokens = tokens
          .filter((t) => t.userId === message.userId)
          .map((t) => t.token);
      } else {
        // Send to all tokens
        targetTokens = tokens.map((t) => t.token);
      }

      if (targetTokens.length === 0) {
        return res.status(400).json({ message: "No tokens found to send to" });
      }

      const fcmMessage = {
        notification: {
          title: message.title,
          body: message.body,
          icon: message.icon || "/firebase-logo.png",
        },
        data: {
          ...message.data,
          actions: message.actions
            ? JSON.stringify(message.actions)
            : undefined,
          requireInteraction: message.requireInteraction?.toString(),
          silent: message.silent?.toString(),
        },
        tokens: targetTokens,
      };

      // Send using Firebase Admin SDK or HTTP API
      const response = await sendFirebaseMessage(fcmMessage);

      res.status(200).json({
        message: "Notifications sent successfully",
        results: response,
        totalSent: targetTokens.length,
      });
    } catch (error: any) {
      console.error("Error sending Firebase message:", error);
      res
        .status(500)
        .json({ message: "Error sending notification", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

async function sendFirebaseMessage(message: any) {
  const serverKey = process.env.FIREBASE_SERVER_KEY;

  if (!serverKey) {
    throw new Error("Firebase server key not configured");
  }

  const promises = message.tokens.map(async (token: string) => {
    try {
      const response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization: `key=${serverKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: token,
          notification: message.notification,
          data: message.data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send notification");
      }

      return { success: true, token, result };
    } catch (error: any) {
      return { success: false, token, error: error.message };
    }
  });

  return Promise.all(promises);
}
