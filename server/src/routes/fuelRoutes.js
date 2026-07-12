const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { createFuelLog } = require('../controllers/fuelController');

router.use(protect);

router.post('/', authorizeRoles('Driver', 'Fleet Manager'), createFuelLog);

module.exports = router;