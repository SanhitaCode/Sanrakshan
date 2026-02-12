const router = require("express").Router();
const sos = require("../controllers/sos.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/", verifyToken, sos.triggerSOS);

module.exports = router;
