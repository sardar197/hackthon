require("dotenv").config(); // Load environment variables at the top

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

// ✅ Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors({
    origin: "*", // Allow all origins (for testing)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// ✅ MySQL Database Connection (Using Connection Pool)
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "test_db",
    connectionLimit: 10 // Allow up to 10 connections at a time
});

// ✅ Test Database Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
        process.exit(1); // Exit if DB fails to connect
    } else {
        console.log("✅ Connected to MySQL Database");
        connection.release(); // Release the connection back to the pool
    }
});

// ✅ Import Routes (Ensure they exist before loading)
try {
    const authRoutes = require("./routes/auth"); // Authentication Routes
    const alertRoutes = require("./routes/alert"); // Alerts System
    const profileRoutes = require("./routes/profile"); // User Profiles

    app.use("/api/auth", authRoutes);
    app.use("/api/alerts", alertRoutes);
    app.use("/api/profile", profileRoutes);

    console.log("✅ Routes Loaded Successfully!");

} catch (error) {
    console.error("❌ Error loading routes:", error.message);
}

// ✅ Test API Route (Check if backend is running)
app.get("/test", (req, res) => {
    res.json({ message: "✅ Server is running!" });
});

// ✅ Default 404 Route
app.use((req, res) => {
    res.status(404).json({ error: "❌ Route Not Found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ API available at: http://127.0.0.1:${PORT}/test`);
});
