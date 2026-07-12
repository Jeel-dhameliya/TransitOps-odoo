const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');

// All endpoints in this file require valid authentication[cite: 1]
router.use(protect);

// Unified routing mapping
router.route('/')
  .get(getAllVehicles) // Anyone authenticated can view assets[cite: 1]
  .post(authorizeRoles('Fleet Manager'), createVehicle); // Only Fleet Managers can register assets[cite: 1]

router.route('/:id')
  .get(getVehicleById)
  .put(authorizeRoles('Fleet Manager'), updateVehicle)
  .delete(authorizeRoles('Fleet Manager'), deleteVehicle);

module.exports = router;