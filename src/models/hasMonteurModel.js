// Defines the MongoDB schema for HAS installer/monteur data including appointment information and installation status.

const mongoose = require('mongoose');
const hasMonteurSchema = mongoose.Schema({
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat',
    required: true
  },
  hasMonteurName: {
    type: String,
    default: ''
  },
  appointmentBooked: {
    type: {
      type: String,
      enum: ['HAS', 'Storing', 'Complaint'],
      required: true
    },
    date: Date,
    startTime: String,
    endTime: String,
    weekNumber: Number,
    complaintDetails: String
  },
  installation: {
    startTime: Date,
    endTime: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'issues'],
      default: 'pending'
    }
  },
  technicalDetails: {
    cableInstalled: Boolean,
    signalStrength: Number,
    connectionTest: {
      performed: Boolean,
      result: String
    }
  },
  documentation: {
    photos: [String],
    notes: String,
    customerSignature: String
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});
const HASMonteur = mongoose.model('HASMonteur', hasMonteurSchema);
module.exports = HASMonteur;
