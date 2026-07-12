const Fuel = require('../models/Fuel');
const Vehicle = require('../models/Vehicle');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Log a fuel expense for a vehicle
// @route   POST /api/fuel
// @access  Private (Driver, Fleet Manager)
const createFuelLog = catchAsync(async (req, res, next) => {
  const { vehicle, liters, cost, date } = req.body;

  const vehicleExists = await Vehicle.findById(vehicle);
  if (!vehicleExists) {
    return next(new AppError('Vehicle not found.', 404));
  }

  const fuelLog = await Fuel.create({
    vehicle,
    liters,
    cost,
    date: date || Date.now()
  });

  res.status(201).json({
    message: 'Fuel log recorded successfully.',
    fuelLog
  });
});

// @desc    Get all fuel logs
// @route   GET /api/fuel
// @access  Private
const getAllFuelLogs = catchAsync(async (req, res, next) => {
  const logs = await Fuel.find().populate('vehicle').sort('-date');
  res.json(logs);
});

module.exports = { getAllFuelLogs, createFuelLog };