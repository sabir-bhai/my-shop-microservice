/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import * as path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import reviewRoutes from "./routes/review.route";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.send({ message: "Welcome to reviews-service!" });
});

app.use("/api", reviewRoutes);

const port = process.env.PORT || 6007;
const server = app.listen(port, () => {
  console.log(`Reviews Service listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
