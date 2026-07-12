const express = require('express');
const router = express.Router(); 
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const {
  createTrip,
  getAllTrips,
  dispatchTrip,
  completeTrip,
  cancelTrip
} = require('../controllers/tripController')


router.use(protect); 

router.get('/', getAllTrips);
router.post('/', authorizeRoles('Driver', 'Fleet Manager'), createTrip);

router.put('/:id/dispatch', authorizeRoles('Driver', 'Fleet Manager'), dispatchTrip);

router.put('/:id/complete', authorizeRoles('Driver', 'Fleet Manager'), completeTrip);

router.put('/:id/cancel', authorizeRoles('Driver', 'Fleet Manager'), cancelTrip);

module.exports = router;