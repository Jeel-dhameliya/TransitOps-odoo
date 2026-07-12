const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { getAllMaintenance, createMaintenance, closeMaintenance } = require('../controllers/maintenanceController');

router.use(protect);

router.get('/', getAllMaintenance);
router.post('/', authorizeRoles('Fleet Manager'), createMaintenance);
router.put('/:id/close', authorizeRoles('Fleet Manager'), closeMaintenance);

module.exports = router;