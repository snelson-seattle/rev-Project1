const router = require("express").Router();

router.post("/login", (req, res) => {
    res.json({message: "This is the /api/auth/login route"});
});

router.post("/logout", (req, res) => {
    res.json({message: "This is the /api/auth/logout route"});
});

router.post("/register", (req, res) => {
    res.json({message: "This is the /api/auth/register route"});
})

module.exports = router;