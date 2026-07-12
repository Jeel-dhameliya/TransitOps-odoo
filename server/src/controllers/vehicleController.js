const Vehicle = require('../models/Vehicle');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Private (Fleet Manager Only)
const createVehicle = catchAsync(async (req, res, next) => {
  const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, status } = req.body;

  const vehicleExists = await Vehicle.findOne({ registrationNumber });
  if (vehicleExists) {
    return next(new AppError('A vehicle with this registration number already exists.', 400));
  }

  const vehicle = await Vehicle.create({
    registrationNumber,
    name,
    type,
    maxLoadCapacity,
    odometer,
    acquisitionCost,
    status 
  });

  res.status(201).json({
    message: 'Vehicle registered successfully',
    vehicle
  });
});

// @desc    Get all vehicles (with basic filtering for dashboard/registry tabs)
// @route   GET /api/vehicles
// @access  Private (Authenticated Users)
const getAllVehicles = catchAsync(async (req, res, next) => {
  const { type, status, search, sort } = req.query;
  let query = {};

  if (type) query.type = type;
  if (status) query.status = status;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { registrationNumber: { $regex: search, $options: 'i' } }
    ];
  }

  let sortQuery = { createdAt: -1 }; 
  if (sort) {
    const sortFields = sort.split(',').join(' ');
    sortQuery = sortFields;
  }

  const vehicles = await Vehicle.find(query).sort(sortQuery);
  res.json(vehicles);
});

// @desc    Get a single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private (Authenticated Users)
const getVehicleById = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    return next(new AppError('Vehicle asset not found.', 404));
  }
  res.json(vehicle);
});

// @desc    Update vehicle details or lifecycle status
// @route   PUT /api/vehicles/:id
// @access  Private (Fleet Manager Only)
const updateVehicle = catchAsync(async (req, res, next) => {
  const { registrationNumber } = req.body;

  if (registrationNumber) {
    const duplicate = await Vehicle.findOne({ registrationNumber, _id: { $ne: req.params.id } });
    if (duplicate) {
      return next(new AppError('Registration number is already in use by another vehicle.', 400));
    }
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!updatedVehicle) {
    return next(new AppError('Vehicle asset not found.', 404));
  }

  res.json({
    message: 'Vehicle profile updated successfully',
    vehicle: updatedVehicle
  });
});

const deleteVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
  if (!vehicle) {
    return next(new AppError('Vehicle asset not found.', 404));
  }
  res.json({ message: 'Vehicle record successfully expunged from database.' });
});

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};