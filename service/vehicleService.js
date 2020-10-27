const util = require('../module/util')

const parkingLotStackModel = require('../models/parking-models/parkingslot-stack-model');

/**
 * @param {Number} [param.vehicleSizeId=0]
 * @param {String} [param.plateNumber='']
 * @param {Number} [param.parkingLotId=0]
 * @returns {Ticket}
 */

async function getParkings(param){
  const {
    location, rank
  } = param

    // find all stacks 
  const parkingLotStacks = await parkingLotStackModel.findAll({}, null, {sort : '-rank_per_floor'})


  // find available slot
  const availableParkingLotStack = util.getNearestAvailableParkingLotStack(location, rank, parkingLotStacks)
  if (availableParkingLotStack === null) {
    throw new Error('no available parking stack')
  }
  // if there has slot available
  try {
    // get the nearest slot id
    const slotIds = JSON.parse(availableParkingLotStack.data)
    const nearestSlotId = slotIds.shift()

    // update stack (caching)
    await parkingLotStackModel.update({
      data: JSON.stringify(slotIds) // remaining slot ids
    }, {
      where: { id: availableParkingLotStack.id },
    })


  }catch(err){
    return err
  }
}
async function park (param) {
  const {
    plateNumber = '',
    parkingLotId = 0
  } = param

  // find all stacks 
const parkingLotStacks = await parkingLotStackModel.findAll({}, null, {sort : '-createdAt'})


  // find available slot
  const availableParkingLotStack = util.getNearestAvailableParkingLotStack(parkingLotId, parkingLotStacks)
  if (availableParkingLotStack === null) {
    throw new Error('no available slot')
  }

  // if there has slot available
  let transaction
  try {
    // get transaction
    transaction = await db.sequelize.transaction()

    // get the nearest slot id
    const slotIds = JSON.parse(availableParkingLotStack.data)
    const nearestSlotId = slotIds.shift()

    // update stack (caching)
    await parkingLotStackModel.update({
      data: JSON.stringify(slotIds) // remaining slot ids
    }, {
      where: { id: availableParkingLotStack.id },
      transaction
    })

    // update slot status
    await db.Slot.update({
      slot_status_id: constant.SLOT_STATUS.OCCUPIED
    }, {
      where: { id: nearestSlotId },
      transaction
    })

    // create ticket
    const ticketModel = await db.Ticket.create({
      plate_number: plateNumber,
      vehicle_size_id: vehicleSizeId,
      slot_id: nearestSlotId,
      ticket_status_id: constant.TICKET_STATUS.OPEN
    }, {
      transaction
    })

    // commit
    await transaction.commit()

    return ticketModel.dataValues
  } catch (err) {
    // Rollback transaction only if the transaction object is defined
    if (transaction) await transaction.rollback()
  }
}

/**
 * @param {Number} param.ticketId
 */
async function exit (param) {
  const { ticketId } = param

  const ticketModel = await db.Ticket.findOne({
    where: { id: ticketId }
  })
  // todo returns 404 instead
  if (!ticketModel) throw new Error('not found ticket id')
  const ticket = ticketModel.dataValues

  // if there has slot available
  let transaction
  try {
    // get transaction
    transaction = await db.sequelize.transaction()

    // change the ticket
    await db.Ticket.update({
      ticket_status_id: constant.TICKET_STATUS.CLOSE,
      exit_at: db.sequelize.literal('CURRENT_TIMESTAMP')
    }, {
      where: { id: ticket.id },
      transaction
    })

    // update slot status
    await db.Slot.update({
      slot_status_id: constant.SLOT_STATUS.UNOCCUPIED
    }, {
      where: { id: ticket.slot_id },
      transaction
    })

    // update parkingLotStack, current data
    const { dataValues: slot } = await db.Slot.findOne({
      where: { id: ticket.slot_id },
      transaction
    })
    const { dataValues: parkingLotStack } = await parkingLotStackModel.findOne({
      where: {
        parking_lot_id: slot.parking_lot_id,
        slot_size_id: slot.slot_size_id
      },
      transaction
    })
    // update parkingLotStack, update caching available slot ids
    // we can sort slot rank by its id
    const availableSlotIds = JSON.parse(parkingLotStack.data)
    availableSlotIds.push(slot.id)
    const sortedAvailableSlotIds = availableSlotIds.sort((a, b) => a - b) // asc (min => max)
    await db.ParkingLotStack.update({
      data: JSON.stringify(sortedAvailableSlotIds)
    }, {
      where: {
        id: parkingLotStack.id
      },
      transaction
    })

    // commit
    await transaction.commit()
  } catch (err) {
    // Rollback transaction only if the transaction object is defined
    if (transaction) await transaction.rollback()
  }
}

async function isStackFull(param){
  try{
    const {parkingLotId} = param
    const the_stack = await parkingLotStackModel.findById(parkingLotId);
    if(the_stack){
      return the_stack.full_status
    }

    throw new Error('Stack dosen\'t exist')   
  }
  catch (error) {
    return error
  }  
}

module.exports = {
  getParkings,
  isStackFull,
  park,
  exit
}
