const parkingLotService = require('../service/parkingLotStackService');


exports.getParkingLotStacks = async (req, res, next) => {

  try {
    const parkingLotStacks = await parkingLotService.getParkingLotStacks()

    res.json(parkingLotStacks);
  } catch (err) {
        res.status(404).json({
            error: true,
            message: error
    })
  }
}
