// models/Maintenance.js
const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    description: { type: String, required: true },
    cost: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    dateLogged: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
