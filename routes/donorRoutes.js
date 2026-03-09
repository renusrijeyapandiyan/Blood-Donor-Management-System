const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");
const auth = require("../middleware/auth");


/* =========================================
   GET DONOR PROFILE   ✅ FIX ADDED
========================================= */
router.get("/profile", auth("donor"), async (req, res) => {

  try {

    const donor = await User.findById(req.user.id).select("-password");

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found"
      });
    }

    res.json({
      success: true,
      data: donor
    });

  } catch (err) {

    console.error("GET PROFILE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


/* =========================================
   UPDATE DONOR PROFILE
========================================= */
router.put("/profile", auth("donor"), async (req, res) => {

  try {

    const { name, email, contactNumber, location, bloodGroup, guardianName, guardianContact, dob } = req.body;

    const donor = await User.findById(req.user.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found"
      });
    }

    donor.name = name || donor.name;
    donor.email = email || donor.email;
    donor.contactNumber = contactNumber || donor.contactNumber;
    donor.location = location || donor.location;
    donor.bloodGroup = bloodGroup || donor.bloodGroup;
    donor.guardianName = guardianName || donor.guardianName;
    donor.guardianContact = guardianContact || donor.guardianContact;
    donor.dob = dob || donor.dob;

    await donor.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: donor
    });

  } catch (err) {

    console.error("UPDATE PROFILE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error updating profile"
    });

  }

});


/* =========================================
   GET ALL PENDING REQUESTS
========================================= */
router.get("/requests", auth("donor"), async (req, res) => {

  try {

    const requests = await BloodRequest.find({ status: "Pending" })
      .populate("patient", "name contactNumber location bloodGroup")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });

  } catch (err) {

    console.error("GET REQUESTS ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


/* =========================================
   ACCEPT REQUEST
========================================= */
router.put("/accept/:id", auth("donor"), async (req, res) => {

  try {

    const requestId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID"
      });
    }

    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed"
      });
    }

    request.status = "Accepted";
    request.donor = req.user.id;
    request.respondedAt = new Date();

    await request.save();

    res.json({
      success: true,
      message: "Request accepted successfully",
      data: request
    });

  } catch (err) {

    console.error("ACCEPT ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error accepting request"
    });

  }

});


/* =========================================
   REJECT REQUEST
========================================= */
router.put("/reject/:id", auth("donor"), async (req, res) => {

  try {

    const requestId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID"
      });
    }

    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed"
      });
    }

    request.status = "Rejected";
    request.donor = req.user.id;
    request.respondedAt = new Date();

    await request.save();

    res.json({
      success: true,
      message: "Request rejected successfully"
    });

  } catch (err) {

    console.error("REJECT ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error rejecting request"
    });

  }

});


/* =========================================
   GET ALL DONORS
========================================= */
router.get("/all", auth("donor"), async (req, res) => {

  try {

    const donors = await User.find({ role: "donor" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donors.length,
      data: donors
    });

  } catch (err) {

    console.error("GET DONORS ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


module.exports = router;