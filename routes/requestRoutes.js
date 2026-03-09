const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest");
const auth = require("../middleware/auth");

/* =========================================
   APPROVE REQUEST (Admin / Donor / Hospital)
========================================= */
router.put("/approve/:id", auth(["admin","donor","hospital"]), async (req, res) => {
  try {

    console.log("APPROVE API HIT");
    console.log("Approved By User ID:", req.user._id);

    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    request.status = "Approved";
    request.approvedBy = req.user._id;

    await request.save();

    const updated = await BloodRequest.findById(req.params.id);
    console.log("Saved approvedBy:", updated.approvedBy);

    res.json({
      success: true,
      message: "Request approved successfully"
    });

  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
module.exports = router;