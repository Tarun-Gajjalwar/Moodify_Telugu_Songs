const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();

// Trust reverse proxies (Render, Cloudflare)
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

// Allow local dev and deployed Vercel frontend
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://moodify-telugu-songs.vercel.app",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost")
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Root health check
app.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Moodify Telugu Songs Backend API is running",
        timestamp: new Date().toISOString()
    });
});

/**
 * Routes
 */
const authRoutes = require("./routes/auth.routes")
const songRoutes = require("./routes/song.routes")

app.use("/api/auth", authRoutes)
app.use("/api/songs", songRoutes)

module.exports = app