const Joi = require('joi');


exports.validate = schemaName => async (req,res,next) => {
    let validationObjects = {
        parkUser: () => 
            Joi.object().keys({
                vehicleSizeId: Joi.number()
                    .integer()
                    .required(),
                plateNumber: Joi.string()
                    .required(),
                parkingLotId: Joi.number() 
                    .integer()
                    .required()
            }),
        unParkUser : () =>
            Joi.object().keys({
                ticketId: Joi.number()
                    .integer()
                    .required()
            }),
        ticketUser : () => 
            Joi.object().keys({
                vehicleSizeId: Joi.number()
                    .integer()
                    .min(0)
                    .required()
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
