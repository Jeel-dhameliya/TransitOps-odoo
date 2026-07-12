const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const Fuel = require('../models/Fuel');

// @desc    Get top-level dashboard KPIs (Utilization, Active counts, etc.)
// @route   GET /api/reports/dashboard
// @access  Private (Fleet Manager, Financial Analyst)
const getDashboardKPIs = async (req, res) => {
  try {
    // 1. Get raw counts of vehicles grouped by their status
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

    // 2. Calculate Fleet Utilization (%)
    // Formula: (Vehicles On Trip / Total Active Fleet) * 100
    const fleetUtilization = totalVehicles === 0 ? 0 : ((onTripVehicles / totalVehicles) * 100).toFixed(2);

    // 3. Get Active & Pending Trips[cite: 1]
    const activeTrips = await Trip.countDocuments({ status: 'Dispatched' });
    const pendingTrips = await Trip.countDocuments({ status: 'Draft' });

    res.json({
      vehicleCounts: formattedStats,
      fleetUtilization: `${fleetUtilization}%`,
      activeTrips,
      pendingTrips
    });
  } catch (error) {
    console.error('Dashboard KPI Error:', error);
    res.status(500).json({ message: 'Server Error generating dashboard KPIs.' });
  }
};

// @desc    Get Financial Analytics per Vehicle (Fuel Efficiency, Ops Cost, ROI)
// @route   GET /api/reports/financials
// @access  Private (Financial Analyst, Fleet Manager)
const getVehicleFinancials = async (req, res) => {
  try {
    const analytics = await Vehicle.aggregate([
      // 1. Join with Fuel collection to sum fuel cost and liters[cite: 1]
      {
        $lookup: {
          from: 'fuels',
          localField: '_id',
          foreignField: 'vehicle',
          as: 'fuelLogs'
        }
      },
      // 2. Join with Maintenance collection to sum maintenance cost[cite: 1]
      {
        $lookup: {
          from: 'maintenances',
          localField: '_id',
          foreignField: 'vehicle',
          as: 'maintenanceLogs'
        }
      },
      // 3. Join with Trips to calculate distance driven and simulated revenue
      {
        $lookup: {
          from: 'trips',
          localField: '_id',
          foreignField: 'vehicle',
          as: 'tripLogs'
        }
      },
      // 4. Compute the mathematical fields
      {
        $addFields: {
          totalFuelCost: { $sum: '$fuelLogs.cost' },
          totalFuelLiters: { $sum: '$fuelLogs.liters' },
          totalMaintenanceCost: { $sum: '$maintenanceLogs.cost' },
          
          // Only count Completed trips for distance and revenue
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
          operationalCost: { $add: ['$totalFuelCost', '$totalMaintenanceCost'] }, //[cite: 1]
          totalDistance: { $sum: '$completedTrips.plannedDistance' },
          // Simulating Revenue: $2 per km driven. Replace this if you add a revenue field!
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
          // Fuel Efficiency (Distance / Fuel)[cite: 1]
          fuelEfficiency: {
            $cond: [
              { $gt: ['$totalFuelLiters', 0] },
              { $divide: ['$totalDistance', '$totalFuelLiters'] },
              0
            ]
          },
          // Vehicle ROI = (Revenue - Operational Cost) / Acquisition Cost[cite: 1]
          roi: {
            $cond: [
              { $gt: ['$acquisitionCost', 0] },
              { $divide: [
                  { $subtract: ['$totalRevenue', '$operationalCost'] }, 
                  '$acquisitionCost'
                ] 
              },
              0
            ]
          }
        }
      }
    ]);

    res.json(analytics);
  } catch (error) {
    console.error('Financial Analytics Error:', error);
    res.status(500).json({ message: 'Server Error generating financial reports.' });
  }
};

module.exports = { getDashboardKPIs, getVehicleFinancials };