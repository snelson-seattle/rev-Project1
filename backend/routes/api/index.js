const router = require("express").Router();
const authRoutes = require("./auth");
const ticketRoutes = require("./tickets");
const userRoutes = require("./users");

router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);
router.use("/users", userRoutes);

module.exports = router;