const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =========================================
   REGISTER
========================================= */
router.post("/register", async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      bloodGroup,
      dob,
      contactNumber,
      location
    } = req.body;

    /* ---------- Required Fields ---------- */
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required"
      });
    }

    /* ---------- Role Validation ---------- */
    const allowedRoles = ["donor", "patient", "hospital"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected"
      });
    }

    /* ---------- Check Existing User ---------- */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    /* ---------- Age Validation (18+) ---------- */
    if (!dob) {
      return res.status(400).json({
        success: false,
        message: "Date of birth is required"
      });
    }

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "Only users above 18 can register"
      });
    }

    /* ---------- Password Hash ---------- */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ---------- Create User ---------- */
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      bloodGroup,
      dob,
      contactNumber,
      location
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful"
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


/* =========================================
   LOGIN
========================================= */
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    /* ---------- Validate ---------- */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    /* =========================================
       ADMIN LOGIN (HARDCODED)
    ========================================= */
    if (email === "admin@gmail.com") {

      if (password !== "admin123") {
        return res.status(401).json({
          success: false,
          message: "Invalid admin credentials"
        });
      }

      const token = jwt.sign(
        {
          role: "admin"
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        token,
        role: "admin"
      });
    }

    /* =========================================
       NORMAL USER LOGIN
    ========================================= */

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    /* ---------- Generate Token ---------- */
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


module.exports = router;