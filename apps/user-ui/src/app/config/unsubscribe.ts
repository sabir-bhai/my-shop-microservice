// pages/api/firebase/unsubscribe.ts
import { NextApiRequest, NextApiResponse } from "next";
import { tokens } from "./subscribe";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { token } = req.body;

    const index = tokens.findIndex((t) => t.token === token);
    if (index !== -1) {
      tokens.splice(index, 1);
      console.log("Token removed:", token);
    }

    res.status(200).json({ message: "Token removed successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
