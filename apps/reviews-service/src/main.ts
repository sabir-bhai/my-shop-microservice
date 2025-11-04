/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import * as path from "path";
import cors from "cors";
import reviewRoutes from "./routes/review.route";

const app = express();

app.use(cors());
app.use(express.json());
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
