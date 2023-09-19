const router = require("express").Router();
const authController = require("../../../controllers/authController");
const loginLimiter = require("../../../middleware/loginLimit");

// POST - /api/auth/login
router.post("/login", loginLimiter, authController.login);

// POST - /api/auth/logout
router.post("/logout", authController.logout);

// GET - /api/auth/refresh
router.get("/refresh", authController.refresh);

// POST - /api/auth/register
router.post("/register", authController.register);

module.exports = router;