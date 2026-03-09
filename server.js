const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* ==============================
   MIDDLEWARE
============================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==============================
   STATIC FRONTEND
============================== */
app.use(express.static(path.join(__dirname, "public")));

/* ==============================
   API ROUTES
============================== */

const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const adminRoutes = require("./routes/adminRoutes");
const requestRoutes = require("./routes/requestRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/request", requestRoutes);

/* ==============================
   DEFAULT ROUTE
============================== */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

/* ==============================
   404 HANDLER
============================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

/* ==============================
   DATABASE CONNECTION
============================== */

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/bloodDB";

mongoose.connect(MONGO_URL)
.then(() => {

  console.log("✅ MongoDB Connected");

  app.listen(PORT, () => {
    console.log(`🩸 Server running at http://localhost:${PORT}`);
  });

})
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
});