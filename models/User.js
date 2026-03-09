const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  /* ================= BASIC DETAILS ================= */
  name: { 
    type: String, 
    required: true,
    trim: true
  },

  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true
  },

  password: { 
    type: String, 
    required: true 
  },

  role: { 
    type: String, 
    enum: ["admin", "donor", "patient", "hospital"],
    required: true 
  },

  /* ================= DONOR DETAILS ================= */

  bloodGroup: { 
    type: String,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-","A1+","A1-","B1+","B1-"],
    trim: true,
    index: true
  },

  dob: { 
    type: Date,
    required: function() {
      return this.role === "donor";
    }
  },

  contactNumber: { 
    type: String,
    match: /^[0-9]{10}$/,
    required: function() {
      return this.role === "donor";
    }
  },

  location: { 
    type: String,
    trim: true,
    index: true
  },

  guardianName: {
    type: String,
    trim: true
  },

  guardianPhone: {
    type: String,
    match: /^[0-9]{10}$/
  },

  /* ================= DONOR STATUS ================= */

  available: { 
    type: Boolean, 
    default: true 
  },

  blocked: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

/* ================= REMOVE PASSWORD FROM RESPONSE ================= */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);