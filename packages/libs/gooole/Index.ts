// utils/arctic.ts
import * as arctic from "arctic";

export const googleClient = new arctic.Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

export const generateState = () => arctic.generateState();
export const generateCodeVerifier = () => arctic.generateCodeVerifier();
// remove calculatePKCECodeChallenge entirely
