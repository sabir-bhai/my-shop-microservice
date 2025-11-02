// pages/api/firebase/topic.ts
import { NextApiRequest, NextApiResponse } from "next";

interface TopicMessage {
  topic: string;
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, any>;
  condition?: string; // For advanced targeting
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { action, ...payload } = req.body;

      switch (action) {
        case "send":
          return await sendTopicMessage(payload, res);
        case "subscribe":
          return await subscribeToTopic(payload, res);
        case "unsubscribe":
          return await unsubscribeFromTopic(payload, res);
        default:
          return res.status(400).json({ message: "Invalid action" });
      }
    } catch (error: any) {
      console.error("Topic API error:", error);
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

async function sendTopicMessage(message: TopicMessage, res: NextApiResponse) {
  const serverKey = process.env.FIREBASE_SERVER_KEY;

  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      Authorization: `key=${serverKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: `/topics/${message.topic}`,
      notification: {
        title: message.title,
        body: message.body,
        icon: message.icon || "/firebase-logo.png",
      },
      data: message.data,
      condition: message.condition,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to send topic message");
  }

  res.status(200).json({ message: "Topic message sent successfully", result });
}

async function subscribeToTopic(
  payload: { tokens: string[]; topic: string },
  res: NextApiResponse
) {
  const serverKey = process.env.FIREBASE_SERVER_KEY;

  const response = await fetch(`https://iid.googleapis.com/iid/v1:batchAdd`, {
    method: "POST",
    headers: {
      Authorization: `key=${serverKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: `/topics/${payload.topic}`,
      registration_tokens: payload.tokens,
    }),
  });

  const result = await response.json();
  res.status(200).json({ message: "Subscribed to topic", result });
}

async function unsubscribeFromTopic(
  payload: { tokens: string[]; topic: string },
  res: NextApiResponse
) {
  const serverKey = process.env.FIREBASE_SERVER_KEY;

  const response = await fetch(
    `https://iid.googleapis.com/iid/v1:batchRemove`,
    {
      method: "POST",
      headers: {
        Authorization: `key=${serverKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: `/topics/${payload.topic}`,
        registration_tokens: payload.tokens,
      }),
    }
  );

  const result = await response.json();
  res.status(200).json({ message: "Unsubscribed from topic", result });
}
