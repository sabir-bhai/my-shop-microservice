// pages/api/firebase/subscribe.ts
import { NextApiRequest, NextApiResponse } from "next";

interface TokenData {
  token: string;
  userId?: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    timestamp: number;
  };
}

// In production, store these in a database
let tokens: TokenData[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const tokenData: TokenData = req.body;

    // Remove existing token if it exists
    tokens = tokens.filter((t) => t.token !== tokenData.token);

    // Add new token
    tokens.push(tokenData);

    console.log("Firebase token saved:", tokenData.token);
    res.status(200).json({ message: "Token saved successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export { tokens };
