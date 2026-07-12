const Vehicle = require('../models/Vehicle');

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Private (Fleet Manager Only)
const createVehicle = async (req, res) => {
  try {
    const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, status } = req.body;

   
    const vehicleExists = await Vehicle.findOne({ registrationNumber });
    if (vehicleExists) {
      return res.status(400).json({ message: 'A vehicle with this registration number already exists.' });
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
  } catch (error) {
    console.error('Create Vehicle Error:', error);
    res.status(500).json({ message: 'Server Error occurred while registering vehicle.' });
  }
};

// @desc    Get all vehicles (with basic filtering for dashboard/registry tabs)
// @route   GET /api/vehicles
// @access  Private (Authenticated Users)
const getAllVehicles = async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = {};

    // Support dashboard / registry filters dynamically[cite: 1]
    if (type) query.type = type;
    if (status) query.status = status;

    const vehicles = await Vehicle.find(query);
    res.json(vehicles);
  } catch (error) {
    console.error('Get Vehicles Error:', error);
    res.status(500).json({ message: 'Server Error fetching vehicle registry.' });
  }
};

// @desc    Get a single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private (Authenticated Users)
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle asset not found.' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Get Vehicle By ID Error:', error);
    res.status(500).json({ message: 'Server Error retrieving vehicle asset details.' });
  }
};

// @desc    Update vehicle details or lifecycle status
// @route   PUT /api/vehicles/:id
// @access  Private (Fleet Manager Only)
const updateVehicle = async (req, res) => {
  try {
    const { registrationNumber, status } = req.body;

    // 1. Ensure registration number uniqueness isn't broken on modification[cite: 1]
    if (registrationNumber) {
      const duplicate = await Vehicle.findOne({ registrationNumber, _id: { $ne: req.params.id } });
      if (duplicate) {
        return res.status(400).json({ message: 'Registration number is already in use by another vehicle.' });
      }
    }

    // 2. Perform the update and return the freshly updated document
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // runValidators enforces schema enum constraints[cite: 1]
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle asset not found.' });
    }

    res.json({
      message: 'Vehicle profile updated successfully',
      vehicle: updatedVehicle
    });
  } catch (error) {
    console.error('Update Vehicle Error:', error);
    res.status(500).json({ message: 'Server Error updating vehicle profiles.' });
  }
};


const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle asset not found.' });
    }
    res.json({ message: 'Vehicle record successfully expunged from database.' });
  } catch (error) {
    console.error('Delete Vehicle Error:', error);
    res.status(500).json({ message: 'Server Error removing vehicle records.' });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};