const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure db.js exists
const verifyToken = require("../routes/auth"); 
 // Correct import path

const { promisify } = require("util");

// Convert db.query to use Promises
const query = promisify(db.query).bind(db);

// Get Profile (Authenticated User)
router.get("/", verifyToken, async (req, res) => {
    console.log("👤 Incoming Request: /api/profile");

    try {
        const userId = req.user.id; // Get user ID from token
        const userProfile = await query("SELECT id, name, email FROM users WHERE id = ?", [userId]);

        if (userProfile.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(userProfile[0]);
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// Update Profile
router.put("/", verifyToken, async (req, res) => {
    console.log("✏️ Updating Profile: /api/profile");

    const { name, email } = req.body;
    const userId = req.user.id;

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    try {
        await query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, userId]);
        res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
