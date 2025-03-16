
// const mongoose = require('mongoose');

// const couponSchema = new mongoose.Schema({
//   code: { type: String, required: true },
//   isClaimed: { type: Boolean, default: false },
//   available: { type: Boolean, default: true },
//   claimedBy: { 
//     ip: { type: String },
//     session: { type: String } // Store session ID here
//   }
// });

// module.exports = mongoose.model('Coupon', couponSchema);
const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  isClaimed: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  
  // 🔹 Allow `claimedBy` to be an object (IP + Session)
  claimedBy: { 
    type: Object, 
    default: null 
  }
});

module.exports = mongoose.model("Coupon", CouponSchema);
