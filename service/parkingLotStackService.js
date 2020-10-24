const parkingLotStackModel = require('../models/parking-models/parkingslot-stack-model');

/**
 * @param {String} param.name
 * @param {Number} param.rank integer number
 * @param {Object} param.nSlotsKey
 * @returns {ParkingLot}
 */

exports.createParkingLotStacks = async function  (id, slots_per_floor, floor, rank_per_floor) {
  try {
      const parkingLotStack = await parkingLotStackModel.create({company: id, parking_slots: slots_per_floor, floor: floor, parking_lot_rank: rank_per_floor})
      res.json(parkingLotStack)
      return (parkingLotStack._id)
  } catch (error) {

      res.status(400).json({
          error: true,
          message: error
      })

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


