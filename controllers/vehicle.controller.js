const vehicleService = require('../service/vehicleService')

exports.park = async (req, res, next) => {
  const {
    vehicleSizeId,
    plateNumber,
    parkingLotId // entry parking lot id
  } = req.body

  try {
    const ticket = await vehicleService.park({
      vehicleSizeId,
      plateNumber,
      parkingLotId
    })

    res.json(ticket);
  } catch (err) {
        res.status(404).json({
            error: true,
            message: error
        });
  }
}

exports.exit = async (req, res, next) => {
  const {
    ticketId
  } = req.body

  try {
    await vehicleService.exit({ ticketId })

    res.json(ticketId)
  } catch (err) {
        res.status(404).json({
            error: true,
            message: error
        });
    }
}


