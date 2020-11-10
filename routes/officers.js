var router = require("express-promise-router")();

const  {companyFormRequest} = require('../middlewares/form-request/company')
const { hasPermissions } = require('../middlewares/auth');
const companyController = require('../controllers/company.controller')

/**
 * @typedef ParkingLotStack
 * @property {COMPANY.model} company.required - Company id
 * @property {number} floor.required - Stack's floor number
 */
 /**
 * @typedef ParkingSlotStatus
 * @property {string} statusName.required - status name
 */
/**
 * @typedef ParkingSlot
 * @property {ParkingLotStack.model} stack.required - stack id
 * @property {string} description.required - Slot's description
 * @property {ParkingSlotStatus.model} status.required - Slot's status
 * @property {TICKET.model} occupied_by.required - Slot's description
 */

/**
 * Returns ALL Officers
 * 
 * @route GET /officers
 * @group OFFICER - Deals with all CRUD operations with officer model
 * @param {string} sort.query - sort parament
 * @param {string} page.query - set the page number
 * @param {string} filter.query - set filter query 
 * @security JWT
 * @returns {object} 200 - Array of officers
 * @returns {Error}  default - Unexpected error
 */
 router.get('/', hasPermissions(['view any officer', 'view officer']),companyController.AllOfficers);

 /**
  * Create a new officer 
  * 
  * @route GET /officers/{id}
  * @group OFFICER 
  * @param {string} id.path.required - officer id
  * @security JWT
  * @returns {object} 200 - officer object
  * @returns {Error}  default - Unexpected error
  */
 router.get('/:id', hasPermissions(['view officer']),companyController.retriveOfficer);
 
 
 /**
  * Create a officer user 
  * 
  * @route POST /officers/
  * @group OFFICER 
  * @param {OFFICER.model} officer.body.required - the officer user
  * @security JWT
  * @returns {object} 200 - officer object
  * @returns {Error}  default - Unexpected error
  */
 router.post('/', hasPermissions(['create officer']) && companyFormRequest('createOfficer'), companyController.createOfficer);
 
 /**
  * Update an existing officer by id 
  * 
  * @route PATCH /officers/:id
  * @group OFFICER
  * @param {string} id.path.required - officer id
  * @param {OFFICER.model} officer.body - the new officer object
  * @security JWT
  * @returns {OFFICER.model} 200 - officer object
  * @returns {Error}  default - Unexpected error
  */
 router.patch('/:id', hasPermissions(['update officer']) && companyFormRequest('updateOfficer'), companyController.updateOfficer);
 
 /**
  * Remove a new officer  with id
  * 
  * @route DELETE /officers/{id}
  * @group OFFICER 
  * @param {string} id.path.required - officer id
  * @security JWT
  * @returns {object} 200 - officer object
  * @returns {Error}  default - Unexpected error
  */
 router.delete('/:id', hasPermissions(['remove officer']),companyController.removeOfficer);
 
 
module.exports = router;