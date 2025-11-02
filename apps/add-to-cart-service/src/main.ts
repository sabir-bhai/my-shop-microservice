import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // ✅ make sure this is imported
import router from "./routes/addtocart.routes"; // Your route file

const app = express();

// ✅ Middleware to parse JSON request bodies
app.use(express.json());

// ✅ Middleware to parse cookies
app.use(cookieParser());

// ✅ CORS configuration to allow frontend to send credentials (cookies)
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend origin
    credentials: true, // Allows browser to send cookies
  })
);

// ✅ Register routes (must come after middlewares)
app.use("/cart/api", router);

// ✅ Start server
const port = process.env.PORT || 6004;
const server = app.listen(port, () => {
  console.log(`✅ Cart Service Listening at http://localhost:${port}/api`);
});

server.on("error", (err) => {
  console.error("❌ Server error:", err);
});
