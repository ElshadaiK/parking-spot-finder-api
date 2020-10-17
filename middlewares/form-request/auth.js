const Joi = require('joi');


exports.authFormRequest = schemaName => async (req,res,next) => {
    let validationObjects = {
        loginUser: () => 
            Joi.object({
                email: Joi.string().required()
                    .email(),
            
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            }),
        createUser: () => 
            Joi.object({
                username: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
            
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            
                repeat_password: Joi.ref('password'),
            
                email: Joi.string().required()
                    .email(),
                
                phone_no : Joi.number().required()
                    .pattern(new RegExp('^(?:\+?\d{2}[ -]?\d{3}[ -]?\d{5}|\d{4})$'))
            }),
        forgetPassword: () => 
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
