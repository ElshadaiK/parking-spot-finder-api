

const slotModel = require('../models/parking-models/slot-model');

const companyService = require('../service/companyService');
const officerService = require('../service/officerServices');

// Companies' CRUD
exports.AllProfiles = async (req, res) => {
    await companyService.findAllCompanies(req, res);
}

exports.retriveProfile = async (req, res) => {
    if(req.param.name){
        await companyService.findCompanyByName(req, res);
    }
    else if(req.param.id)
        await companyService.findCompanyById(req, res);
}

exports.createProfile = async (req, res) => {
    await companyService.insertCompany(req, res);
}

exports.updateProfile = async (req, res) => {
    await companyService.updateACompany(req, res);
}

exports.removeProfile = async (req, res) => {
    await companyService.deleteACompany(req, res);
}

// Officers' CRUD

exports.AllOfficers = async (req, res) => {
    await officerService.findAllOfficers(req, res);
    
}

exports.retriveOfficer = async (req, res) => {
    if(req.param.name){
        await officerService.findOfficerByName(req, res);
    }
    else if(req.param.id)
        await officerService.findOfficerById(req, res);

}

exports.createOfficer = async (req, res) => {
    await officerService.insertOfficer(req, res)

}

exports.updateOfficer = async (req, res) => {
    await officerService.updateOfficer(req, res)
}

exports.removeOfficer = async (req, res) => {
    await officerService.deleteOfficer(req, res)
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
        const users = await slotModel.paginate(query,options)

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
        const user = await slotModel.findById(req.params.id)
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

        const user = await slotModel.create(req.body)

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
        let user = await slotModel.findById(req.params.id)
        if(user) {
            user = await slotModel.updateOne({_id: user._id}, req.body)
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
        let user = await slotModel.findById(req.params.id)
        if(user) {
            await slotModel.remove({
                _id: user._id
            })
            return res.json(user)
        }
        throw new Error('Slot doesn\t exist')

    } catch (error) {
        
    }
}