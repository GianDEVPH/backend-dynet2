// Handles scheduling operations for various appointment types including technical planning and HAS planning appointments.

const asyncHandler = require('express-async-handler')
const Building = require('../models/buildingModel.js')
const Flat = require('../models/flatModel.js')
const Schedule = require('../models/scheduleModel.js')
const createSchedule = asyncHandler(async (req, res) => {
  const buildingId = req.params.id
  const { cableNumber, date, flats, from, till } = req.body
  const schedule = await Schedule.create({
    cableNumber,
    date,
    flats: flats.map((flat) => flat),
    from,
    till,
  })
  await Building.findByIdAndUpdate(
    { _id: buildingId },
    {
      $push: { schedules: await schedule._id },
    },
  ).exec()
  res.json('great')
})
module.exports = { createSchedule }
