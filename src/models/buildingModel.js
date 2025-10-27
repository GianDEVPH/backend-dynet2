// Defines the MongoDB schema for buildings including addresses, building details, and relationships to districts.

const mongoose = require('mongoose');
const buildingSchema = mongoose.Schema({
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
  },
  address: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    default: '',
  },
  buildingIdentifier: {
    type: String,
    default: '',
  },
  layout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Layout',
  },
  flats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flat',
    },
  ],
  schedules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
    },
  ],
  appointmentDate: {
    type: String,
    default: '',
  },
  appointmentStartTime: {
    type: String,
    default: '',
  },
  appointmentEndTime: {
    type: String,
    default: '',
  },
  appointmentWeekNumber: {
    type: String,
    default: '',
  },
  fileUrl: { type: String },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  blockReason: {
    type: String,
    default: '',
  },
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  blockedAt: {
    type: Date,
  }
},
{
  timestamps: true,
});
const Building = mongoose.model('Building', buildingSchema);
module.exports = Building;
