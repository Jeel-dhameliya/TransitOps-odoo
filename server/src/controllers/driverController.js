const Driver = require('../models/Driver');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Register a new driver
// @route   POST /api/drivers
// @access  Private (Fleet Manager, Safety Officer)
const createDriver = catchAsync(async (req, res, next) => {
  const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;

  const driverExists = await Driver.findOne({ licenseNumber });
  if (driverExists) {
    return next(new AppError('A driver with this license number is already registered.', 400));
  }

  const driver = await Driver.create({
    name,
    licenseNumber,
    licenseCategory,
    licenseExpiryDate,
    contactNumber,
    safetyScore: safetyScore || 100,
    status
  });

  res.status(201).json({
    message: 'Driver profile created successfully',
    driver
  });
});

// @desc    Get all drivers (with optional status filtering)
// @route   GET /api/drivers
// @access  Private (Authenticated Users)
const getAllDrivers = catchAsync(async (req, res, next) => {
  const { status } = req.query;
  let query = {};

  if (status) query.status = status;

  const drivers = await Driver.find(query);
  res.json(drivers);
});

// @desc    Get a single driver by ID
// @route   GET /api/drivers/:id
// @access  Private (Authenticated Users)
const getDriverById = catchAsync(async (req, res, next) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) {
    return next(new AppError('Driver not found.', 404));
  }
  res.json(driver);
});

// @desc    Update driver profile (e.g., renewing a license or suspending)
// @route   PUT /api/drivers/:id
// @access  Private (Fleet Manager, Safety Officer)
const updateDriver = catchAsync(async (req, res, next) => {
  const { licenseNumber } = req.body;

  if (licenseNumber) {
    const duplicate = await Driver.findOne({ licenseNumber, _id: { $ne: req.params.id } });
    if (duplicate) {
      return next(new AppError('This license number is assigned to another driver.', 400));
    }
  }

  const updatedDriver = await Driver.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!updatedDriver) {
    return next(new AppError('Driver not found.', 404));
  }

  res.json({
    message: 'Driver profile updated successfully',
    driver: updatedDriver
  });
});

// @desc    Delete a driver record
// @route   DELETE /api/drivers/:id
// @access  Private (Fleet Manager)
const deleteDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.findByIdAndDelete(req.params.id);
  if (!driver) {
    return next(new AppError('Driver not found.', 404));
  }
  res.json({ message: 'Driver record removed successfully.' });
});

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver
};