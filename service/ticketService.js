const ticketModel = require('../models/parking-models/ticket-model');

/**
 * @param {Number} param.vehicleSizeId
 * @returns {Ticket[]}
 */
async function getTickets (param) {
  debug(getTickets.name)
  const { vehicleSizeId } = param
  const ticketModels = await ticketModel.findAll({
    where: {
      vehicle_size_id: vehicleSizeId
    }
  })
  const tickets = (ticketModels.length > 0)
    ? ticketModels.map(item => item.dataValues)
    : []

  return tickets
}

module.exports = {
  getTickets
}
