const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { 
  getDashboardKPIs, 
  getVehicleFinancials, 
  exportFinancialsCSV // Import the new function
} = require('../controllers/reportController');

router.use(protect);

router.get('/dashboard', getDashboardKPIs);
router.get('/financials', authorizeRoles('Fleet Manager', 'Financial Analyst'), getVehicleFinancials);

// Add the new CSV export route here
router.get('/financials/export/csv', authorizeRoles('Fleet Manager', 'Financial Analyst'), exportFinancialsCSV);

module.exports = router;