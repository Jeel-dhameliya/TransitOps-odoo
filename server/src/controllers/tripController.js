const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// @desc    Create a new draft trip
// @route   POST /api/trips
// @access  Private (Driver, Fleet Manager)
const createTrip = catchAsync(async (req, res, next) => {
  const { source, destination, vehicle, driver, cargoWeight, plannedDistance } = req.body;

  const trip = await Trip.create({
    source,
    destination,
    vehicle,
    driver,
    cargoWeight,
    plannedDistance,
    status: 'Draft' 
  });

  res.status(201).json({
    message: 'Trip drafted successfully.',
    trip
  });
});

// @desc    Dispatch a trip (Enforces all business rules)
// @route   PUT /api/trips/:id/dispatch
// @access  Private (Driver, Fleet Manager)
const dispatchTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return next(new AppError('Trip not found.', 404));

  if (trip.status !== 'Draft') {
    return next(new AppError('Only Draft trips can be dispatched.', 400));
  }

  const vehicle = await Vehicle.findById(trip.vehicle);
  const driver = await Driver.findById(trip.driver);

  if (!vehicle || !driver) {
    return next(new AppError('Assigned Vehicle or Driver no longer exists.', 404));
  }

  // --- RULE VALIDATION ---
  
  if (trip.cargoWeight > vehicle.maxLoadCapacity) {
    return next(new AppError(`Cargo weight (${trip.cargoWeight}kg) exceeds vehicle max capacity (${vehicle.maxLoadCapacity}kg).`, 400));
  }

  if (vehicle.status === 'In Shop' || vehicle.status === 'Retired') {
    return next(new AppError(`Cannot dispatch. Vehicle is currently ${vehicle.status}.`, 400));
  }
  if (vehicle.status === 'On Trip') {
    return next(new AppError('Vehicle is already on an active trip.', 400));
  }

  if (driver.status === 'Suspended') {
    return next(new AppError('Cannot dispatch. Driver is Suspended.', 400));
  }
  if (driver.status === 'On Trip') {
    return next(new AppError('Driver is already on an active trip.', 400));
  }
  
  const currentDate = new Date();
  if (new Date(driver.licenseExpiryDate) < currentDate) {
    return next(new AppError('Cannot dispatch. Driver license is expired.', 400));
  }

  // --- AUTOMATIC STATUS TRANSITIONS ---
  trip.status = 'Dispatched';
  vehicle.status = 'On Trip';
  driver.status = 'On Trip';

  await Promise.all([trip.save(), vehicle.save(), driver.save()]);

  res.json({ message: 'Trip dispatched successfully. Vehicle and Driver are now On Trip.', trip });
});

// @desc    Complete a trip
// @route   PUT /api/trips/:id/complete
// @access  Private (Driver, Fleet Manager)
const completeTrip = catchAsync(async (req, res, next) => {
  const { finalOdometer } = req.body; 
  
  const trip = await Trip.findById(req.params.id);
  if (!trip) return next(new AppError('Trip not found.', 404));

  if (trip.status !== 'Dispatched') {
    return next(new AppError('Only active Dispatched trips can be completed.', 400));
  }

  const vehicle = await Vehicle.findById(trip.vehicle);
  const driver = await Driver.findById(trip.driver);

  if (finalOdometer) {
    if (finalOdometer < vehicle.odometer) {
       return next(new AppError('Final odometer cannot be less than current odometer.', 400));
    }
    vehicle.odometer = finalOdometer;
  }

  trip.status = 'Completed';
  if (vehicle) vehicle.status = 'Available';
  if (driver) driver.status = 'Available';

  await Promise.all([
    trip.save(),
    vehicle ? vehicle.save() : Promise.resolve(),
    driver ? driver.save() : Promise.resolve()
  ]);

  res.json({ message: 'Trip completed successfully. Vehicle and Driver are now Available.', trip });
});

// @desc    Cancel a trip
// @route   PUT /api/trips/:id/cancel
// @access  Private (Driver, Fleet Manager)
const cancelTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return next(new AppError('Trip not found.', 404));

  if (trip.status === 'Dispatched') {
    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);
    
    if (vehicle) {
      vehicle.status = 'Available';
      await vehicle.save();
    }
    if (driver) {
      driver.status = 'Available';
      await driver.save();
    }
  }

  trip.status = 'Cancelled';
  await trip.save();

  res.json({ message: 'Trip cancelled. Assets restored to Available status.', trip });
});

// @desc    Get all trips
// @route   GET /api/trips
// @access  Private
const getAllTrips = catchAsync(async (req, res, next) => {
  const trips = await Trip.find().populate('vehicle').populate('driver').sort('-createdAt');
  res.json(trips);
});

module.exports = {
  createTrip,
  getAllTrips,
  dispatchTrip,
  completeTrip,
  cancelTrip
};