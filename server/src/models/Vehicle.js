const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { 
    type: String, 
    required: [true, 'Registration number is required'], 
    unique: true,
    trim: true,
    uppercase: true
  },
  name: { 
    type: String, 
    required: [true, 'Vehicle name is required'],
    trim: true
  },
  type: { 
    type: String, 
    required: [true, 'Vehicle type is required'],
    enum: {
      values: ['Truck', 'Van', 'Car', 'Bus'],
      message: 'Type must be Truck, Van, Car, or Bus'
    }
  },
  maxLoadCapacity: { 
    type: Number, 
    required: [true, 'Max load capacity is required'],
    min: [0, 'Capacity cannot be negative']
  }, 
  odometer: { 
    type: Number, 
    default: 0,
    min: [0, 'Odometer cannot be negative']
  },
  acquisitionCost: { 
    type: Number, 
    required: [true, 'Acquisition cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  status: {
    type: String,
    enum: {
      values: ['Available', 'On Trip', 'In Shop', 'Retired'],
      message: 'Status is either: Available, On Trip, In Shop, Retired'
    },
    default: 'Available'
  }
}, { timestamps: true });

// Index for frequent queries
vehicleSchema.index({ status: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);