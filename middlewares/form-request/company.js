const Joi = require('joi');


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
                rank_per_floor: Joi.number().min(0).max(5)
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
                username: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
            
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            
                repeat_password: Joi.ref('password'),
            
                working_date: Joi.array(),
                works_from: Joi.number(),
                works_to: Joi.number()
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
