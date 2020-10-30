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
              coordinates : [longitude, latitude]
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

  const the_chosen_slot = (the_stack.slots[parkingSlotId])
  if(!the_chosen_slot){
    throw new Error("parking slot doesn't exist")
  }
  the_chosen_slot.open_status = false;
  the_chosen_slot.occupied_by = plate_number;
  the_chosen_slot.start_time = Date.now();
 
  await the_stack.updateOne({
    index : parkingSlotId,
  }, 
  {'$set': {
    'slots.$.open_status': false,
    'slots.$.occupied_by': plate_number,
    'slots.$.start_time': Date.now(),
}}
)
 await parkingslotStackModel.findByIdAndUpdate(
    the_stack._id, 
    the_stack
    )
const ticket = await ticketModel.create({
  plate_number, 
  slot_id: parkingSlotId, 
  stack_id: parkingLotId,
  ticket_status: "occupied", 
  park_at: the_chosen_slot.start_time,
  exit_at: "",
  price_per_hour : the_stack.price
})
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

  const the_stack = await parkingLotStackModel.findById({_id: parkingLotId});
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
  const { the_ticket } = param
  const exit_time = Date.now()
  const price_calculated = ((exit_time - the_ticket.park_at)/3600000) * the_ticket.price_per_hour;
  const the_stack_id = the_ticket.stack_id;
  const the_slot_id = the_ticket.slot_id
  const the_updated_ticket = await ticketModel.findByIdAndUpdate({_id: the_ticket._id},
    {'$set': {exit_at: Date.now(), total_price: price_calculated}},
    {new: true}
    );

  
    // update slot status

  const the_stack = await parkingLotStackModel.findById(the_stack_id);
 
  await the_stack.updateOne({
    index : the_slot_id,
  }, 
  {'$set': {
    'slots.$.open_status': true,
    'slots.$.occupied_by': "",
    'slots.$.start_time': "",
}}
);
console.log(the_stack)
const updated= await parkingslotStackModel.findByIdAndUpdate(
    the_stack._id, 
    the_stack
    )

    return updated
}

exports.isStackFull = async function (the_stack){
  return the_stack.full_status 
}
exports.isSlotEmpty = async function (parkingSlotId, the_stack){
    const the_slot = ((the_stack.slots)[parkingSlotId])
    return the_slot.open_status
}
exports.emptyTheStack = async function(param){
  const {
    parkingLotId,
  } = param

const updated = await parkingLotStackModel.findByIdAndUpdate({_id: parkingLotId},
  {'$set': {full_status: false, 'slots.$[].open_status': true, 'slots.$[].occupied_by': "", 'slots.$[].start_time': ""}},
  {new: true}
  );
  return updated
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