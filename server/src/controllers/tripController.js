const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// @desc    Create a new draft trip
// @route   POST /api/trips
// @access  Private (Driver, Fleet Manager)
const createTrip = async (req, res) => {
  try {
    const { source, destination, vehicle, driver, cargoWeight, plannedDistance } = req.body;

    const trip = await Trip.create({
      source,
      destination,
      vehicle,
      driver,
      cargoWeight,
      plannedDistance,
      status: 'Draft' // Trips start in Draft state
    });

    res.status(201).json({
      message: 'Trip drafted successfully.',
      trip
    });
  } catch (error) {
    console.error('Create Trip Error:', error);
    res.status(500).json({ message: 'Server Error drafting trip.' });
  }
};

// @desc    Dispatch a trip (Enforces all business rules)
// @route   PUT /api/trips/:id/dispatch
// @access  Private (Driver, Fleet Manager)
const dispatchTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });

    if (trip.status !== 'Draft') {
      return res.status(400).json({ message: 'Only Draft trips can be dispatched.' });
    }

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    if (!vehicle || !driver) {
      return res.status(404).json({ message: 'Assigned Vehicle or Driver no longer exists.' });
    }

    // --- RULE VALIDATION ---
    
    // 1. Cargo Weight Validation
    if (trip.cargoWeight > vehicle.maxLoadCapacity) {
      return res.status(400).json({ 
        message: `Cargo weight (${trip.cargoWeight}kg) exceeds vehicle max capacity (${vehicle.maxLoadCapacity}kg).` 
      }); //[cite: 1]
    }

    // 2. Vehicle Status Validation
    if (vehicle.status === 'In Shop' || vehicle.status === 'Retired') {
      return res.status(400).json({ message: `Cannot dispatch. Vehicle is currently ${vehicle.status}.` }); //[cite: 1]
    }
    if (vehicle.status === 'On Trip') {
      return res.status(400).json({ message: 'Vehicle is already on an active trip.' }); //[cite: 1]
    }

    // 3. Driver Status & License Validation
    if (driver.status === 'Suspended') {
      return res.status(400).json({ message: 'Cannot dispatch. Driver is Suspended.' }); //[cite: 1]
    }
    if (driver.status === 'On Trip') {
      return res.status(400).json({ message: 'Driver is already on an active trip.' }); //[cite: 1]
    }
    
    const currentDate = new Date();
    if (new Date(driver.licenseExpiryDate) < currentDate) {
      return res.status(400).json({ message: 'Cannot dispatch. Driver license is expired.' }); //[cite: 1]
    }

    // --- AUTOMATIC STATUS TRANSITIONS ---
    
    // Dispatching changes trip, vehicle, and driver to 'On Trip'[cite: 1]
    trip.status = 'Dispatched';
    vehicle.status = 'On Trip';
    driver.status = 'On Trip';

    await Promise.all([trip.save(), vehicle.save(), driver.save()]);

    res.json({ message: 'Trip dispatched successfully. Vehicle and Driver are now On Trip.', trip });
  } catch (error) {
    console.error('Dispatch Trip Error:', error);
    res.status(500).json({ message: 'Server Error dispatching trip.' });
  }
};

// @desc    Complete a trip
// @route   PUT /api/trips/:id/complete
// @access  Private (Driver, Fleet Manager)
const completeTrip = async (req, res) => {
  try {
    const { finalOdometer } = req.body; // Captured as part of completion workflow[cite: 1]
    
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });

    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ message: 'Only active Dispatched trips can be completed.' });
    }

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    // Update vehicle's odometer if provided
    if (finalOdometer && finalOdometer > vehicle.odometer) {
      vehicle.odometer = finalOdometer;
    }

    // Completing the trip restores Vehicle and Driver back to 'Available'[cite: 1]
    trip.status = 'Completed';
    if (vehicle) vehicle.status = 'Available';
    if (driver) driver.status = 'Available';

    await Promise.all([
      trip.save(),
      vehicle ? vehicle.save() : Promise.resolve(),
      driver ? driver.save() : Promise.resolve()
    ]);

    res.json({ message: 'Trip completed successfully. Vehicle and Driver are now Available.', trip });
  } catch (error) {
    console.error('Complete Trip Error:', error);
    res.status(500).json({ message: 'Server Error completing trip.' });
  }
};

// @desc    Cancel a trip
// @route   PUT /api/trips/:id/cancel
// @access  Private (Driver, Fleet Manager)
const cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });

    // Cancelling a dispatched trip restores the vehicle and driver to 'Available'[cite: 1]
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
  } catch (error) {
    console.error('Cancel Trip Error:', error);
    res.status(500).json({ message: 'Server Error cancelling trip.' });
  }
};

module.exports = {
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip
};