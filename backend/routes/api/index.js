const router = require("express").Router();
const authRoutes = require("./auth");
const ticketRoutes = require("./tickets");

router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);

module.exports = router;