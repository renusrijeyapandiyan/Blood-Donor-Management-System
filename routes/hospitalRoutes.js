const express = require("express");
const router = express.Router();

const BloodStock = require("../models/BloodStock");
const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");

const auth = require("../middleware/auth");


/* =====================================
   GET ALL BLOOD REQUESTS (Hospital View)
===================================== */
router.get("/requests", auth("hospital"), async (req, res) => {

  try {

    const requests = await BloodRequest.find()

      // Patient Details
      .populate(
        "patient",
        "name email bloodGroup contactNumber location"
      )

      // Donor Details
      .populate(
        "donor",
        "name email bloodGroup contactNumber location"
      )

      // Hospital/Admin who approved
      .populate(
        "approvedBy",
        "name role"
      )

      .sort({ createdAt: -1 });


    res.status(200).json({
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


/* =====================================
   APPROVE BLOOD REQUEST
===================================== */
router.put("/approve/:id", auth("hospital"), async (req, res) => {

  try {

    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    // Only allow approval if donor already accepted
    if (request.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Donor must accept request first"
      });
    }

    request.status = "Approved";

    // Save hospital id
    request.approvedBy = req.user.id;

    request.respondedAt = new Date();

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request approved successfully",
      data: request
    });

  } catch (err) {

    console.error("APPROVE REQUEST ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


/* =====================================
   REJECT BLOOD REQUEST
===================================== */
router.put("/reject/:id", auth("hospital"), async (req, res) => {

  try {

    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    if (request.status === "Approved" || request.status === "Rejected") {
      return res.status(400).json({
        success: false,
        message: "Request already processed"
      });
    }

    request.status = "Rejected";

    request.approvedBy = req.user.id;

    request.respondedAt = new Date();

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      data: request
    });

  } catch (err) {

    console.error("REJECT REQUEST ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


/* =====================================
   GET ALL DONORS
===================================== */
router.get("/donors", auth("hospital"), async (req, res) => {

  try {

    const donors = await User.find({ role: "donor" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
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