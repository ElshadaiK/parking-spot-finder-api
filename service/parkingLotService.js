const constant = require('../config/constant')
const parkingslotModel = require('../models/slot-model');
const parkingLotStackModel = require('../models/parkingslot-stack-model')

/**
 * @param {String} param.name
 * @param {Number} param.rank integer number
 * @param {Object} param.nSlotsKey
 * @returns {ParkingLot}
 */

// async function createParkingLot (param) {
//   const { name, rank, nSlotsKey, company } = param

//   // create parkingLot
//   const { dataValues: parkingLot } = await parkingslotModel.create({ name, rank, company })

//   // get all current slotSize
//   const result = await db.SlotSize.findAll({})
//   const slotSizeIds = result.map(item => item.dataValues.id)

//   for (const slotSizeId of slotSizeIds) {
//     const nSlots = nSlotsKey[slotSizeId]
//     const ranks = Array(nSlots).fill(null).map((_, i) => i + 1)

//     // create slots for each size
//     const slots = ranks.map(rank => {
//       return {
//         rank,
//         parking_lot_id: parkingLot.id,
//         slot_size_id: slotSizeId,
//         slot_status_id: constant.SLOT_STATUS.UNOCCUPIED
//       }
//     })
//     const models = await db.Slot.bulkCreate(slots, { returning: true }) // Sequelize.Model
//     const slotIds = models.map(item => item.dataValues.id)

//     // create parkingSlotStack for caching
//     const parkingLotStack = {
//       parking_lot_rank: parkingLot.rank,
//       parking_lot_id: parkingLot.id,
//       slot_size_id: slotSizeId,
//       data: JSON.stringify(slotIds)
//     }
//     await db.ParkingLotStack.create(parkingLotStack)
//   }

//   return parkingLot
// }

/**
 * @param {Object} [param={}]
 * @returns {ParkingLotStack[]}
 */
async function getParkingLotStacks (param = {}) {
  const parkingLotStackModels = await parkingLotStackModel.findAll(param)
  const parkingLotStacks = (parkingLotStackModels.length > 0)
    ? parkingLotStackModels.map(item => item.dataValues)
    : []

  return parkingLotStacks
}

module.exports = {
  // createParkingLot,
  getParkingLotStacks
}
