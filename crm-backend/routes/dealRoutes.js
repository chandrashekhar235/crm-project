const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');

router.get('/', async (req, res) => {
  try {
    const deals = await Deal.find().populate('clientId').populate('propertyId').populate('agentId');
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const deal = new Deal(req.body);
  try {
    const newDeal = await deal.save();
    res.status(201).json(newDeal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedDeal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDeal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
