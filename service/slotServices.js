const slotModel = require('../models/parking-models/parking-slot-model');
const statusModel = require('../models/parking-models/parking-slot-status-model');

/**
 * @param {String} param.name
 * @param {Number} param.rank integer number
 * @param {Object} param.nSlotsKey
 * @returns {ParkingLot}
 */

exports.createParkingSlots = async function  (stack_id, slots_per_floor) {
  try {
      let data = await statusModel.find({
        statusName: {
            $in: 'FREE' // [1,2,3]
        }
    });
    data = data[0]
    for (let index = 0; index < slots_per_floor; index++) {
       await slotModel.create({
            stack: stack_id, 
            status: data._id
        });
    }

  } catch (error) {

    throw new Error("Couldn't create parking slot")

  }
}
exports.removeSlots = async function  (stack_id, slots_per_floor) {
  try {
    for (let index = 0; index < slots_per_floor; index++) {
       await slotModel.remove({
            stack: stack_id
        });
    }

  } catch (error) {

    throw new Error("Couldn't delete parking slot")

  }
}

/**
 * @param {Object} [param={}]
 * @returns {ParkingLotStack[]}
 */
exports.getParkingSlots = async function  (req, res) {
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


