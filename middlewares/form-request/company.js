const Joi = require('joi');
const Joi_Num = Joi.extend(require('joi-phone-number'));

exports.companyFormRequest = schemaName => async (req,res,next) => {
    let validationObjects = {
        createCompany: () => 
            Joi.object({
                name: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
            
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            
                repeat_password: Joi.ref('password'),
            
                email: Joi.string()
                    .email(),
                charge: Joi.number(),
                opens_at: Joi.number(),
                closes_at: Joi.number(),
                slots_per_floor: Joi.number(),
                rank_per_floor: Joi.number().min(0).max(5),
                floor: Joi.number().min(1).max(10),
                latitude: Joi.number().min(-90).max(90).required(),
                longitude: Joi.number().min(-180).max(180).required()
            }),
        updateCompany: () => 
            Joi.object({
                email: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
            }),
        createOfficer: () => 
            Joi.object({
                name: Joi.string()
                    .min(3)
                    .max(30)
                    .required(),
            
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            
                repeat_password: Joi.ref('password'),
                phone_no : Joi_Num.string().phoneNumber().required(),
            
            }),
        updateOfficer: () => 
            Joi.object({
                email: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
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
