const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure db.js exists
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
require("dotenv").config();

// Convert db.query to Promises
const query = promisify(db.query).bind(db);

// Middleware to Verify JWT
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware/route
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

// Register Route
router.post("/register", async (req, res) => {
    console.log("📩 Incoming Request: /api/auth/register");

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if user exists
        const existingUser = await query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        await query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    console.log("🔑 Incoming Request: /api/auth/login");

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const results = await query("SELECT * FROM users WHERE email = ?", [email]);

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = results[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// **Profile Route - Protected**
router.get("/profile", verifyToken, async (req, res) => {
    console.log("👤 Incoming Request: /api/auth/profile");

    try {
        const user = await query("SELECT id, name, email FROM users WHERE id = ?", [req.user.id]);

        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user[0]); // Return user details (without password)
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
