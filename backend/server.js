
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const connectDB = require("./database"); // Import database connection
// const couponRoutes = require("./routes/couponRoutes");
// const adminRoutes = require("./routes/adminRoutes");

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// // ✅ Configure CORS correctly
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "https://coupon-frontend-silk.vercel.app"], // Replace with your actual frontend deployment URL
//     credentials: true, // Allow cookies/sessions
//   })
// );

// // Connect to Database
// connectDB();

// app.get("/", (req, res) => {
//   res.send("Backend is live! 🚀");
// });

// app.use("/api/coupons", couponRoutes);
// app.use("/api/admin", adminRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./database");
const couponRoutes = require("./routes/couponRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Correct CORS settings
const allowedOrigins = [
  "http://localhost:3000", 
  "https://coupon-frontend-silk.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true, // ✅ Required for cookies
  })
);

// ✅ Explicitly set headers for security
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Requested-With");
  next();
});

// Connect to Database
connectDB();

app.get("/", (req, res) => {
  res.send("Backend is live! 🚀");
});

app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
