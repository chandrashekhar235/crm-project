const express = require("express");
const router = express.Router();
const axios = require("axios"); // 🔥 required for webhook

const Lead = require("../models/leads");

// CREATE lead
router.post("/", async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();

    // 🔥 Trigger n8n webhook after saving lead
    await axios.post(
      "https://agnayi2026.app.n8n.cloud/webhook/lead-created",
      req.body
    );

    res.json(newLead);
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET all leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;