import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import router from "./routes/user.route";
import { errorHandler } from "../../../packages/error-handler/error-middleware";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8080"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

// Debug middleware to log ALL incoming requests
app.use((req, _res, next) => {
  console.log("🔍 [Users Service] Incoming request:", req.method, req.originalUrl);
  console.log("🔍 [Users Service] Headers:", JSON.stringify(req.headers, null, 2));
  next();
});

app.use("/api", router);
app.use(errorHandler);

const port = process.env.PORT || 6006;
const server = app.listen(port, () => {
  console.log(`🚀 Users Service listening at http://localhost:${port}`);
});

server.on("error", console.error);

