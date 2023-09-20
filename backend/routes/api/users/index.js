const router = require("express").Router();
const userController = require("../../../controllers/userController");
const authorization = require("../../../middleware/authorization");

// AUTHENTICATED USER ACCESS
// PATCH - /api/users
router.patch("/", authorization.authenticatedUserAccess, userController.updateUser);


// MANAGER ACCESS
router.get("/", authorization.managerAccess, userController.getUsers);

module.exports = router;