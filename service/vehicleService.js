const util = require('../module/util')

const parkingLotStackModel = require('../models/parking-models/parkingslot-stack-model');
const ticketModel = require('../models/parking-models/ticket-model');
const parkingslotStackModel = require('../models/parking-models/parkingslot-stack-model');

/**
 * @param {Array} [param.location='']
 * @returns {Stacks}
 */

exports.getParkings = async function (param){
  const {
    latitude, longitude
  } = param
  
    let theNearest = await parkingLotStackModel.find(
      {
        location : {
          $near: {
            $geometry: {
              type: "Point",
              coordinates : [latitude, longitude]
            },
          }
        }
      }
    ).exec()
    return theNearest 
}
/**
 * @param {String} [param.plate_number]
 * @param {Number} [param.parking_Stack_Id]
 * @param {Number} [param.parking_Lot_Id]
 * @returns {Ticket}
 */
exports.park = async function (param) {
  const {
    plate_number,
    parkingLotId,
    parkingSlotId
  } = param
  const the_stack = await parkingLotStackModel.findById(parkingLotId);

  const ticket = (the_stack.slots[parkingSlotId])
  if(!ticket){
    throw new Error("parking slot doesn't exist")
  }
  ticket.open_status = false;
  ticket.occupied_by = plate_number;
  ticket.start_time = Date.now();
  const filter = { _id : the_stack._id }
 
  await the_stack.updateOne({
    index : parkingSlotId,
    // slots : { $elemMatch: { index: parkingLotId } }
  }, 
  {'$set': {
    'slots.$.open_status': false,
    'slots.$.occupied_by': plate_number,
    'slots.$.start_time': Date.now(),
}}
)
 const updated = await parkingslotStackModel.findByIdAndUpdate(
    the_stack._id, 
    the_stack
    
    )

  return ticket
  } 
  /**
 * @param {Number} [param.parking_Stack_Id]
 * @returns {Parking Slots}
 */
exports.getAvailable = async function (param) {
  const {
    parkingLotId
  } = param

  const the_stack = await parkingLotStackModel.findById(parkingLotId);
  const the_slots =  the_stack.slots;
  let the_array =[]
  the_slots.forEach(slot => {
    let slotToCheck = (slot);
    if(slotToCheck.open_status) 
      {the_array.push(slotToCheck)}
  });
  return the_array

  } 

/**
 * @param {Number} param.ticketId
 */
exports.exit = async function  (param) {
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

exports.isStackFull = async function (the_stack){
  return the_stack.full_status 
}
exports.isSlotEmpty = async function (parkingSlotId, the_stack){
    const the_slot = ((the_stack.slots)[parkingSlotId])
    return the_slot.open_status
}