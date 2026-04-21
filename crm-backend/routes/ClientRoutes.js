const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// create client
router.post("/", async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get all clients
router.get("/", async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
});

module.exports = router;