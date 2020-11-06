const util = require('../module/util')

const parkingLotStackModel = require('../models/parking-models/parkingslot-stack-model');
const ticketModel = require('../models/parking-models/ticket-model');
const parkingslotStackModel = require('../models/parking-models/parkingslot-stack-model');
const slotModel = require('../models/parking-models/parking-slot-model');
const statusModel = require('../models/parking-models/parking-slot-status-model')

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
              coordinates : [longitude, latitude]
            },
          }
        }
      }
    ).populate({path: "company", select: "name-_id"})
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
    parkingSlotId,
    price
  } = param
  let data = await statusModel.find({
    statusName: {
        $in: 'OCCUPIED' // [1,2,3]
    }
});
const ticket = await ticketModel.create({
  plate_number, 
  slot_id: parkingSlotId,
  ticket_status: "occupied", 
  park_at: Date.now(),
  exit_at: "",
  price_per_hour : price
});
  const updatedSlot = await slotModel.findByIdAndUpdate(parkingSlotId, {status : data._id, occupied_by: ticket._id})


  return ticket
  } 
/**
 * @param {String} [param.plate_number]
 * @param {Number} [param.parking_Stack_Id]
 * @param {Number} [param.parking_Lot_Id]
 * @returns {Ticket}
 */
exports.reserve = async function (param) {
  const {
    plate_number,
    parkingSlotId,
    price
  } = param
  let data = await statusModel.find({
    statusName: {
        $in: 'PENDING' // [1,2,3]
    }
});
const ticket = await ticketModel.create({
  plate_number, 
  slot_id: parkingSlotId,
  ticket_status: "reserved", 
  park_at: Date.now(),
  exit_at: "",
  price_per_hour : price
});
  const updatedSlot = await slotModel.findByIdAndUpdate(parkingSlotId, {status : data._id, occupied_by: ticket._id})


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
  let data = await statusModel.find({
    statusName: {
        $in: 'FREE' // [1,2,3]
    }
});
data = data[0]

  const the_stack = await slotModel.find({
    stack: parkingLotId, status: data._id
  }).populate({path: 'status', select: 'statusName-_id' });
  return the_stack

  } 

exports.getOccupied = async function (param) {
  const {
    parkingLotId
  } = param
  let data = await statusModel.find({
    statusName: {
        $in: 'OCCUPIED' // [1,2,3]
    }
});

  const the_stack = await slotModel.find({
    stack: parkingLotId, status: data
  }).populate('status', 'statusName' );
  return the_stack

  } 
/**
 * @param {Number} param.ticketId
 */
exports.exit = async function  (param) {
  const { the_ticket } = param
  const exit_time = Date.now()
  const price_calculated = ((exit_time - the_ticket.park_at)/3600000) * the_ticket.price_per_hour;
  const parkingSlotId = the_ticket.slot_id
  const the_updated_ticket = await ticketModel.findByIdAndUpdate({_id: the_ticket._id},
    {'$set': {exit_at: Date.now(), total_price: price_calculated, ticket_status: "exited"}},
    {new: true}
    );

  
    // update slot status
    let data = await statusModel.find({
      statusName: {
          $in: 'FREE' // [1,2,3]
      }
  });
  const updatedSlot = await slotModel.findByIdAndUpdate(parkingSlotId, {status : data._id, occupied_by: null})

    return the_updated_ticket
}

exports.isStackFull = async function (the_stack){
  return the_stack.full_status 
}
exports.isSlotEmpty = async function (parkingSlotId, the_stack){
    const the_slot = await slotModel.findById(parkingSlotId)
    let data = await statusModel.findById(the_slot.status);
    return ["FREE"] == data.statusName[0]
}
exports.emptyTheStack = async function(param){
  const {
    parkingLotId,
  } = param

  const updatedStack = await parkingLotStackModel.findByIdAndUpdate({_id: parkingLotId},
    {'$set': {full_status: false}},
    {new: true}
    );
    let data = await statusModel.find({
      statusName: {
          $in: 'FREE' 
      }
  });
  data = data[0]
  const updatedSlots = await slotModel.updateMany({stack: parkingLotId}, {status: data._id})
    return updatedStack
}

exports.checkTheStack = async function(param){
  const {
      parkingLotId,
      availables
  } = param
  let status;
  if(availables == []) status = true
  else status = false
  
  const updated = await parkingLotStackModel.findByIdAndUpdate(parkingLotId,
    {'$set': {full_status: status}},
    {new: true}
    );
    return updated
  
}