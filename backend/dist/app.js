"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:3000",
    "https://spotify-intelligence-studio.vercel.app"
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
            return callback(null, true);
        }
        return callback(null, true); // Permissive CORS for smooth client connectivity
    },
    credentials: true,
}));
app.use(express_1.default.json());
// Production Health Check Endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// Mount Spotify OAuth authentication routes
app.use("/auth", authRoutes_1.default);
// Mount AI Music Intelligence routes
app.use("/ai", aiRoutes_1.default);
// Mount Spotify Proxy API routes
app.use("/api", apiRoutes_1.default);
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
exports.default = app;
