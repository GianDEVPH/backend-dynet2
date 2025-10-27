// Defines the MongoDB schema for technical planning data including technical appointments and inspection scheduling.

const mongoose = require('mongoose');
const technischePlanningSchema = mongoose.Schema({
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flat',
    required: true
  },
  telephone: {
    type: String,
    default: '',
  },
  vveWocoName: {
    type: String,
    default: '',
  },
  technischeSchouwerName: {
    type: String,
    default: '',
  },
  readyForSchouwer: {
    type: Boolean,
    default: false,
  },
  signed: {
    type: Boolean,
    default: false,
  },
  calledAlready: {
    type: Boolean,
    default: false,
  },
  timesCalled: {
    type: Number,
    default: 0,
  },
  appointmentBooked: {
    date: Date,
    startTime: String,
    endTime: String,
    weekNumber: Number,
  },
  additionalNotes: {
    type: String,
    default: '',
  },
  smsSent: {
    type: Boolean,
    default: false,
  },
  signature: {
    fileUrl: {
      type: String,
      default: ''
    },
    uploadDate: {
      type: Date
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  report: {
    fileUrl: {
      type: String,
      default: ''
    },
    uploadDate: {
      type: Date
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});
const TechnischePlanning = mongoose.model('TechnischePlanning', technischePlanningSchema);
module.exports = TechnischePlanning;