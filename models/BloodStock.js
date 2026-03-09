const mongoose = require("mongoose");

const bloodStockSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    unitsAvailable: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

// Correct model name
module.exports = mongoose.models.BloodStock || mongoose.model("BloodStock", bloodStockSchema);