const router = require("express").Router();
const alert = require("../controllers/alert.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/role.middleware");

router.post("/", verifyToken, isAdmin, alert.createAlert);
router.get("/", alert.getAlerts);

module.exports = router;
