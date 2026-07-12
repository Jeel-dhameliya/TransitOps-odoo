const express = require('express');
const router = express.Router(); 
const {protect } = require('../middleware/auth');
const {authorizeroles} = require('../middleware/role');
const{
    createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip
} = require('../controllers/tripController')


router.use(protect); 


router.post('/',authorizeroles('Driver', 'Fleet Manager'),createTrip);

router.put('/:id/dispatch' , authorizeroles('Driver', 'Fleet Manager'), dispatchTrip);

router.put('/:id/complete', authorizeRoles('Driver', 'Fleet Manager'), completeTrip);

router.put('/:id/cancel', authorizeRoles('Driver', 'Fleet Manager'), cancelTrip);

module.exports = router;