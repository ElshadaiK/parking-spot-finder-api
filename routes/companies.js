var router = require("express-promise-router")();

const  {companyFormRequest} = require('../middlewares/form-request/company')
const { hasPermissions } = require('../middlewares/auth');
const companyController = require('../controllers/company.controller')

/**
 * @typedef COMPANY
 * @property {string} name.required - A Unique company name
 * @property {email} email.required - A Unique email name
 * @property {string} password.required - A strong password length of 3-30 consisting lowercase, uppercase, and numbers
 * @property {number} charge.required - Charge of parking per hour
 * @property {number} floors - Parking floors available
 * @property {number} slots.required - Available slots per floor
 * @property {number} rank.required - Rank of parking company, from 0-5
 */
/**
 * Returns ALL companies
 * 
 * @route GET /companies
 * @group Company - Deals with all CRUD operations with company model
 * @param {string} sort.query - sort parament
 * @param {string} page.query - set the page number
 * @param {string} filter.query - set filter query 
 * @security JWT
 * @returns {object} 200 - Array of companies
 * @returns {Error}  default - Unexpected error
 */
router.get('/', hasPermissions(['view any company', 'view company']),companyController.AllProfiles);

/**
 * Create a new company 
 * 
 * @route GET /companies/{id}
 * @group Company 
 * @param {string} id.path.required - company id
 * @security JWT
 * @returns {object} 200 - Company object
 * @returns {Error}  default - Unexpected error
 */
router.get('/:id', hasPermissions(['view company']),companyController.retriveProfile);


/**
 * Create a new company 
 * 
 * @route POST /companies/
 * @group Company 
 * @param {Company.model} company.body.required - the new company
 * @security JWT
 * @returns {object} 200 - Coompany object
 * @returns {Error}  default - Unexpected error
 */
router.post('/', hasPermissions(['create company']) && companyFormRequest('createCompany'), companyController.createProfile);

/**
 * Update an existing company by id 
 * 
 * @route PATCH /companies/:id
 * @group Company
 * @param {string} id.path.required - company id
 * @param {Company.model} company.body - the new company object
 * @security JWT
 * @returns {Company.model} 200 - User object
 * @returns {Error}  default - Unexpected error
 */
router.patch('/:id', hasPermissions(['update company']) && companyFormRequest('updateCompany'), companyController.updateProfile);

/**
 * Remove a new company  with id
 * 
 * @route DELETE /companies/{id}
 * @group Company 
 * @param {string} id.path.required - company id
 * @security JWT
 * @returns {object} 200 - Company object
 * @returns {Error}  default - Unexpected error
 */
router.delete('/:id', hasPermissions(['remove company']),companyController.removeProfile);


/**
 * @typedef SLOTS
 * @property {string} company.required - Company's name
 */

// /**
//  * Returns ALL slots
//  * 
//  * @route GET /companies/slots
//  * @group SLOTS - Deals with all CRUD operations with slot model
//  * @param {string} sort.query - sort parament
//  * @param {string} page.query - set the page number
//  * @param {string} filter.query - set filter query 
//  * @security JWT
//  * @returns {object} 200 - Array of slots
//  * @returns {Error}  default - Unexpected error
//  */
// router.get('/slots', hasPermissions(['view any slot', 'view slot']),companyController.AllSlots);

// /**
//  * Create a new slot 
//  * 
//  * @route GET /companies/slots/{id}
//  * @group SLOTS 
//  * @param {string} id.path.required - slot id
//  * @security JWT
//  * @returns {object} 200 - slots object
//  * @returns {Error}  default - Unexpected error
//  */
// router.get('slots/:id', hasPermissions(['view slot']),companyController.retriveSlot);


// /**
//  * Create a slot user 
//  * 
//  * @route POST /companies/slots/
//  * @group SLOTS 
//  * @param {SLOTS.model} slots.body.required - the slots user
//  * @security JWT
//  * @returns {object} 200 - slots object
//  * @returns {Error}  default - Unexpected error
//  */
// router.post('/slots', hasPermissions(['create slot']) && companyFormRequest('createUser'), companyController.createSlot);

// /**
//  * Update an existing slots by id 
//  * 
//  * @route PATCH /companies/slots/:id
//  * @group SLOTS
//  * @param {string} id.path.required - slots id
//  * @param {SLOTS.model} slots.body - the new slot object
//  * @security JWT
//  * @returns {SLOTS.model} 200 - slot object
//  * @returns {Error}  default - Unexpected error
//  */
// router.patch('slots/:id', hasPermissions(['update slot']), companyController.updateSlot);

// /**
//  * Remove a new slots  with id
//  * 
//  * @route DELETE /companies/slots/{id}
//  * @group SLOTS 
//  * @param {string} id.path.required - slots id
//  * @security JWT
//  * @returns {object} 200 - slot object
//  * @returns {Error}  default - Unexpected error
//  */
// router.delete('slots/:id', hasPermissions(['remove slot']),companyController.removeSlot);


module.exports = router;
