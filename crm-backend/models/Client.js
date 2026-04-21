const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  type: { type: String, enum: ["Buyer", "Seller", "Both"], default: "Buyer" },
  preferences: String,
  interactions: [{
    type: { type: String, enum: ["Call", "Email", "Meeting", "SMS"] },
    date: { type: Date, default: Date.now },
    notes: String
  }]
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;