var router = require("express-promise-router")();

const  {authFormRequest} = require('../middlewares/form-request/auth');
const authController = require('../controllers/auth.controller');

const companyController = require('../controllers/company.auth.controller');

/**
 * Login user
 * 
 * @route POST /auth/login/
 * @group Auth 
 * @param {email} email.body.required - email of the user
 * @param {string} password.body.required - password of the user
 * @security JWT
 * @returns {object} 200 - User object
 * @returns {Error}  default - Unexpected error
 */
router.post('/login', authFormRequest('loginUser'), authController.login);

/**
 * Login company
 * 
 * @route POST /auth/loginCompany/
 * @group Auth 
 * @param {email} email.body.required - email of the company
 * @param {string} password.body.required - password of the company
 * @security JWT
 * @returns {object} 200 - Company object
 * @returns {Error}  default - Unexpected error
 */
router.post('/loginCompany', authFormRequest('loginUser'), companyController.login)

/**
 * Create a new user 
 * 
 * @route POST /auth/signup/
 * @group Auth 
 * @param {USER.model} user.body.required - the new user
 * @security JWT
 * @returns {object} 200 - User object
 * @returns {Error}  default - Unexpected error
 */
router.post('/signup', authFormRequest('createUser'), authController.signup);


module.exports = router;
