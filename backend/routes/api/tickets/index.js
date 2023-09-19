const router = require("express").Router();
const ticketController = require("../../../controllers/ticketController");
const authorization = require("../../../middleware/authorization");

router.get("/", authorization.managerAccess, ticketController.getAllTickets);
router.post("/", authorization.userAccess, ticketController.createTicket);


module.exports = router;