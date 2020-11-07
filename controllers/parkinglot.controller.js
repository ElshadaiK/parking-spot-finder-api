const parkingLotService = require('../service/parkingLotStackService');
const slotService = require('../service/slotServices')


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
exports.updateSlots = async function (req, res, next){
  const {stack_id} = req.body
  const result = await slotService.updateSlotsDescription(stack_id);
  res.json(result)
  next()
}