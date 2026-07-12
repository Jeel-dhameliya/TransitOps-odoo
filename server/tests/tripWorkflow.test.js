const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../src/server'); // Imports the express app

const User = require('../src/models/User');
const Vehicle = require('../src/models/Vehicle');
const Driver = require('../src/models/Driver');
const Trip = require('../src/models/Trip');

dotenv.config({ path: '../.env' });

describe('Trip Workflow Integration Tests', () => {
  let token;
  let vehicleId;
  let driverId;
  let tripId;

  beforeAll(async () => {
    // Connect to a test-specific database
    const testDbUri = (process.env.MONGO_URL || process.env.MONGO_URI).replace('transitDB', 'transitDB_test');
    await mongoose.connect(testDbUri);

    // Clean up before starting
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Driver.deleteMany();
    await Trip.deleteMany();

    // 1. Create a mock Fleet Manager and get a token
    const user = await User.create({
      email: 'testmanager@transitops.com',
      password: 'password123',
      role: 'Fleet Manager'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testmanager@transitops.com', password: 'password123' });
    
    token = res.body.token;

    // 2. Create an Available Vehicle
    const vehicle = await Vehicle.create({
      registrationNumber: 'TEST-TRK-01',
      name: 'Test Truck',
      type: 'Truck',
      maxLoadCapacity: 10000,
      odometer: 1000,
      acquisitionCost: 50000,
      status: 'Available'
    });
    vehicleId = vehicle._id;

    // 3. Create an Available Driver
    const driver = await Driver.create({
      name: 'Test Driver',
      licenseNumber: 'TEST-DL-01',
      licenseCategory: 'Commercial',
      licenseExpiryDate: new Date('2030-01-01'),
      contactNumber: '1234567890',
      safetyScore: 100,
      status: 'Available'
    });
    driverId = driver._id;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new Draft trip successfully', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        source: 'Point A',
        destination: 'Point B',
        vehicle: vehicleId,
        driver: driverId,
        cargoWeight: 5000,
        plannedDistance: 100
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.trip.status).toEqual('Draft');
    tripId = res.body.trip._id;
  });

  it('should prevent dispatch if cargo exceeds max capacity', async () => {
    // Temporarily update trip to exceed capacity
    await Trip.findByIdAndUpdate(tripId, { cargoWeight: 15000 });

    const res = await request(app)
      .put(`/api/trips/${tripId}/dispatch`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toMatch(/exceeds vehicle max capacity/i);

    // Restore valid weight
    await Trip.findByIdAndUpdate(tripId, { cargoWeight: 5000 });
  });

  it('should successfully dispatch a Draft trip and update assets to On Trip', async () => {
    const res = await request(app)
      .put(`/api/trips/${tripId}/dispatch`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.trip.status).toEqual('Dispatched');

    // Verify Vehicle Status
    const vehicle = await Vehicle.findById(vehicleId);
    expect(vehicle.status).toEqual('On Trip');

    // Verify Driver Status
    const driver = await Driver.findById(driverId);
    expect(driver.status).toEqual('On Trip');
  });

  it('should successfully complete a trip and restore assets to Available', async () => {
    const res = await request(app)
      .put(`/api/trips/${tripId}/complete`)
      .set('Authorization', `Bearer ${token}`)
      .send({ finalOdometer: 1150 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.trip.status).toEqual('Completed');

    // Verify Vehicle Status and Odometer
    const vehicle = await Vehicle.findById(vehicleId);
    expect(vehicle.status).toEqual('Available');
    expect(vehicle.odometer).toEqual(1150);

    // Verify Driver Status
    const driver = await Driver.findById(driverId);
    expect(driver.status).toEqual('Available');
  });
});
