const router = require("express").Router();
const ticketController = require("../../../controllers/ticketController");
const authorization = require("../../../middleware/authorization");

// Manager Actions
router.get("/", authorization.authenticatedUserAccess, ticketController.getTickets);
router.patch("/approve/:id", authorization.managerAccess, ticketController.approveTicket);
router.patch("/deny/:id", authorization.managerAccess, ticketController.denyTicket);

// User Actions
router.post("/", authorization.userAccess, ticketController.createTicket);


module.exports = router;