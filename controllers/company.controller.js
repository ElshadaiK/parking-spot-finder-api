
const slotModel = require('../models/parking-models/slot-model');

const companyService = require('../service/companyService');
const officerService = require('../service/officerServices');
const stackService = require('../service/parkingLotStackService');
const slotService = require('../service/parkingSlotService');


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
    let slots_per_floor = company_info[1]
    if(floor == 1){
        let parkingLotStackId = await stackService.createParkingLotStacks(...company_info, res);
        for (let slotIndex = 0; slotIndex < slots_per_floor; slotIndex++)
        {
            await slotService.createParkingSlot(parkingLotStackId);
        }
    }
    else{
        for (let floorIndex = 0; floorIndex < floor; floorIndex++) {
            let parkingLotStackId = await stackService.createParkingLotStacks(...company_info, res, floorIndex);
            for (let slotIndex = 0; slotIndex < slots_per_floor; slotIndex++)
            {
                await slotService.createParkingSlot(parkingLotStackId);
            }
        }
    }
    
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
