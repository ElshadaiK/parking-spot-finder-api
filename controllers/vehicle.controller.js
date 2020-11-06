const vehicleService = require('../service/vehicleService')
const parkingLotStackModel = require('../models/parking-models/parkingslot-stack-model')
const ticketModel = require('../models/parking-models/ticket-model')
const parkingSlotModel = require('../models/parking-models/parking-slot-model')

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
  let { parkingLotId } = req.body
  let companyId = user.data.company ? user.data.company : user.data._id

  if(!parkingLotId){
    parkingLotId = await parkingLotStackModel.findOne({
      company: {
          $in: companyId // [1,2,3]
      }
    })
  }

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
exports.getOccupiedSlots = async(req, res, next) => {
  const { user } = req
  let { parkingLotId } = req.body
  let companyId = user.data.company ? user.data.company : user.data._id

  if(!parkingLotId){
    parkingLotId = await parkingLotStackModel.findOne({
      company: {
          $in: companyId // [1,2,3]
      }
    })
  }

  try {
    if(user){
      const the_stack = await parkingLotStackModel.findById(parkingLotId);
      if(!the_stack){
        throw new Error('Stack dosen\'t exist')   
      }
      const availables = await vehicleService.getOccupied({
        parkingLotId
      });
  
      res.json(availables);
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
exports.park = async (req, res, next) => {
  const { user } = req
  let { parkingLotId } = req.body
  const { parkingSlotId } = req.body
  let plate_number = user.data.plate_number
  if(!plate_number) {
    plate_number = req.body.plate_number
  }

  if(user.data.company){
    parkingLotId = await parkingLotStackModel.findOne({
        company: {
            $in: user.data.company // [1,2,3]
        }
    })
  }

  try {
    if(user){
      const the_stack = await parkingLotStackModel.findById(parkingLotId);
      const price = the_stack.price
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
            parkingSlotId,
            price
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

exports.exitTicket = async (req, res, next) => {
  const {
    ticketId
  } = req.body

  try {
    const the_ticket = await ticketModel.findById(ticketId);
    
    if (!the_ticket) throw new Error('not found ticket id')
    if(the_ticket.ticket_status == "occupied"){
      const the_slot = await parkingSlotModel.findById(the_ticket.slot_id);
      const the_stack_id = the_slot.stack[0];
        
    
      const ticketLeave = await vehicleService.exitTicket({the_ticket})
      const availables = await vehicleService.getAvailable({
        the_stack_id
      });

      await vehicleService.checkTheStack(the_slot._id, availables)

      res.json(ticketLeave);
      next();
    }
    else{
      throw new Error("Ticket already processed")
    }

  } catch (err) {
        res.status(404).json({
            error: true,
            message: err.message
        });
    }
}
exports.exitPlate = async (req, res, next) => {
  const {user} = req
  const {
    plate_no
  } = req.body

  try {
    const companyId = user.data.company
    const the_stacks = await parkingLotStackModel.find({
      company: companyId
    });
    const the_slots = await parkingSlotModel.find({
      stack: {
        $in: the_stacks // [1,2,3]
      } 
    });
    const the_ticket = await ticketModel.findOne({
      plate_number: plate_no,
      ticket_status: "occupied",
      slot_id: {
        $in: the_slots // [1,2,3]
      } 
    });
    
    if (!the_ticket) throw new Error('ticket not found')
    const the_slot = await parkingSlotModel.findById(the_ticket.slot_id);
      const the_stack_id = the_slot.stack[0];
        
    
      const ticketLeave = await vehicleService.exitTicket({the_ticket})
      const availables = await vehicleService.getAvailable({
        the_stack_id
      });

      await vehicleService.checkTheStack(the_slot._id, availables)

      res.json(ticketLeave);
      next();
    
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

          // Updating all tickets when cleared

          const the_slots = await parkingSlotModel.find({
            stack: {
              $in: the_stack // [1,2,3]
            } 
          });
          const updatedTickets = await ticketModel.find(
            {slot_id: {
                $in: the_slots // [1,2,3]
              } 
            });
          for (let index = 0; index < updatedTickets.length; index++) {
            const the_ticket = updatedTickets[index]
            const ticketLeave = await vehicleService.exitTicket({the_ticket})
      
          }
  
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
exports.reserve = async(req, res, next) => {
  const { user } = req
  const { parkingLotId } = req.body
  const { parkingSlotId } = req.body
  const plate_number = user.data.plate_number

  try {
    if(user){
      const the_stack = await parkingLotStackModel.findById(parkingLotId);
      const price = the_stack.price
      if(!the_stack){
        throw new Error('Stack dosen\'t exist')   
      }
      const fullStatus = await vehicleService.isStackFull(the_stack)
      if(!fullStatus){

        if(parkingSlotId){

          const isSlotEmpty = await vehicleService.isSlotEmpty(parkingSlotId, the_stack);

          if(!isSlotEmpty){ throw new Error("Slot already occupied")}

          const ticket = await vehicleService.reserve({
            plate_number,
            parkingSlotId,
            price
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
exports.getAllSlots = async(req, res, next) => {
  const { user } = req
  let companyId = user.data.company ? user.data.company : user.data._id

  const parkingLotId = await parkingLotStackModel.find({
      company: {
          $in: companyId // [1,2,3]
      }
    })

  try {
    if(user){
      const the_stack = await parkingLotStackModel.find({_id: {$in: parkingLotId}});
      if(!the_stack){
        throw new Error('Stack dosen\'t exist')   
      }
      const availables = await vehicleService.getAllSlots({
            parkingLotId
          });
      
          res.json(availables[0]);
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
exports.getActiveTickets = async(req, res, next) => {
  const {user} = req
  const {
    plate_no
  } = req.body

  try {
    const companyId = user.data.company
    const the_stacks = await parkingLotStackModel.find({
      company: companyId
    });
    const the_slots = await parkingSlotModel.find({
      stack: {
        $in: the_stacks // [1,2,3]
      } 
    });
    const the_tickets = await ticketModel.find({
      ticket_status: "occupied",
      slot_id: {
        $in: the_slots // [1,2,3]
      } 
    });
    
    
      res.json(the_tickets);
      next();
    
  } catch (err) {
        res.status(404).json({
            error: true,
            message: err.message
        });
    }
}

