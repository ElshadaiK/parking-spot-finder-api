const { pick } = require('lodash')
const companyModel = require('../models/company-model');
const roleModel = require('../models/role-model');


exports.findAllCompanies = async function (req, res){
    try {

        let sort = {}
        if(req.query.sort) {
            sort[req.query.sort] = req.query.asc ? 1 :-1 
        }

        let query = {}

        if(req.query.filter) {
            let filter = JSON.parse(req.query.filter);
            query = pick(filter, ['name', 'active']) 
            
        }
        
        const options = {
            sort: Object.values(sort).length > 0 ? sort: {
                'created_at': -1
            },
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            populate: { path: 'roles', populate: {path: 'permissions'}}
        }
        const company = await companyModel.paginate(query,options)

        res.json(company)

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}
exports.findCompanyById = async function(req, res){
    try {
        const company = await companyModel.findById(req.params.id)
        res.json(company)
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error
        })
    }
}
exports.insertCompany = async function (req, res){
    try {
        let data = await roleModel.find({
            name: {
                $in: 'company' // [1,2,3]
            }
        });
        let companyCoordinate = [req.body.longitude, req.body.latitude]
        const company = await companyModel.create({...req.body, roles: data,
            location : {
                coordinates: companyCoordinate
              }
        })
        const company_info = [company._id, company.slots_per_floor, company.floor, company.rank_per_floor, company.location, company.charge]
        res.json(company)
        return company_info
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
    
}
exports.updateACompany = async function(req, res){
    try {
        const { user} = req
        let company = await companyModel.findById(req.params.id)
        if(company) {
            company = await companyModel.updateOne({_id: company._id}, req.body)
            return res.json(company)
        }

        throw new Error('Company dosen\'t exist')
       

        
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
}

exports.deleteACompany = async function(req, res){
    try {
        let company = await companyModel.findById(req.params.id)
        if(company) {
            await companyModel.remove({
                _id: company._id
            })
            return res.json(company)
        }
        throw new Error('Company doesn\'t exist')

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}
exports.findCompanyByName = async function(req, res){
    try {
        const company = await companyModel.find({fullName: {$regex:`^${req.params.name}`, $options:'i'}})
        res.json(company)
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error
        })
    }

}