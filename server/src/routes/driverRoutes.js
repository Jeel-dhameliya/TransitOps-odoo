const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver
} = require('../controllers/driverController');

// All driver routes require authentication[cite: 1]
router.use(protect);

router.route('/')
  .get(getAllDrivers) // All authenticated users can view drivers to assign them to trips
  .post(authorizeRoles('Fleet Manager', 'Safety Officer'), createDriver); // Only managers/safety officers can register[cite: 1]

router.route('/:id')
  .get(getDriverById)
  .put(authorizeRoles('Fleet Manager', 'Safety Officer'), updateDriver) // Needed for license renewals/suspensions
  .delete(authorizeRoles('Fleet Manager'), deleteDriver); // Usually reserved for Fleet Managers

module.exports = router;