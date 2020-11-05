var router = require("express-promise-router")();

const { hasPermissions } = require('../middlewares/auth');
const  {vehicleFormRequest} = require('../middlewares/form-request/vehicle');

const parkingLotController = require('../controllers/parkinglot.controller')
const vehicleController = require('../controllers/vehicle.controller')

/**
 * @typedef TICKET
 * @property {string} username.required - A Unique user name
 * @property {string} company.required - Company's name
 */

/**
 * Returns API status
 * 
 * @route GET /
 * @group index - Validates and gives back API service status
 * @returns {object} 200 - {
 *  title: 'Parking Spot finder',
 *  version: '1.0.0',
 *   description: 'description .....'
 * }
 * @returns {Error}  default - Unexpected error
 */
router.get('/', (req, res) => res.json({
    title: 'parking api',
    version: '1.0.0',
    description: 'description .....'
  })
);

router.get('/parking_lot/status', hasPermissions(['view slot', 'view any slot']), parkingLotController.getParkingLotStacks);

/**
 * Returns Parking Stacks
 * 
 * @route POST /getnearest
 * @group TICKET - Returns list of parking stacks
 * @param {string} longitude.path.required - user longitude
 * @param {string} latitude.path.required - user latitude
 * @security JWT
 * @returns {object} 200 - Array of stacks sorted by distance from current position
 * @returns {Error}  default - Unexpected error
 */
router.post('/getnearest', vehicleFormRequest('getNearest'), vehicleController.getParkingsNear);

/**
 * Returns Parking Slots
 * 
 * @route POST /vehicle/getavailable
 * @group TICKET - Returns list of available parking slots
 * @param {string} stack_id.path.required - parking stack id
 * @security JWT
 * @returns {object} 200 - Array of slots in the parking slot
 * @returns {Error}  default - Unexpected error
 */
router.post('/vehicle/getavailable', vehicleFormRequest('getAvailable'), vehicleController.getAvailableSlots);

/**
 * Returns Parking Stack
 * 
 * @route POST /getnearest
 * @group TICKET - Returns the stack whose slots have been cleared
 * @param {string} stack_id.path.required - parking stack id
 * @security JWT
 * @returns {object} 200 - The stack
 * @returns {Error}  default - Unexpected error
 */
router.post('/clearStack', vehicleFormRequest('getAvailable'), vehicleController.clear);

/**
 * Returns Ticket
 * 
 * @route POST /vehicle/park
 * @group TICKET - Returns the ticket when a user parks
 * @param {string} stack_id.path.required - parking stack id
 * @param {string} slot_id.path.required - parking slot id
 * @security JWT
 * @returns {object} 200 - The ticket
 * @returns {Error}  default - Unexpected error
 */
router.post('/vehicle/park', vehicleFormRequest('park'), vehicleController.park);

/**
 * Returns Ticket
 * 
 * @route POST /vehicle/reserve
 * @group TICKET - Returns the ticket when a user reserves
 * @param {string} stack_id.path.required - parking stack id
 * @param {string} slot_id.path.required - parking slot id
 * @security JWT
 * @returns {object} 200 - The ticket
 * @returns {Error}  default - Unexpected error
 */
 router.post('/vehicle/reserve', vehicleFormRequest('park'), vehicleController.reserve);

/**
 * Returns Ticket
 * 
 * @route POST /vehicle/park
 * @group TICKET - Returns the ticket when a leaves
 * @param {string} ticket_id.path.required - ticket id of parking
 * @security JWT
 * @returns {object} 200 - The ticket
 * @returns {Error}  default - Unexpected error
 */
router.post('/vehicle/exit', vehicleFormRequest('exit'), vehicleController.exit);

module.exports = router;
