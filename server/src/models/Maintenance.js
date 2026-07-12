const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: [true, 'Vehicle is required'],
  },
  description: { 
    type: String, 
    required: [true, 'Maintenance description is required'],
    trim: true
  },
  cost: { 
    type: Number, 
    required: [true, 'Maintenance cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  status: {
    type: String,
    enum: {
      values: ["Open", "Closed"],
      message: 'Status must be Open or Closed'
    },
    default: "Open",
  },
  dateLogged: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true });

maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ vehicle: 1 });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
