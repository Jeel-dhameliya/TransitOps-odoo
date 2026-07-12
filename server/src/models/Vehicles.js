const mongoose = require("mongoose")

const vechicleSchema = new mogoose.Schema({
    registrationNumber: { type: String, required: true, unique: true }, //[cite: 1]
  name: { type: String, required: true },
  type: { type: String, required: true },
  maxLoadCapacity: { type: Number, required: true }, 
  odometer: { type: Number, default: 0 },
  acquisitionCost: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
    default: 'Available'
  }
}, {timestamps  : true})

module.exports = mongoose.model('Vehicle',vehicleSchema);