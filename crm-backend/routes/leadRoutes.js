const express = require("express");
const router = express.Router();

const Lead = require("../models/leads"); // match your file name

// CREATE lead
router.post("/", async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.json(newLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;