const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
  vehicle: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vehicle', 
    required: true 
  },
  liters: { 
    type: Number, 
    required: true 
  },
  cost: { 
    type: Number, 
    required: true 
  },
  dateLogged: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Fuel', fuelSchema);