var router = require("express-promise-router")();

const { hasPermissions } = require('../middlewares/auth');

const parkingLotController = require('../controllers/parkinglot.controller')
const vehicleController = require('../controllers/vehicle.controller')
const ticketController = require('../controllers/ticket.controller')

const { validate } = require('../middlewares/index')

// home
router.get('/', (req, res) => res.json({
    title: 'parking api',
    version: '1.0.0',
    description: 'description .....'
  })
);

router.get('/parking_lot/status', hasPermissions(['view slot', 'view any slot']), parkingLotController.getParkingLotStacks);

router.get('/getnearest',  vehicleController.getParkingsNear);

router.post('/vehicle/getavailable',  vehicleController.getAvailableSlots);

router.post('/vehicle/park',  vehicleController.park);

router.post('/vehicle/exit', hasPermissions(['unpark car']) && validate('unParkUser'), vehicleController.exit);

router.get('/ticket', hasPermissions(['get ticket']) && validate('ticketUser'), ticketController.getTickets);

module.exports = router;
