import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import router from "./routes/auth.route";
import { errorHandler } from "../../../packages/error-handler/error-middleware";
import { seedAdmin } from "./seeds/admin.seeder";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173", // Vite default
    "http://localhost:8080",
    "http://localhost:8081",
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cache-Control",
    "X-File-Name",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

app.use("/api", router);
app.use(errorHandler);

const port = process.env.PORT || 6001;
const server = app.listen(port, async () => {
  console.log(`🚀 Listening at http://localhost:${port}`);

  // Run seeder in background (don't block server startup)
  seedAdmin()
    .then(() => console.log("✅ Admin seeder executed"))
    .catch((error) => console.error("⚠️  Admin seeder skipped (DB not ready):", error.message));
});

server.on("error", console.error);
