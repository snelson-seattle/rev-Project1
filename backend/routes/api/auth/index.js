const router = require("express").Router();
const {register} = require("../../../controllers/authController");

router.post("/login", (req, res) => {
    res.json({message: "This is the /api/auth/login route"});
});

router.post("/logout", (req, res) => {
    res.json({message: "This is the /api/auth/logout route"});
});

// POST - /api/auth/register
router.post("/register", register);

module.exports = router;