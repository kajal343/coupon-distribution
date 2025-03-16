
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
// app.use(cors());
// app.use(cookieParser());

// // Connect to Database
// connectDB();

// app.get("/", (req, res) => {
//     res.send("Backend is live! 🚀");
// });
// app.use("/api/coupons", couponRoutes);
// app.use("/api/admin", adminRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./database"); // Import database connection
const couponRoutes = require("./routes/couponRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Configure CORS correctly
app.use(
  cors({
    origin: "https://coupon-frontend-silk.vercel.app/", // Replace with your actual frontend deployment URL
    credentials: true, // Allow cookies/sessions
  })
);

// Connect to Database
connectDB();

app.get("/", (req, res) => {
  res.send("Backend is live! 🚀");
});

app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
