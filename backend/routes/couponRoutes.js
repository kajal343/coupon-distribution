const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupons');
const abuseMiddleware = require('../middleware/abuseMiddleware');

// Claim Coupon (Round-Robin)
router.post('/claim', abuseMiddleware, async (req, res) => {
  try {
    // Ensure sessionId is present in cookies or generate a new one
    if (!req.cookies.sessionId) {
      res.cookie('sessionId', Math.random().toString(36).substr(2, 9), { maxAge: 60000 }); // 1-minute session
    }

    const coupon = await Coupon.findOneAndUpdate(
      { isClaimed: false, available: true },
      { 
        isClaimed: true, 
        claimedBy: { 
          ip: req.ip, 
          session: req.cookies.sessionId 
        }
      },
      { new: true, sort: { _id: 1 } } // Fetch the next available coupon in order
    );

    if (!coupon) {
      return res.status(400).json({ message: 'No available coupons' });
    }

    res.json({ message: 'Coupon claimed', coupon: coupon.code });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
