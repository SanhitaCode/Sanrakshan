const prisma = require("../config/db");
const autoAdmin = require("../services/autoAdmin.service");

exports.createAlert = async (req, res) => {
  const alert = await prisma.alert.create({
    data: req.body
  });

  // 🔥 Emit real-time event
  const io = req.app.get("io");
  io.emit("newAlert", alert);

  res.json(alert);
};


exports.getAlerts = async (req, res) => {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" }
  });
  res.json(alerts);
};
