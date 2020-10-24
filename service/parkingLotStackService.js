const parkingLotStackModel = require('../models/parking-models/parkingslot-stack-model');

/**
 * @param {String} param.name
 * @param {Number} param.rank integer number
 * @param {Object} param.nSlotsKey
 * @returns {ParkingLot}
 */

exports.createParkingLotStacks = async function  (id, slots_per_floor, floors, rank_per_floor, res, floor_index) {
  try {
    const parkingSlots  = []
        for (let i = 0; i < 5; i++) {
            let slot = JSON.stringify({
                open_status : true,
                occupied_by : ""
            })
            parkingSlots.push(slot)
        } 
      await parkingLotStackModel.create({company: id, parking_slots: 
        slots_per_floor, 
        floor: floor_index, 
        parking_lot_rank: rank_per_floor, 
        slots: parkingSlots})

    //   res.json(parkingLotStack)
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


