const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({

  /* ================= PATIENT ================= */
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  /* ================= BLOOD DETAILS ================= */
  bloodGroup: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },

  units: {
    type: Number,
    default: 1,
    min: 1
  },

  hospital: {
    type: String,
    trim: true,
    default: "Not Specified"
  },

  /* ================= REQUEST STATUS ================= */
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Approved", "Rejected"],
    default: "Pending"
  },

  /* ================= DONOR WHO ACCEPTED ================= */
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  /* ================= APPROVED BY (ADMIN / HOSPITAL) ================= */
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  /* ================= RESPONSE TIME ================= */
  respondedAt: {
    type: Date,
    default: null
  }

}, {
  timestamps: true
});


/* ================= INDEX FOR FASTER SEARCH ================= */
bloodRequestSchema.index({ patient: 1 });
bloodRequestSchema.index({ donor: 1 });
bloodRequestSchema.index({ status: 1 });

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);