const express = require("express");
const router = express.Router();

const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");
const auth = require("../middleware/auth");


/* =====================================================
   📊 ADMIN ANALYTICS
===================================================== */
router.get("/analytics", auth("admin"), async (req, res) => {

  try {

    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: "donor" });
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalHospitals = await User.countDocuments({ role: "hospital" });

    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({ status: "Pending" });
    const acceptedRequests = await BloodRequest.countDocuments({ status: "Accepted" });
    const approvedRequests = await BloodRequest.countDocuments({ status: "Approved" });
    const rejectedRequests = await BloodRequest.countDocuments({ status: "Rejected" });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDonors,
        totalPatients,
        totalHospitals,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        approvedRequests,
        rejectedRequests
      }
    });

  } catch (err) {

    console.error("ADMIN ANALYTICS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to load analytics"
    });

  }

});


/* =====================================================
   👥 GET ALL USERS (SEARCH SUPPORT)
===================================================== */
router.get("/users", auth("admin"), async (req, res) => {

  try {

    const search = req.query.search || "";

    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { role: { $regex: search, $options: "i" } },
          { bloodGroup: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } }
        ]
      };
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (err) {

    console.error("GET USERS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });

  }

});


/* =====================================================
   🩸 ADMIN GET ALL DONORS
===================================================== */
router.get("/donors", auth("admin"), async (req, res) => {

  try {

    const donors = await User.find({ role: "donor" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });

  } catch (err) {

    console.error("GET DONORS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch donors"
    });

  }

});


/* =====================================================
   🌍 PUBLIC DONOR LIST (FILTER)
===================================================== */
router.get("/public-donors", auth(["donor", "patient", "admin"]), async (req, res) => {

  try {

    const { name, bloodGroup, location } = req.query;

    let filter = {
      role: "donor"
    };

    if (name) filter.name = { $regex: name, $options: "i" };
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (location) filter.location = { $regex: location, $options: "i" };

    const donors = await User.find(filter)
      .select("-password");

    return res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });

  } catch (err) {

    console.error("PUBLIC DONOR ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch donor list"
    });

  }

});


/* =====================================================
   🗑 DELETE USER
===================================================== */
router.delete("/users/:id", auth("admin"), async (req, res) => {

  try {

    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await user.deleteOne();

    return res.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (err) {

    console.error("DELETE USER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "User deletion failed"
    });

  }

});


/* =====================================================
   📄 GET ALL BLOOD REQUESTS (ADMIN)
===================================================== */
router.get("/requests", auth("admin"), async (req, res) => {

  try {

    const requests = await BloodRequest.find()

      .populate("patient", "name email bloodGroup contactNumber location")
      .populate("donor", "name email bloodGroup")
      .populate("approvedBy", "name role")

      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });

  } catch (err) {

    console.error("GET REQUESTS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blood requests"
    });

  }

});


/* =====================================================
   ✅ APPROVE BLOOD REQUEST
===================================================== */
router.put("/approve/:id", auth(["admin", "hospital"]), async (req, res) => {

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

    request.status = "Approved";
    request.approvedBy = req.user._id;
    request.respondedAt = new Date();

    await request.save();

    return res.json({
      success: true,
      message: "Request approved successfully"
    });

  } catch (err) {

    console.error("APPROVE REQUEST ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to approve request"
    });

  }

});


/* =====================================================
   ❌ REJECT BLOOD REQUEST
===================================================== */
router.put("/reject/:id", auth(["admin", "hospital"]), async (req, res) => {

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
    request.approvedBy = req.user._id;
    request.respondedAt = new Date();

    await request.save();

    return res.json({
      success: true,
      message: "Request rejected successfully"
    });

  } catch (err) {

    console.error("REJECT REQUEST ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to reject request"
    });

  }

});


module.exports = router;