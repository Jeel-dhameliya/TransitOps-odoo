const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { getAllFuelLogs, createFuelLog } = require('../controllers/fuelController');

router.use(protect);

router.get('/', authorizeRoles('Driver', 'Fleet Manager', 'Financial Analyst'), getAllFuelLogs);
router.post('/', authorizeRoles('Driver', 'Fleet Manager'), createFuelLog);

module.exports = router;