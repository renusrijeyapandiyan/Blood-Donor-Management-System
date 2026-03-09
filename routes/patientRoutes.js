const express = require("express");
const router = express.Router();

const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");
const auth = require("../middleware/auth");


/* =========================================
   GET PATIENT PROFILE
========================================= */
router.get("/profile", auth("patient"), async (req, res) => {

  try {

    const patient = await User.findById(req.user.id)
      .select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });

  } catch (err) {

    console.error("PATIENT PROFILE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error fetching profile"
    });

  }

});


/* =========================================
   GET AVAILABLE DONORS
========================================= */
router.get("/donors", auth("patient"), async (req, res) => {

  try {

    const donors = await User.find({
      role: "donor",
      available: true
    }).select("name email bloodGroup location contactNumber");

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });

  } catch (error) {

    console.error("GET DONORS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch donors"
    });

  }

});


/* =========================================
   GET MY REQUESTS (TRACK REQUEST)
========================================= */
router.get("/requests", auth("patient"), async (req, res) => {

  try {

    const requests = await BloodRequest.find({
      patient: req.user.id
    })
      .populate("donor", "name email bloodGroup contactNumber location")
      .populate("approvedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });

  } catch (error) {

    console.error("GET REQUESTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch requests"
    });

  }

});


/* =========================================
   CREATE BLOOD REQUEST
========================================= */
router.post("/request", auth("patient"), async (req, res) => {

  try {

    let { bloodGroup } = req.body;

    if (!bloodGroup) {
      return res.status(400).json({
        success: false,
        message: "Blood group is required"
      });
    }

    // Standardize format
    bloodGroup = bloodGroup.toUpperCase().trim();

    const newRequest = await BloodRequest.create({
      patient: req.user.id,
      bloodGroup: bloodGroup,
      status: "Pending"
    });

    res.status(201).json({
      success: true,
      message: "Blood request sent successfully",
      data: newRequest
    });

  } catch (error) {

    console.error("CREATE REQUEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create request"
    });

  }

});


/* =========================================
   DELETE REQUEST
========================================= */
router.delete("/request/:id", auth("patient"), async (req, res) => {

  try {

    const request = await BloodRequest.findOne({
      _id: req.params.id,
      patient: req.user.id
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    await request.deleteOne();

    res.json({
      success: true,
      message: "Request deleted successfully"
    });

  } catch (error) {

    console.error("DELETE REQUEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete request"
    });

  }

});


module.exports = router;