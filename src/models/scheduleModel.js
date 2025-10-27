// Defines the MongoDB schema for scheduling data including appointment times, personnel assignments, and scheduling details.

const mongoose = require('mongoose')
const scheduleSchema = mongoose.Schema({
  cableNumber: Number,
  date: String,
  flats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flat' }],
  from: String,
  till: String,
})
const Schedule = mongoose.model('Schedule', scheduleSchema)
module.exports = Schedule
