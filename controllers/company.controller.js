const { pick } = require('lodash')

const companyModel = require('../models/company-model');

const officerModel = require('../models/officer-model');

// Companies' CRUD
exports.AllProfiles = async (req, res) => {

    try {

        let sort = {}
        if(req.query.sort) {
            sort[req.query.sort] = req.query.asc ? 1 :-1 
        }

        let query = {}

        if(req.query.filter) {
            let filter = JSON.parse(req.query.filter);
            query = pick(filter, ['username', 'email', 'active']) 
            
        }
        
        const options = {
            sort: Object.values(sort).length > 0 ? sort: {
                'created_at': -1
            },
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            // populate: { path: 'roles', populate: {path: 'permissions'}}
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

exports.retriveProfile = async (req, res) => {

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

exports.createProfile = async (req, res) => {
    try {

        const company = await companyModel.create(req.body)

        res.json(company)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }

}

exports.updateProfile = async (req, res) => {

    try {
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

exports.removeProfile = async (req, res) => {
    try {
        let company = await companyModel.findById(req.params.id)
        if(company) {
            await companyModel.remove({
                _id: company._id
            })
            return res.json(company)
        }
        throw new Error('Company doesn\t exist')

    } catch (error) {
        
    }
}

// Officers' CRUD

exports.AllOfficers = async (req, res) => {

    try {

        let sort = {}
        if(req.query.sort) {
            sort[req.query.sort] = req.query.asc ? 1 :-1 
        }

        let query = {}

        if(req.query.filter) {
            let filter = JSON.parse(req.query.filter);
            query = pick(filter, ['username', 'email', 'active']) 
            
        }
        
        const options = {
            sort: Object.values(sort).length > 0 ? sort: {
                'created_at': -1
            },
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            // populate: { path: 'roles', populate: {path: 'permissions'}}
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

exports.retriveOfficer = async (req, res) => {

    try {
        console.log(req.params);
        const officer = await officerModel.findById(req.params.id)
        res.json(officer)
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error
        })
    }

}

exports.createOfficer = async (req, res) => {
    try {

        const officer = await officerModel.create(req.body)

        res.json(officer)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }

}

exports.updateOfficer = async (req, res) => {

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

exports.removeOfficer = async (req, res) => {
    try {
        let officer = await officerModel.findById(req.params.id)
        if(officer) {
            await officerModel.remove({
                _id: officer._id
            })
            return res.json(officer)
        }
        throw new Error('Officer doesn\'t exist')

    } catch (error) {
        
    }
}

// Slots' CRUD

exports.AllSlots = async (req, res) => {

    try {

        let sort = {}
        if(req.query.sort) {
            sort[req.query.sort] = req.query.asc ? 1 :-1 
        }

        let query = {}

        if(req.query.filter) {
            let filter = JSON.parse(req.query.filter);
            // Object.keys(filter).forEach(index => {
            //     if(typeof filter[index] !== 'string' || typeof filter[index] !== 'number') {
            //         delete filter[index]
            //     }
            // }) 
            query = pick(filter, ['username', 'email', 'active']) 
            
        }
        
        const options = {
            sort: Object.values(sort).length > 0 ? sort: {
                'created_at': -1
            },
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            populate: { path: 'roles', populate: {path: 'permissions'}}
        }
        const users = await userModel.paginate(query,options)

        res.json(users)

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
    
}

exports.retriveSlot = async (req, res) => {

    try {
        console.log(req.params);
        const user = await userModel.findById(req.params.id)
        res.json(user)
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error
        })
    }

}

exports.createSlot = async (req, res) => {
    try {

        const user = await userModel.create(req.body)

        res.json(user)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }

}

exports.updateSlot = async (req, res) => {

    try {
        let user = await userModel.findById(req.params.id)
        if(user) {
            user = await userModel.updateOne({_id: user._id}, req.body)
            return res.json(user)
        }

        throw new Error('Slot dosen\'t exist')
       

        
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
}

exports.removeSlot = async (req, res) => {
    try {
        let user = await userModel.findById(req.params.id)
        if(user) {
            await userModel.remove({
                _id: user._id
            })
            return res.json(user)
        }
        throw new Error('Slot doesn\t exist')

    } catch (error) {
        
    }
}