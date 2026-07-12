const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const Fuel = require('../models/Fuel');
const { Parser } = require('json2csv');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Get top-level dashboard KPIs (Utilization, Active counts, etc.)
// @route   GET /api/reports/dashboard
// @access  Private (Fleet Manager, Financial Analyst)
const getDashboardKPIs = catchAsync(async (req, res, next) => {
  const vehicleStats = await Vehicle.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  let totalVehicles = 0;
  let onTripVehicles = 0;
  const formattedStats = { Available: 0, 'On Trip': 0, 'In Shop': 0, Retired: 0 };

  vehicleStats.forEach(stat => {
    formattedStats[stat._id] = stat.count;
    if (stat._id !== 'Retired') totalVehicles += stat.count;
    if (stat._id === 'On Trip') onTripVehicles += stat.count;
  });

  const fleetUtilization = totalVehicles === 0 ? 0 : ((onTripVehicles / totalVehicles) * 100).toFixed(2);

  const activeTrips = await Trip.countDocuments({ status: 'Dispatched' });
  const pendingTrips = await Trip.countDocuments({ status: 'Draft' });

  res.json({
    vehicleCounts: formattedStats,
    fleetUtilization: `${fleetUtilization}%`,
    activeTrips,
    pendingTrips
  });
});

const getFinancialPipeline = () => [
  { $lookup: { from: 'fuels', localField: '_id', foreignField: 'vehicle', as: 'fuelLogs' } },
  { $lookup: { from: 'maintenances', localField: '_id', foreignField: 'vehicle', as: 'maintenanceLogs' } },
  { $lookup: { from: 'trips', localField: '_id', foreignField: 'vehicle', as: 'tripLogs' } },
  {
    $addFields: {
      totalFuelCost: { $sum: '$fuelLogs.cost' },
      totalFuelLiters: { $sum: '$fuelLogs.liters' },
      totalMaintenanceCost: { $sum: '$maintenanceLogs.cost' },
      completedTrips: {
        $filter: {
          input: '$tripLogs',
          as: 'trip',
          cond: { $eq: ['$$trip.status', 'Completed'] }
        }
      }
    }
  },
  {
    $addFields: {
      operationalCost: { $add: ['$totalFuelCost', '$totalMaintenanceCost'] },
      totalDistance: { $sum: '$completedTrips.plannedDistance' },
      totalRevenue: { $multiply: [{ $sum: '$completedTrips.plannedDistance' }, 2] }
    }
  },
  {
    $project: {
      registrationNumber: 1,
      name: 1,
      acquisitionCost: 1,
      totalDistance: 1,
      operationalCost: 1,
      fuelEfficiency: {
        $cond: [{ $gt: ['$totalFuelLiters', 0] }, { $divide: ['$totalDistance', '$totalFuelLiters'] }, 0]
      },
      roi: {
        $cond: [
          { $gt: ['$acquisitionCost', 0] },
          { $divide: [{ $subtract: ['$totalRevenue', '$operationalCost'] }, '$acquisitionCost'] },
          0
        ]
      }
    }
  }
];

// @desc    Get Financial Analytics per Vehicle (Fuel Efficiency, Ops Cost, ROI)
// @route   GET /api/reports/financials
// @access  Private (Financial Analyst, Fleet Manager)
const getVehicleFinancials = catchAsync(async (req, res, next) => {
  const analytics = await Vehicle.aggregate(getFinancialPipeline());
  res.json(analytics);
});

// @desc    Export Financial Analytics as CSV
// @route   GET /api/reports/financials/export
// @access  Private (Financial Analyst, Fleet Manager)
const exportFinancialsCSV = catchAsync(async (req, res, next) => {
  const analytics = await Vehicle.aggregate(getFinancialPipeline());

  const fields = [
    { label: 'Registration Number', value: 'registrationNumber' },
    { label: 'Vehicle Name', value: 'name' },
    { label: 'Acquisition Cost ($)', value: 'acquisitionCost' },
    { label: 'Total Distance (km)', value: 'totalDistance' },
    { label: 'Operational Cost ($)', value: 'operationalCost' },
    { label: 'Fuel Efficiency (km/L)', value: 'fuelEfficiency' },
    { label: 'ROI', value: 'roi' }
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(analytics);

  res.header('Content-Type', 'text/csv');
  res.attachment('transitops_financial_report.csv');
  return res.send(csv);
});

module.exports = { getDashboardKPIs, getVehicleFinancials, exportFinancialsCSV };