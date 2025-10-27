// Defines the MongoDB schema for HAS planning data including appointment scheduling and HAS-specific information.

const mongoose = require('mongoose');
const hasPlanningSchema = mongoose.Schema({
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat',
    required: true
  },
  installation: {
    scheduledDate: Date,
    timeSlot: {
      start: String,
      end: String
    },
    team: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  resources: {
    equipment: [String],
    vehicleRequired: Boolean
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});
const HASPlanning = mongoose.model('HASPlanning', hasPlanningSchema);
module.exports = HASPlanning;
