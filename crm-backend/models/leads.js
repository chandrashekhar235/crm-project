const mongoose = require("mongoose");
const leadSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    budget: Number,
    status: {
        type: String,
        enum: ["New", "Contacted", "Qualified", "Closed", "Lost"],
        default: "New"
    },
    source: { type: String, default: "Website" },
    preferences: String,
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    followUpReminder: Date,
    notes: String
}, {timestamps: true});

module.exports = mongoose.model("lead", leadSchema);