const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/alerts", require("./routes/alert.routes"));
app.use("/api/sos", require("./routes/sos.routes"));

module.exports = app;
