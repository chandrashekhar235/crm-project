const express = require('express');
const router = express.Router();
const Lead = require('../models/leads');

// POST /api/webhooks/n8n-lead-capture
// Expects: { name, email, phone, budget, source, preferences }
router.post('/n8n-lead-capture', async (req, res) => {
  try {
    const { name, email, phone, budget, source, preferences } = req.body;
    
    // Validate minimally required fields (adjust based on your n8n form setup)
    if (!name || (!email && !phone)) {
      return res.status(400).json({ success: false, message: 'Name and either email or phone are required.' });
    }

    const newLead = new Lead({
      name,
      email,
      phone,
      budget: budget ? Number(budget) : 0,
      source: source || 'n8n Webhook',
      preferences,
      status: 'New'
    });

    await newLead.save();

    res.status(201).json({ success: true, message: 'Lead captured successfully via webhook', lead: newLead });
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error processing webhook' });
  }
});

module.exports = router;
