const DAO = require("../DAO");

const getAllTickets = async (req, res) => {
    const response = await DAO.tickets.getTickets();
    res.status(200).json(response);
}
const createTicket = async (req, res) => {

}

module.exports = {
    createTicket,
    getAllTickets
}