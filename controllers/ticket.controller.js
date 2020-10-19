const ticketService = require('../service/ticketService')

exports.getTickets = async (req, res, next) => {
  const vehicleSizeId = parseInt(req.query.vehicleSizeId)

  try {
    const tickets = await ticketService.getTickets({ vehicleSizeId })

    res.json(tickets)
  } catch (err) {
        res.status(404).json({
            error: true,
            message: error
        });
  }
}


