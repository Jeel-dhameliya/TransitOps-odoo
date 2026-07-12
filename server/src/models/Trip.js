const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  source: { 
    type: String, 
    required: [true, 'Source location is required'],
    trim: true
  },
  destination: { 
    type: String, 
    required: [true, 'Destination is required'],
    trim: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: [true, 'Vehicle assignment is required'],
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: [true, 'Driver assignment is required'],
  },
  cargoWeight: { 
    type: Number, 
    required: [true, 'Cargo weight is required'],
    min: [0, 'Cargo weight cannot be negative']
  },
  plannedDistance: { 
    type: Number, 
    required: [true, 'Planned distance is required'],
    min: [0, 'Planned distance cannot be negative']
  },
  status: {
    type: String,
    enum: {
      values: ["Draft", "Dispatched", "Completed", "Cancelled"],
      message: 'Status must be Draft, Dispatched, Completed, or Cancelled'
    },
    default: "Draft",
  },
}, { timestamps: true });

tripSchema.index({ status: 1 });
tripSchema.index({ vehicle: 1 });
tripSchema.index({ driver: 1 });

module.exports = mongoose.model("Trip", tripSchema);
