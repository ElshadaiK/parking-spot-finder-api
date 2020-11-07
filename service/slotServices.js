const slotModel = require('../models/parking-models/parking-slot-model');
const statusModel = require('../models/parking-models/parking-slot-status-model');


const descriptions = ["North", "South", "East", "West", "North-eastern", "South-eastern", "North-western", "South-western"];   
exports.createParkingSlots = async function  (stack_id, slots_per_floor, floor_index) {
  try {
      let data = await statusModel.findOne({
        statusName: {
            $in: 'FREE' // [1,2,3]
        }
    });
    for (let index = 0; index < slots_per_floor; index++) {
      const alphabet = ((index % 36)+10).toString(36).toUpperCase()
       await slotModel.create({
            stack: stack_id, 
            status: data._id,
            description: `Floor ${floor_index}, ${descriptions[index % descriptions.length]}, Parking Slot ${alphabet}`
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
exports.updateSlotsDescription = async function (stack_id, floor_index){
  const the_slots = await slotModel.find({
    stack: stack_id
  });
  if(!the_slots) throw new Error("Slots not found with the stack Id")
  the_slots.forEach(async (slot, index) => {
    const alphabet = ((index % 36)+10).toString(36).toUpperCase()
    await slotModel.updateOne(
      {_id: slot._id},
      {
        description: `Floor ${floor_index}, ${descriptions[index % descriptions.length]}, Parking Slot ${alphabet}`
      }
      );
  });
  return "Updated successfully"
}
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


