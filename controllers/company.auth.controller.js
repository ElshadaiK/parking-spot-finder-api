var jwt = require('jsonwebtoken');
const Joi = require('joi');

const { jwt_key } = require('../config/vars')
const companyModel = require('../models/company-model')


exports.login = async (req, res) => {

    try {
        const company = await companyModel.findOne({
            email: req.body.email
        });

        if(company && await company.verifyPassword(req.body.password)){
            let permissions =  company._doc.roles.reduce((prev, next) => {
                return [...prev, ...next.permissions.map(permission => permission.name)]
            },[])
            company._doc.permissions = Array.from(new Set([...company._doc.permissions.map(v => v.name), ...permissions ]))

            company._doc.roles = company._doc.roles.map(role => role.name)
           return res.json({
               ...company._doc,
               token: jwt.sign({data: company._doc, exp: Math.floor(Date.now() / 1000) + (60 * 60),}, jwt_key, { algorithm: 'HS256' })
            })
        }

       throw new Error("Username/password not found")

    } catch (error) {
        
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
    
}

exports.signup = async (req, res) => {

    try {
        const company = await companyModel.create(req.body)
        res.json(company)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}

exports.logout = async (req, res) => {
    try {

        const company = await companyModel.create(req.body)
        // clean up
        res.json(company)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }

}

