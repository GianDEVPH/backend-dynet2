// Defines the MongoDB schema for technical inspector data including inspection appointments and technical assessment information.

const mongoose = require('mongoose');
const technischeSchouwerSchema = mongoose.Schema({
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat',
    required: true
  },
  inspection: {
    date: Date,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    notes: String,
    photos: [String]
  },
  technicalSpecs: {
    cableType: String,
    installationPoint: String,
    specialRequirements: String
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});
const TechnischeSchouwer = mongoose.model('TechnischeSchouwer', technischeSchouwerSchema);
module.exports = TechnischeSchouwer;
