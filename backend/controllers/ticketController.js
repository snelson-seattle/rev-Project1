const DAO = require("../DAO");

const getTickets = async (req, res) => {
  const { manager, username } = req;

  try {
    if (manager) {
      const tickets = await DAO.tickets.getPendingTickets();
      return res.status(200).json(tickets);
    }else{
      const tickets = await DAO.tickets.getUserTickets(username);
      return res.status(200).json(tickets);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const createTicket = async (req, res) => {
  const { username } = req;
  const { amount, description } = req.body;

  if (!amount || !description) {
    return res
      .status(400)
      .json({ message: "amount and description are required" });
  }

  try {
    const newTicket = await DAO.tickets.createTicket({
      amount,
      description,
      username,
    });

    if (!newTicket) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    return res
      .status(201)
      .json({ message: "New ticket created successfully", ticket: newTicket });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const approveTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const approvedTicket = await DAO.tickets.approveTicket(id);
    if (approvedTicket) {
      return res.status(201).json({ message: `Ticket# ${id} approved` });
    }

    return res.status(500).json({ message: "Something went wrong" });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Can only approve tickets that have 'Pending' status" });
  }
};

const denyTicket = async (req, res) => {
  const { id } = req.params;
};

module.exports = {
  createTicket,
  getTickets,
  approveTicket,
  denyTicket,
};
