const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Authentication & Authorization Middleware
 * @param {string|string[]} roles - Allowed role(s)
 */

const auth = (roles = []) => {

  // Convert roles to array
  if (typeof roles === "string") {
    roles = [roles];
  }

  return async (req, res, next) => {

    try {

      /* =========================
         1️⃣ GET TOKEN
      ========================= */

      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "No token provided"
        });
      }

      const token = authHeader.split(" ")[1];

      /* =========================
         2️⃣ VERIFY TOKEN
      ========================= */

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Invalid token"
        });
      }

      /* =========================
         3️⃣ ADMIN LOGIN SUPPORT
      ========================= */

      if (decoded.role === "admin") {

        req.user = {
          _id: "admin",
          id: "admin",
          role: "admin",
          name: "System Admin"
        };

      } else {

        /* =========================
           4️⃣ NORMAL USER AUTH
        ========================= */

        const userId = decoded.id || decoded._id;

        if (!userId) {
          return res.status(401).json({
            success: false,
            message: "Invalid token payload"
          });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
          return res.status(401).json({
            success: false,
            message: "User not found"
          });
        }

        req.user = user;
        req.user.id = user._id.toString();
      }

      /* =========================
         5️⃣ ROLE AUTHORIZATION
      ========================= */

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }

      next();

    } catch (err) {

      console.error("AUTH ERROR:", err.message);

      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });

    }

  };

};

module.exports = auth;