const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  stage: { type: String, enum: ["Inquiry", "Negotiation", "Agreement", "Closed", "Lost"], default: "Inquiry" },
  commission: { type: Number, default: 0 },
  documents: [{
    name: String,
    url: String
  }]
}, { timestamps: true });

module.exports = mongoose.model("Deal", dealSchema);
