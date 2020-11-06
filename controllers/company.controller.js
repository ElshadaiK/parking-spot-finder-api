
const companyService = require('../service/companyService');
const officerService = require('../service/officerServices');
const stackService = require('../service/parkingLotStackService');


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
    const company_info = await companyService.insertCompany(req, res);
    let floor = parseInt(company_info[2])
    for (let floorIndex = 0; floorIndex < floor; floorIndex++) {
            await stackService.createParkingLotStacks(...company_info, res, floorIndex);
            
        }
    
}

exports.updateProfile = async (req, res) => {
    const {user} = req
    const company_info = await companyService.updateACompany(req, res);
    let slotsPerFloor = parseInt(company_info[1])
    let floor = parseInt(company_info[2])
    // If they change the floor number
    if(user.data.floor < floor){
        for (let floorIndex = user.data.floor; floorIndex < floor; floorIndex++) {
            await stackService.createParkingLotStacks(...company_info, res, floorIndex);
            
        }
    }
    else{
        if(user.data.floor > floor){
            for (let floorIndex = user.data.floor; floorIndex > floor; floorIndex--) {
                await stackService.delete(...company_info, res, floorIndex);
                
            }
        }
    }
    // If they change the slot number
    if(user.data.slots_per_floor < slotsPerFloor){
        
    }
    else{
        if(user.data.slots_per_floor > slotsPerFloor){
            
        }
    }
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
