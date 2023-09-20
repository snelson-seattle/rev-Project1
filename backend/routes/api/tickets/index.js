const router = require("express").Router();
const ticketController = require("../../../controllers/ticketController");
const authorization = require("../../../middleware/authorization");

// AUTHENTICATED USER ACCESS
// GET - /api/tickets
router.get("/", authorization.authenticatedUserAccess, ticketController.getTickets);

// MANAGER ACCCESS
// PATCH - /api/tickets/approve/:id
router.patch("/approve/:id", authorization.managerAccess, ticketController.approveTicket);
// PATCH - /api/tickets/deny/:id
router.patch("/deny/:id", authorization.managerAccess, ticketController.denyTicket);

// USER ACTIONS
// POST - /api/tickets
router.post("/", authorization.userAccess, ticketController.createTicket);


module.exports = router;