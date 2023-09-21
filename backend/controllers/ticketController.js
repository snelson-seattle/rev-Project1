const DAO = require("../DAO");

const getTickets = async (req, res) => {
  const { manager, username } = req;

  try {
    if (manager) {
      const tickets = await DAO.tickets.getPendingTickets();
      return res.status(200).json(tickets);
    } else {
      if (req.query.type) {
        console.log(req.query.type);
        const type = req.query.type;
        switch (type) {
          case "Food":
          case "Travel":
          case "Lodging":
          case "Other":
            const tickets = await DAO.tickets.getFilteredUserTickets(
              username,
              type
            );
            return res.status(200).json(tickets);
          default:
            return res.status(400).json({ message: "invalid ticket type" });
        }
      }
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
  const { amount, description, type } = req.body;

  if (!amount || !description || !type) {
    return res
      .status(400)
      .json({ message: "amount, description, and type are required" });
  }

  try {
    let newTicket = null;
    switch (type) {
      case "Travel":
      case "Food":
      case "Lodging":
      case "Other":
        newTicket = await DAO.tickets.createTicket({
          amount,
          type,
          description,
          username,
        });
        break;
      default:
        return res.status(400).json({ message: "invalid ticket type" });
    }

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

  try {
    const approvedTicket = await DAO.tickets.denyTicket(id);
    if (approvedTicket) {
      return res.status(201).json({ message: `Ticket# ${id} denied` });
    }

    return res.status(500).json({ message: "Something went wrong" });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Can only deny tickets that have 'Pending' status" });
  }
};

module.exports = {
  createTicket,
  getTickets,
  approveTicket,
  denyTicket,
};
