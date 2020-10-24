const parkingslotModel = require('../models/parking-models/slot-model');

/**
 * @param {String} param.name
 * @param {Number} param.rank integer number
 * @param {Object} param.nSlotsKey
 * @returns {ParkingLot}
 */

exports.createParkingSlot = async function  (stack) {
  try {
      await parkingslotModel.create({stack: stack})
  } catch (error) {

    //   res.status(400).json({
    //       error: true,
    //       message: error
    //   })
      
  }
}

/**
 * @param {Object} [param={}]
 * @returns {ParkingLotStack[]}
 */
exports.getParkingLotSlot = async function  (req, res) {
    try {
        const stacks = await parkingslotModel.find({}, null, {sort : '-createdAt'})
        res.json(stacks)

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}
