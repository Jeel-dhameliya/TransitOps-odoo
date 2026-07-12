const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Create a maintenance record & update vehicle status
// @route   POST /api/maintenance
// @access  Private (Fleet Manager)
const createMaintenance = catchAsync(async (req, res, next) => {
  const { vehicle: vehicleId, description, cost } = req.body;

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return next(new AppError('Vehicle not found.', 404));
  }
  
  if (vehicle.status === 'On Trip') {
    return next(new AppError('Cannot send vehicle to shop while on an active trip.', 400));
  }

  // 1. Create the maintenance log
  const maintenance = await Maintenance.create({
    vehicle: vehicleId,
    description,
    cost,
    status: 'Open'
  });

  // 2. Automatically change vehicle status to 'In Shop'
  vehicle.status = 'In Shop';
  await vehicle.save();

  res.status(201).json({
    message: 'Maintenance logged. Vehicle is now In Shop.',
    maintenance
  });
});

// @desc    Close maintenance & restore vehicle status
// @route   PUT /api/maintenance/:id/close
// @access  Private (Fleet Manager)
const closeMaintenance = catchAsync(async (req, res, next) => {
  const maintenance = await Maintenance.findById(req.params.id);
  if (!maintenance) {
    return next(new AppError('Maintenance record not found.', 404));
  }

  if (maintenance.status === 'Closed') {
    return next(new AppError('Maintenance is already closed.', 400));
  }

  maintenance.status = 'Closed';
  await maintenance.save();

  // 2. Restore the vehicle to 'Available' (unless it was marked 'Retired')
  const vehicle = await Vehicle.findById(maintenance.vehicle);
  if (vehicle && vehicle.status !== 'Retired') {
    vehicle.status = 'Available';
    await vehicle.save();
  }

  res.json({ message: 'Maintenance closed. Vehicle is now Available.', maintenance });
});

// @desc    Get all maintenance records
// @route   GET /api/maintenance
// @access  Private
const getAllMaintenance = catchAsync(async (req, res, next) => {
  const records = await Maintenance.find().populate('vehicle').sort('-createdAt');
  res.json(records);
});

module.exports = { getAllMaintenance, createMaintenance, closeMaintenance };