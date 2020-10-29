const vehicleService = require('../service/vehicleService')
const parkingLotStackModel = require('../models/parking-models/parkingslot-stack-model')
const ticketModel = require('../models/parking-models/ticket-model')

exports.getParkingsNear = async (req, res, next) => {
  const { user } = req
  const { latitude, longitude } = req.body

  try {
    if(user){
      let nearestStacks = await vehicleService.getParkings({
        latitude, longitude
      })
      res.json(nearestStacks);
      return next()
    }
    else{
      throw new Error('You have to login first') 
    }
  }
    catch (err) {
      res.status(404).json({
          error: true,
          message: err
      });
}
}
exports.getAvailableSlots = async(req, res, next) => {
  const { user } = req
  const { parkingLotId } = req.body

  try {
    if(user){
      const the_stack = await parkingLotStackModel.findById(parkingLotId);
      if(!the_stack){
        throw new Error('Stack dosen\'t exist')   
      }
      const fullStatus = await vehicleService.isStackFull(the_stack)
      if(!fullStatus){
          const availables = await vehicleService.getAvailable({
            parkingLotId
          });
      
          res.json(availables);
          next();
        }
        else{
          throw new Error("Parking Stack already full")
        }
      }
      else{
        throw new Error('You have to login first')
      }
  }
    catch (err) {
      res.status(404).json({
          error: true,
          message: err.message
      });
}
}
exports.park = async (req, res, next) => {
  const { user } = req
  const { parkingLotId } = req.body
  const { parkingSlotId } = req.body
  const plate_number = user.data.plate_number

  try {
    if(user){
      const the_stack = await parkingLotStackModel.findById(parkingLotId);
      if(!the_stack){
        throw new Error('Stack dosen\'t exist')   
      }
      const fullStatus = await vehicleService.isStackFull(the_stack)
      if(!fullStatus){

        if(parkingSlotId){

          const isSlotEmpty = await vehicleService.isSlotEmpty(parkingSlotId, the_stack);

          if(!isSlotEmpty){ throw new Error("Slot already occupied")}

          const ticket = await vehicleService.park({
            plate_number,
            parkingLotId,
            parkingSlotId
          });
          const availables = await vehicleService.getAvailable({
            parkingLotId
          });

          await vehicleService.checkTheStack(parkingLotId, availables)
      
          res.json(ticket);
          next();
        }
        else{
          // pick slot
          throw new Error("Pick your slot")
        }
      }
          
      else{
        throw new Error("Parking Stack already full")
      }
    }
    else{

      throw new Error('You have to login first') 
    }
  }
    catch (err) {
      res.status(404).json({
          error: true,
          message: err.message
      });
}
}

exports.exit = async (req, res, next) => {
  const {
    ticketId
  } = req.body

  try {
    const the_ticket = await ticketModel.findById(ticketId);
    // todo returns 404 instead
    if (!the_ticket) throw new Error('not found ticket id')
  
    const ticketLeave = await vehicleService.exit({the_ticket})

    await vehicleService.checkTheStack(the_ticket.stack_id)
    res.json(ticketLeave)
  } catch (err) {
        res.status(404).json({
            error: true,
            message: err.message
        });
    }
}
exports.clear = async (req, res, next) => {
  const { user } = req
  const { parkingLotId } = req.body

  try {
    if(user){
      const the_stack = await parkingLotStackModel.findById(parkingLotId);
      if(!the_stack){
        throw new Error('Stack dosen\'t exist')   
      }
    
          const ticket = await vehicleService.emptyTheStack({
            parkingLotId
          });
      
          res.json(ticket);
          next();
       
    }
    else{

      throw new Error('You have to login first') 
    }
  }
    catch (err) {
      res.status(404).json({
          error: true,
          message: err.message
      });
}
}


