const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Load Models
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Fuel = require('../models/Fuel');
const Maintenance = require('../models/Maintenance');

// Load env vars from root directory
dotenv.config({ path: '../.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URL || process.env.MONGO_URI);

const vehicles = [
  { registrationNumber: 'TRK-1001', name: 'Volvo FH16', type: 'Truck', maxLoadCapacity: 20000, odometer: 15000, acquisitionCost: 150000, status: 'Available' },
  { registrationNumber: 'TRK-1002', name: 'Scania R500', type: 'Truck', maxLoadCapacity: 18000, odometer: 45000, acquisitionCost: 130000, status: 'Available' },
  { registrationNumber: 'VAN-2001', name: 'Mercedes Sprinter', type: 'Van', maxLoadCapacity: 3500, odometer: 8000, acquisitionCost: 45000, status: 'Available' },
  { registrationNumber: 'VAN-2002', name: 'Ford Transit', type: 'Van', maxLoadCapacity: 3000, odometer: 12000, acquisitionCost: 40000, status: 'Available' },
  { registrationNumber: 'BUS-3001', name: 'Volvo 9700', type: 'Bus', maxLoadCapacity: 5000, odometer: 25000, acquisitionCost: 200000, status: 'Available' },
];

const drivers = [
  { name: 'John Doe', licenseNumber: 'DL-554433', licenseCategory: 'Heavy Duty', licenseExpiryDate: new Date('2028-05-15'), contactNumber: '555-0101', safetyScore: 98, status: 'Available' },
  { name: 'Jane Smith', licenseNumber: 'DL-998877', licenseCategory: 'Commercial', licenseExpiryDate: new Date('2027-11-20'), contactNumber: '555-0102', safetyScore: 92, status: 'Available' },
  { name: 'Mike Johnson', licenseNumber: 'DL-112233', licenseCategory: 'Commercial', licenseExpiryDate: new Date('2029-01-10'), contactNumber: '555-0103', safetyScore: 85, status: 'Available' },
  { name: 'Sarah Williams', licenseNumber: 'DL-445566', licenseCategory: 'Standard', licenseExpiryDate: new Date('2026-08-05'), contactNumber: '555-0104', safetyScore: 100, status: 'Available' },
  { name: 'Robert Brown', licenseNumber: 'DL-778899', licenseCategory: 'Heavy Duty', licenseExpiryDate: new Date('2025-12-30'), contactNumber: '555-0105', safetyScore: 78, status: 'Available' },
];

const users = [
  { email: 'admin@transitops.com', password: 'password123', role: 'Fleet Manager' },
  { email: 'finance@transitops.com', password: 'password123', role: 'Financial Analyst' },
];

const importData = async () => {
  try {
    // Clear all existing data
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Driver.deleteMany();
    await Trip.deleteMany();
    await Fuel.deleteMany();
    await Maintenance.deleteMany();

    console.log('Data Destroyed...');

    // Import Users
    await User.create(users);
    console.log('Users Imported...');

    // Import Vehicles
    const createdVehicles = await Vehicle.create(vehicles);
    console.log('Vehicles Imported...');

    // Import Drivers
    const createdDrivers = await Driver.create(drivers);
    console.log('Drivers Imported...');

    // Import some mock trips, fuel, and maintenance
    const mockTrips = [
      {
        source: 'New York Warehouse',
        destination: 'Boston Distribution Center',
        vehicle: createdVehicles[0]._id,
        driver: createdDrivers[0]._id,
        cargoWeight: 15000,
        plannedDistance: 350,
        status: 'Completed'
      },
      {
        source: 'Chicago Hub',
        destination: 'Detroit Assembly',
        vehicle: createdVehicles[1]._id,
        driver: createdDrivers[1]._id,
        cargoWeight: 12000,
        plannedDistance: 450,
        status: 'Completed'
      },
      {
        source: 'Los Angeles Port',
        destination: 'Las Vegas Retail',
        vehicle: createdVehicles[2]._id,
        driver: createdDrivers[2]._id,
        cargoWeight: 2000,
        plannedDistance: 430,
        status: 'Dispatched'
      }
    ];

    await Trip.create(mockTrips);
    console.log('Trips Imported...');

    // Set Vehicle 2 and Driver 2 status to 'On Trip' since they are dispatched
    createdVehicles[2].status = 'On Trip';
    await createdVehicles[2].save();
    createdDrivers[2].status = 'On Trip';
    await createdDrivers[2].save();

    // Import Fuel logs
    const fuelLogs = [
      { vehicle: createdVehicles[0]._id, liters: 150, cost: 200 },
      { vehicle: createdVehicles[1]._id, liters: 200, cost: 280 },
      { vehicle: createdVehicles[0]._id, liters: 100, cost: 140 },
    ];
    await Fuel.create(fuelLogs);
    console.log('Fuel Logs Imported...');

    // Import Maintenance logs
    const maintenanceLogs = [
      { vehicle: createdVehicles[0]._id, description: 'Oil Change and Filter Replacement', cost: 350, status: 'Closed' },
      { vehicle: createdVehicles[1]._id, description: 'Brake Pad Replacement', cost: 800, status: 'Closed' },
      { vehicle: createdVehicles[3]._id, description: 'Transmission Service', cost: 1200, status: 'Open' },
    ];
    await Maintenance.create(maintenanceLogs);
    
    // Set Vehicle 3 to 'In Shop'
    createdVehicles[3].status = 'In Shop';
    await createdVehicles[3].save();

    console.log('Maintenance Logs Imported...');
    console.log('Data Import Completed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Driver.deleteMany();
    await Trip.deleteMany();
    await Fuel.deleteMany();
    await Maintenance.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
