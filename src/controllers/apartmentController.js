// Handles apartment/flat data operations including fetching individual apartment details and managing apartment-specific information for different user roles.

const Flat = require('../models/flatModel'); 
const asyncHandler = require('express-async-handler');
const getWeekNumber = (date) => {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + days) / 7);
};
const getApartmentById = asyncHandler(async (req, res) => {
  const apartment = await Flat.findById(req.params.id)
    .populate('technischePlanning')
    .populate('hasMonteur')
    .populate('technischeSchouwer')
    .populate('werkvoorbereider')
    .populate('hasPlanning');
  if (!apartment) {
    res.status(404);
    throw new Error('Apartment not found');
  }
  res.json(apartment);
});
const updateApartmentAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  const { technischePlanning } = req.body; 
  const flat = await Flat.findById(id);
  if (!flat) {
    res.status(404);
    throw new Error('Apartment not found');
  }
  flat.technischePlanning = flat.technischePlanning || {};
  flat.technischePlanning.appointmentBooked = {
    ...flat.technischePlanning.appointmentBooked, 
    date: technischePlanning.appointmentBooked.date,
    startTime: technischePlanning.appointmentBooked.startTime,
    endTime: technischePlanning.appointmentBooked.endTime,
  };
  if (technischePlanning.appointmentBooked.date) {
    const date = new Date(technischePlanning.appointmentBooked.date);
    flat.technischePlanning.appointmentBooked.weekNumber = getWeekNumber(date);
  }
  const updatedFlat = await flat.save();
  res.json(updatedFlat);
});
module.exports = {
  getApartmentById,
  updateApartmentAppointment,
};
