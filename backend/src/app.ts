import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
import apiRoutes from "./routes/apiRoutes";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://spotify-intelligence-studio.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(null, true); // Permissive CORS for smooth client connectivity
    },
    credentials: true,
  })
);

app.use(express.json());

// Production Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount Spotify OAuth authentication routes
app.use("/auth", authRoutes);

// Mount AI Music Intelligence routes
app.use("/ai", aiRoutes);

// Mount Spotify Proxy API routes
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Spotify Intelligence Studio API Running",
    status: "healthy",
    endpoints: {
      health: "/health",
      login: "/auth/login",
      callback: "/auth/callback",
      refresh: "/auth/refresh",
      me: "/auth/me",
      apiProfile: "/api/profile",
      apiTopArtists: "/api/top-artists",
      apiTopTracks: "/api/top-tracks",
      apiPlaylists: "/api/playlists",
      apiRecentlyPlayed: "/api/recently-played",
      apiFollowing: "/api/following",
    },
  });
});

export default app;