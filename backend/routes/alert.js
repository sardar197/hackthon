const express = require("express");
const router = express.Router();
const db = require("../db"); // Import database connection

router.post("/send-alert", (req, res) => {
    const { user_id, location, emergency_type } = req.body;

    db.query("INSERT INTO alerts (user_id, location, emergency_type) VALUES (?, ?, ?)",
        [user_id, location, emergency_type],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Failed to send alert" });
            res.json({ message: "Emergency alert sent successfully" });
        }
    );
});

router.get("/", (req, res) => {
    db.query("SELECT * FROM alerts", (err, results) => {
        if (err) return res.status(500).json({ message: "Failed to fetch alerts" });
        res.json(results);
    });
});

module.exports = router;
