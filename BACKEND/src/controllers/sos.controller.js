const prisma = require("../config/db");

exports.triggerSOS = async (req, res) => {
  const sos = await prisma.sOS.create({
    data: {
      userId: req.user.id,
      location: req.body.location
    }
  });

  res.json({ message: "SOS Sent", sos });
};
