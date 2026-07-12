const Driver = require('../models/Driver');

// @desc    Register a new driver
// @route   POST /api/drivers
// @access  Private (Fleet Manager, Safety Officer)
const createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;

    // Ensure the license number is unique
    const driverExists = await Driver.findOne({ licenseNumber });
    if (driverExists) {
      return res.status(400).json({ message: 'A driver with this license number is already registered.' });
    }

    const driver = await Driver.create({
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate,
      contactNumber,
      safetyScore: safetyScore || 100, // Default to 100 if not provided
      status // Defaults to 'Available' in the schema[cite: 1]
    });

    res.status(201).json({
      message: 'Driver profile created successfully',
      driver
    });
  } catch (error) {
    console.error('Create Driver Error:', error);
    res.status(500).json({ message: 'Server Error occurred while registering driver.' });
  }
};

// @desc    Get all drivers (with optional status filtering)
// @route   GET /api/drivers
// @access  Private (Authenticated Users)
const getAllDrivers = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    // Support filtering for the dashboard[cite: 1]
    if (status) query.status = status;

    const drivers = await Driver.find(query);
    res.json(drivers);
  } catch (error) {
    console.error('Get Drivers Error:', error);
    res.status(500).json({ message: 'Server Error fetching driver profiles.' });
  }
};

// @desc    Get a single driver by ID
// @route   GET /api/drivers/:id
// @access  Private (Authenticated Users)
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }
    res.json(driver);
  } catch (error) {
    console.error('Get Driver By ID Error:', error);
    res.status(500).json({ message: 'Server Error retrieving driver details.' });
  }
};

// @desc    Update driver profile (e.g., renewing a license or suspending)
// @route   PUT /api/drivers/:id
// @access  Private (Fleet Manager, Safety Officer)
const updateDriver = async (req, res) => {
  try {
    const { licenseNumber } = req.body;

    // Check for license uniqueness if they are updating the license number
    if (licenseNumber) {
      const duplicate = await Driver.findOne({ licenseNumber, _id: { $ne: req.params.id } });
      if (duplicate) {
        return res.status(400).json({ message: 'This license number is assigned to another driver.' });
      }
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // runValidators ensures the status stays within the allowed enum[cite: 1]
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    res.json({
      message: 'Driver profile updated successfully',
      driver: updatedDriver
    });
  } catch (error) {
    console.error('Update Driver Error:', error);
    res.status(500).json({ message: 'Server Error updating driver profile.' });
  }
};

// @desc    Delete a driver record
// @route   DELETE /api/drivers/:id
// @access  Private (Fleet Manager)
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }
    res.json({ message: 'Driver record removed successfully.' });
  } catch (error) {
    console.error('Delete Driver Error:', error);
    res.status(500).json({ message: 'Server Error removing driver.' });
  }
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver
};