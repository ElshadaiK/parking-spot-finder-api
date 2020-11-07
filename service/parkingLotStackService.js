const parkingLotStackModel = require('../models/parking-models/parkingslot-stack-model');
const slotService = require('./slotServices')
/**
 * @param {String} param.name
 * @param {Number} param.rank integer number
 * @param {Object} param.nSlotsKey
 * @returns {ParkingLot}
 */

exports.createParkingLotStacks = async function  (id, slots_per_floor, floors, rank_per_floor, Clocation, Cprice, res, floor_index) {
  try {
    let newStack = await parkingLotStackModel.create({company: id, 
        parking_slots: slots_per_floor, 
        location: Clocation,
        floor: floor_index, 
        parking_lot_rank: rank_per_floor, 
        slots: slots_per_floor,
        price: Cprice    
      });
      await slotService.createParkingSlots(newStack._id, slots_per_floor, floor_index)

  } catch (error) {

    throw new Error("Couldn't create parking lot stack")

  }
}

/**
 * @param {Object} [param={}]
 * @returns {ParkingLotStack[]}
 */
exports.getParkingLotStacks = async function  (req, res) {
      try {
        const stacks = await parkingLotStackModel.find({}, null, {sort : '-createdAt'})
        res.json(stacks)

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}

exports.deleteParkingLotStacks = async function (id, slots_per_floor, floors, rank_per_floor, Clocation, Cprice, res, floor_index){
  try {
    let deletedStack = await parkingLotStackModel.remove({
        company: id, 
        floor: floor_index,    
      });
      await slotService.removeSlots(deletedStack._id, slots_per_floor)

  } catch (error) {

    throw new Error("Couldn't delete parking lot stack")

  }
}

