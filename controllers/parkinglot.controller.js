const parkingLotService = require('../service/parkingLotStackService');
const slotService = require('../service/slotServices')
const stackModel = require('../models/parking-models/parkingslot-stack-model')

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
  try{
    const the_stack = await stackModel.findone({_id: stack_id})
    if(!the_stack) throw new Error("Stack not found")
    const result = await slotService.updateSlotsDescription(stack_id, the_stack.floor);
    res.json(result)
    next()
  }
    catch (err) {
      res.status(404).json({
          error: true,
          message: err.message
      });
}
}