const vehicleService = require('../service/vehicleService')

exports.getParkings = async (req, res, next) => {
  const { user } = req
  const { location, rank } = req.body

  try {
    if(user){
      const parkingLotsNearId = await vehicleService.getParkings({
        location, rank
      })
      res.json(parkingLotsNearId);
      return next()
    }
    throw new Error('You have to login first') 
  }
    catch (err) {
      res.status(404).json({
          error: true,
          message: err
      });
}
}

exports.park = async (req, res, next) => {
  const { user } = req
  const { parkingLotId } = req.body
  plate_number = user.data.plate_number

  try {
    if(user){
      const fullStatus = await vehicleService.isStackFull(parkingLotId)

        if(!fullStatus){
          const ticket = await vehicleService.park({
            plateNumber,
            parkingLotId
          })
      
          res.json(ticket);
          next();
        }
        else{
          throw new Error("Parking Stack already full")
        }

      }
      
    throw new Error('You have to login first') 
  }
    catch (err) {
      res.status(404).json({
          error: true,
          message: error
      });
}
}

exports.exit = async (req, res, next) => {
  const {
    ticketId
  } = req.body

  try {
    await vehicleService.exit({ ticketId })

    res.json(ticketId)
  } catch (err) {
        res.status(404).json({
            error: true,
            message: error
        });
    }
}


