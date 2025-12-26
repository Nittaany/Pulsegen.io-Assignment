const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");


const app = express();

/* ===== Middleware ===== */
app.use(cors());
app.use(express.json());

/* ===== Routes ===== */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

/* ===== Error handler (basic) ===== */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: err.message || "Server error",
  });
});

/* ===== DB + Server ===== */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
