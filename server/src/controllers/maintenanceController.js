const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

// @desc    Create a maintenance record & update vehicle status
// @route   POST /api/maintenance
// @access  Private (Fleet Manager)
const createMaintenance = async (req, res) => {
  try {
    const { vehicle: vehicleId, description, cost } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    // 1. Create the maintenance log
    const maintenance = await Maintenance.create({
      vehicle: vehicleId,
      description,
      cost,
      status: 'Open'
    });

    // 2. Automatically change vehicle status to 'In Shop'[cite: 1]
    vehicle.status = 'In Shop';
    await vehicle.save();

    res.status(201).json({
      message: 'Maintenance logged. Vehicle is now In Shop.',
      maintenance
    });
  } catch (error) {
    console.error('Create Maintenance Error:', error);
    res.status(500).json({ message: 'Server Error logging maintenance.' });
  }
};

// @desc    Close maintenance & restore vehicle status
// @route   PUT /api/maintenance/:id/close
// @access  Private (Fleet Manager)
const closeMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found.' });
    }

    if (maintenance.status === 'Closed') {
      return res.status(400).json({ message: 'Maintenance is already closed.' });
    }

    maintenance.status = 'Closed';
    await maintenance.save();

    // 2. Restore the vehicle to 'Available' (unless it was marked 'Retired')[cite: 1]
    const vehicle = await Vehicle.findById(maintenance.vehicle);
    if (vehicle && vehicle.status !== 'Retired') {
      vehicle.status = 'Available';
      await vehicle.save();
    }

    res.json({ message: 'Maintenance closed. Vehicle is now Available.', maintenance });
  } catch (error) {
    console.error('Close Maintenance Error:', error);
    res.status(500).json({ message: 'Server Error closing maintenance.' });
  }
};

// @desc    Get all maintenance records
// @route   GET /api/maintenance
// @access  Private
const getAllMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.find().populate('vehicle');
    res.json(records);
  } catch (error) {
    console.error('Get Maintenance Error:', error);
    res.status(500).json({ message: 'Server Error fetching maintenance records.' });
  }
};

module.exports = { getAllMaintenance, createMaintenance, closeMaintenance };