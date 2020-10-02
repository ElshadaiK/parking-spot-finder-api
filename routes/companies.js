var router = require("express-promise-router")();

const  {userFormRequest} = require('../middlewares/form-request/user')
const { hasPermissions } = require('../middlewares/auth');
const companyController = require('../controllers/company.controller')

/**
 * @typedef USER
 * @property {string} username.required - A Unique user name
 * @property {string} email.required - A Unique email name
 * @property {string} password.required - A strong password
 */
/**
 * Returns ALL Users
 * 
 * @route GET /users
 * @group User - Deals with all CRUD operations with user model
 * @param {string} sort.query - sort parament
 * @param {string} page.query - set the page number
 * @param {string} filter.query - set filter query 
 * @security JWT
 * @returns {object} 200 - Array of users
 * @returns {Error}  default - Unexpected error
 */
router.get('/', hasPermissions(['view any company', 'view company']),companyController.All);

/**
 * Create a new user 
 * 
 * @route GET /users/{id}
 * @group User 
 * @param {string} id.path.required - user id
 * @security JWT
 * @returns {object} 200 - User object
 * @returns {Error}  default - Unexpected error
 */
router.get('/:id', hasPermissions(['view company']),companyController.get);


/**
 * Create a new user 
 * 
 * @route POST /users/
 * @group User 
 * @param {USER.model} user.body.required - the new user
 * @security JWT
 * @returns {object} 200 - User object
 * @returns {Error}  default - Unexpected error
 */
router.post('/', hasPermissions(['create company']) && userFormRequest('createUser'), companyController.create);

/**
 * Update an existing user by id 
 * 
 * @route PATCH /users/:id
 * @group User
 * @param {string} id.path.required - user id
 * @param {USER.model} user.body - the new user object
 * @security JWT
 * @returns {USER.model} 200 - User object
 * @returns {Error}  default - Unexpected error
 */
router.patch('/:id', hasPermissions(['update company']), companyController.update);

/**
 * Remove a new user  with id
 * 
 * @route DELETE /users/{id}
 * @group User 
 * @param {string} id.path.required - user id
 * @security JWT
 * @returns {object} 200 - User object
 * @returns {Error}  default - Unexpected error
 */
router.delete('/:id', hasPermissions(['remove company']),companyController.remove);

module.exports = router;
