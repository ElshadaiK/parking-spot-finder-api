const { pick } = require('lodash')
const officerModel = require('../models/officer-model');
const roleModel = require('../models/role-model');


exports.findAllOfficers = async function (req, res){

    try {

        let sort = {}
        if(req.query.sort) {
            sort[req.query.sort] = req.query.asc ? 1 :-1 
        }

        let query = {}

        if(req.query.filter) {
            let filter = JSON.parse(req.query.filter);
            query = pick(filter, ['username', 'active']) 
            
        }
        
        const options = {
            sort: Object.values(sort).length > 0 ? sort: {
                'created_at': -1
            },
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            populate: { path: 'roles', populate: {path: 'permissions'}}
        }
        const officer = await officerModel.paginate(query,options)

        res.json(officer)

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}
exports.findOfficerById = async function(req, res){
    try {
        const officer = await officerModel.findById(req.params.id)
        res.json(officer)
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error
        })
    }
}
exports.insertOfficer = async function (req, res){
    try {
        let data = await roleModel.find({
            name: {
                $in: 'parking_officer' // [1,2,3]
            }
        })
        const officer = await officerModel.create({...req.body, roles: data})

        res.json(officer)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
    
}
exports.updateOfficer = async function(req, res){
    
    try {
        let officer = await officerModel.findById(req.params.id)
        if(officer) {
            officer = await officerModel.updateOne({_id: officer._id}, req.body)
            return res.json(officer)
        }

        throw new Error('Officer dosen\'t exist')
       

        
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
}

exports.deleteOfficer = async function(req, res){
    try {
        let officer = await officerModel.findById(req.params.id)
        if(officer) {
            await officerModel.remove({
                _id: officer._id
            })
            return res.json(officer)
        }
        throw new Error('Officer doesn\'t exist')

    } 
     catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}
exports.findOfficerByName = async function(req, res){
    try {
        const officer = await officerModel.find({fullName: {$regex:`^${req.params.name}`, $options:'i'}})
        res.json(officer)
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error
        })
    }

}