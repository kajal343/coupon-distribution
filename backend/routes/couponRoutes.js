// const express = require('express');
// const router = express.Router();
// const Coupon = require('../models/Coupons');
// const abuseMiddleware = require('../middleware/abuseMiddleware');

// // Claim Coupon (Round-Robin)
// router.post('/claim', abuseMiddleware, async (req, res) => {
//   try {
//     // Ensure sessionId is present in cookies or generate a new one
//     if (!req.cookies.sessionId) {
//       res.cookie('sessionId', Math.random().toString(36).substr(2, 9), { maxAge: 60000 }); // 1-minute session
//     }

//     const coupon = await Coupon.findOneAndUpdate(
//       { isClaimed: false, available: true },
//       { 
//         isClaimed: true, 
//         claimedBy: { 
//           ip: req.ip, 
//           session: req.cookies.sessionId 
//         }
//       },
//       { new: true, sort: { _id: 1 } } // Fetch the next available coupon in order
//     );

//     if (!coupon) {
//       return res.status(400).json({ message: 'No available coupons' });
//     }

//     res.json({ message: 'Coupon claimed', coupon: coupon.code });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupons");
const abuseMiddleware = require("../middleware/abuseMiddleware");

router.post("/claim", abuseMiddleware, async (req, res) => {
  try {
    console.log("🔹 Claim request received");

    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
      sessionId = Math.random().toString(36).substr(2, 9);
      res.cookie("sessionId", sessionId, { 
        maxAge: 1800000, 
        httpOnly: true, 
        sameSite: "Strict" 
      });
    }

    const userIp = req.headers["x-forwarded-for"] || req.ip;
    console.log("✅ User IP:", userIp, "Session ID:", sessionId);

    const coupon = await Coupon.findOneAndUpdate(
      { isClaimed: false, available: true },
      { 
        isClaimed: true, 
        claimedBy: { 
          ip: userIp, 
          session: sessionId 
        }
      },
      { new: true, sort: { _id: 1 } }
    );

    if (!coupon) {
      console.warn("⚠️ No available coupons");
      return res.status(400).json({ message: "No available coupons" });
    }

    console.log("🎉 Coupon claimed:", coupon.code);
    res.json({ message: "Coupon claimed", coupon: coupon.code });
  } catch (error) {
    console.error("🚨 Claim Coupon Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;


