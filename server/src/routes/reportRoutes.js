const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { getDashboardKPIs, getVehicleFinancials } = require('../controllers/reportController');

router.use(protect);

router.get('/dashboard', getDashboardKPIs);
// Restrict financial data to specific roles[cite: 1]
router.get('/financials', authorizeRoles('Fleet Manager', 'Financial Analyst'), getVehicleFinancials);

module.exports = router;