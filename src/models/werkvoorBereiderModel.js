// Defines the MongoDB schema for work preparation specialist data including preparation tasks and coordination information.

const mongoose = require('mongoose');
const werkvoorbereiderSchema = mongoose.Schema({
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat',
    required: true
  },
  planning: {
    materials: [{
      type: String,
      quantity: Number
    }],
    estimatedDuration: Number,
    specialTools: [String]
  },
  preparations: {
    permits: [{
      type: String,
      status: String,
      date: Date
    }],
    notes: String
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});
const Werkvoorbereider = mongoose.model('Werkvoorbereider', werkvoorbereiderSchema);
module.exports = Werkvoorbereider;