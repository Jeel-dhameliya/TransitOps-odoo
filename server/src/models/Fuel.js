const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required']
  },
  liters: {
    type: Number,
    required: [true, 'Liters is required'],
    min: [0.1, 'Liters must be greater than 0']
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

fuelSchema.index({ vehicle: 1 });
fuelSchema.index({ date: -1 });

module.exports = mongoose.model('Fuel', fuelSchema);
