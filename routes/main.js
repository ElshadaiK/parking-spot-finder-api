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

router.get('/parking_lot/status', hasPermissions(['view slot', 'view any slot']), parkingLotController.getParkingLotStacks);

/**
 * Returns Parking Stacks
 * 
 * @route POST /main/getnearest
 * @group MAIN - Returns list of parking stacks
 * @param {number} longitude.body.required - user longitude
 * @param {number} latitude.body.required - user latitude
 * @security JWT
 * @returns {object} 200 - Array of stacks sorted by distance from current position
 * @returns {Error}  default - Unexpected error
 */
router.post('/getnearest', vehicleFormRequest('getNearest'), vehicleController.getParkingsNear);

/**
 * Returns al Parking Slots
 * 
 * @route POST /main/getallslots
 * @group MAIN - Returns list of available parking slots
 * @param {string} parkingLotId.body.required - parking stack id
 * @security JWT
 * @returns {object} 200 - Array of slots in the parking slot
 * @returns {Error}  default - Unexpected error
 */
 router.post('/getallslots', vehicleController.getAllSlots);
 
/**
 * Returns Parking Slots
 * 
 * @route POST /main/vehicle/getavailable
 * @group MAIN - Returns list of available parking slots
 * @param {string} parkingLotId.body.required - parking stack id
 * @security JWT
 * @returns {object} 200 - Array of slots in the parking slot
 * @returns {Error}  default - Unexpected error
 */
router.post('/vehicle/getavailable', vehicleFormRequest('getAvailable'), vehicleController.getAvailableSlots);

/**
 * Returns Parking Slots
 * 
 * @route POST /main/vehicle/getOccupied
 * @group MAIN - Returns list of occupied parking slots
 * @param {string} parkingLotId.body.required - parking stack id
 * @security JWT
 * @returns {object} 200 - Array of slots in the parking slot
 * @returns {Error}  default - Unexpected error
 */
 router.post('/vehicle/getOccupied', vehicleFormRequest('getAvailable'), vehicleController.getOccupiedSlots);

/**
 * Returns Parking Stack
 * 
 * @route POST /main/clearStack
 * @group MAIN - Returns the stack whose slots have been cleared
 * @param {string} parkingLotId.body.required - parking stack id
 * @security JWT
 * @returns {object} 200 - The stack
 * @returns {Error}  default - Unexpected error
 */
router.post('/clearStack', vehicleFormRequest('getAvailable'), vehicleController.clear);

/**
 * Returns Ticket
 * 
 * @route POST /main/vehicle/park
 * @group MAIN - Returns the ticket when a user parks
 * @param {string} stack_id.body.required - parking stack id
 * @param {string} slot_id.body.required - parking slot id
 * @security JWT
 * @returns {object} 200 - The ticket
 * @returns {Error}  default - Unexpected error
 */
router.post('/vehicle/park', hasPermissions(['park car']) && vehicleFormRequest('park'), vehicleController.park);

/**
 * Returns Ticket
 * 
 * @route POST /main/vehicle/reserve
 * @group MAIN - Returns the ticket when a user reserves
 * @param {string} stack_id.body.required - parking stack id
 * @param {string} slot_id.body.required - parking slot id
 * @security JWT
 * @returns {object} 200 - The ticket
 * @returns {Error}  default - Unexpected error
 */
 router.post('/vehicle/reserve', hasPermissions(['unpark car']) && vehicleFormRequest('park'), vehicleController.reserve);

/**
 * Returns Ticket
 * 
 * @route POST /main/vehicle/exitByTicket
 * @group MAIN - Returns the ticket when a leaves
 * @param {string} ticket_id.body.required - ticket id of parking
 * @security JWT
 * @returns {object} 200 - The ticket
 * @returns {Error}  default - Unexpected error
 */
router.post('/vehicle/exitByTicket', hasPermissions(['unpark car']) && vehicleFormRequest('exitByTicket'), vehicleController.exitTicket);

/**
 * Returns Ticket
 * 
 * @route POST /main/exitByPlate
 * @group MAIN - Returns the ticket when a leaves
 * @param {string} ticket_id.body.required - ticket id of parking
 * @security JWT
 * @returns {object} 200 - The ticket
 * @returns {Error}  default - Unexpected error
 */
 router.post('/exitByPlate', vehicleFormRequest('exitByPlate'),  vehicleController.exitPlate);

/**
* Returns Ticket
* 
* @route POST /main/getActiveTickets
* @group MAIN - Returns the all active tickets in the stack
* @security JWT
* @returns {object} 200 - The ticket
* @returns {Error}  default - Unexpected error
*/
router.post('/getActiveTickets',  vehicleController.getActiveTickets);

/**
* Returns Stacks
* 
* @route POST /main/getActiveTickets
* @group MAIN - Returns the all stacks in the company the PO works in
* @security JWT
* @returns {object} 200 - The array of stacks
* @returns {Error}  default - Unexpected error
*/
router.post('/getStacks', parkingLotController.getParkingLotStacks);


module.exports = router;
