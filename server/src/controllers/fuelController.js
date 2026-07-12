const Fuel = require('../models/Fuel');
const Vehicle = require('../models/Vehicle');

// @desc    Log a fuel expense for a vehicle
// @route   POST /api/fuel
// @access  Private (Driver, Fleet Manager)
const createFuelLog = async (req, res) => {
  try {
    const { vehicle, liters, cost, date } = req.body;

    const vehicleExists = await Vehicle.findById(vehicle);
    if (!vehicleExists) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    // Record the fuel log (liters, cost, date)[cite: 1]
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
  } catch (error) {
    console.error('Create Fuel Log Error:', error);
    res.status(500).json({ message: 'Server Error recording fuel log.' });
  }
};

module.exports = { createFuelLog };