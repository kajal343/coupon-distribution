const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Coupon = require('../models/Coupons');
const authMiddleware = require('../middleware/authMiddleware');

// Admin Login
// Admin Login (Fix: Compare Hashed Passwords)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const admin = await Admin.findOne({ username });
      if (!admin) return res.status(401).json({ message: 'Admin not found' });
  
      // 🔹 Compare entered password with the hashed password stored in DB
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      // 🔹 Generate JWT token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// View Coupons (Admin)
router.get('/coupons', authMiddleware, async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

// Add Coupon
router.post('/addcoupons', authMiddleware, async (req, res) => {
  const { code } = req.body;
  const newCoupon = new Coupon({ code });
  await newCoupon.save();
  res.json({ message: 'Coupon added' });
});
router.get('/history', authMiddleware, async (req, res) => {
    const claimedCoupons = await Coupon.find({ isClaimed: true });
    res.json(claimedCoupons);
  });
  
// Toggle Coupon Availability
router.patch('/coupons/:id', authMiddleware, async (req, res) => {
  const { available } = req.body;
  await Coupon.findByIdAndUpdate(req.params.id, { available });
  res.json({ message: 'Coupon updated' });
});

module.exports = router;