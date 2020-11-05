const Joi = require('joi');

exports.vehicleFormRequest = schemaName => async (req,res,next) => {
    let validationObjects = {
        getNearest: () => 
            Joi.object({
                latitude: Joi.number().required(),
                longitude: Joi.number().required()
            }),
        getAvailable: () => 
            Joi.object({
                parkingLotId: Joi.string().required()
            }),
        park: () => 
            Joi.object({
                parkingLotId: Joi.string().required(),
                parkingSlotId: Joi.string().required(),
                plate_number: Joi.number()
            }),
        exit: () => 
            Joi.object({
                ticketId: Joi.string().required(),
            }),
    }
    try {
       const {error } =  validationObjects[schemaName]().validate(req.body)
       if(!error) {
           return next();
       }
       throw new Error(error)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}
