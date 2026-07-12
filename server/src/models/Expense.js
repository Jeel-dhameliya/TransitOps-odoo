const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  vehicle: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vehicle', 
    required: true 
  },
  category: {
    type: String,
    enum: ['Toll', 'Fine', 'Cleaning', 'Other'],
    required: true
  },
  amount: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String 
  },
  dateLogged: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);