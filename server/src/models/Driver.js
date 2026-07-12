const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Driver name is required'],
    trim: true
  },
  licenseNumber: { 
    type: String, 
    required: [true, 'License number is required'], 
    unique: true,
    trim: true,
    uppercase: true
  },
  licenseCategory: { 
    type: String, 
    required: [true, 'License category is required'],
    trim: true
  },
  licenseExpiryDate: { 
    type: Date, 
    required: [true, 'License expiry date is required'] 
  },
  contactNumber: { 
    type: String, 
    required: [true, 'Contact number is required'],
    trim: true
  },
  safetyScore: { 
    type: Number, 
    default: 100,
    min: [0, 'Score cannot be below 0'],
    max: [100, 'Score cannot exceed 100']
  },
  status: {
    type: String,
    enum: {
      values: ["Available", "On Trip", "Off Duty", "Suspended"],
      message: 'Status is either: Available, On Trip, Off Duty, Suspended'
    },
    default: "Available",
  },
}, { timestamps: true });

// Check if license is expired using a virtual or pre-save, but it's often better to check at query time or during business operations
driverSchema.methods.isLicenseExpired = function() {
  return this.licenseExpiryDate < new Date();
};

driverSchema.index({ status: 1 });

module.exports = mongoose.model("Driver", driverSchema);
