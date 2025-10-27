// Handles HAS (Housing Association Services) installer/monteur operations including appointment management and installation status updates.

const HASMonteur = require('../models/hasMonteurModel');
const Flat = require('../models/flatModel');
const asyncHandler = require('express-async-handler');
const getWeekNumber = (date) => {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + days) / 7);
};
const handleHasMonteur = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const planningData = req.body;
  const flat = await Flat.findById(id).populate('hasMonteur');
  if (!flat) {
    res.status(404);
    throw new Error('Flat not found');
  }
  try {
    if (!flat.hasMonteur) {
      const appointmentDate = new Date(planningData.appointmentBooked.date);
      const newPlanning = await HASMonteur.create({
        flat: id,
        appointmentBooked: {
          type: planningData.appointmentBooked.type || 'HAS',
          date: appointmentDate,
          startTime: planningData.appointmentBooked.startTime,
          endTime: planningData.appointmentBooked.endTime,
          weekNumber: getWeekNumber(appointmentDate),
          complaintDetails: planningData.appointmentBooked.complaintDetails || ''
        },
        hasMonteurName: planningData.hasMonteurName || '' 
      });
      flat.hasMonteur = newPlanning._id;
      await flat.save();
      const updatedFlat = await Flat.findById(id)
          .populate({
            path: 'hasMonteur',
            select: 'appointmentBooked installation hasMonteurName' 
          })
          .populate('technischePlanning')
          .populate('technischeSchouwer')
          .populate('werkvoorbereider');
      res.json(updatedFlat);
    } else {
      const appointmentDate = new Date(planningData.appointmentBooked.date);
      const updatedPlanning = await HASMonteur.findByIdAndUpdate(
          flat.hasMonteur._id,
          {
            appointmentBooked: {
              type: planningData.appointmentBooked.type || 'HAS',
              date: appointmentDate,
              startTime: planningData.appointmentBooked.startTime,
              endTime: planningData.appointmentBooked.endTime,
              weekNumber: getWeekNumber(appointmentDate),
              complaintDetails: planningData.appointmentBooked.complaintDetails || ''
            },
            hasMonteurName: planningData.hasMonteurName || flat.hasMonteur.hasMonteurName || '' 
          },
          { new: true, runValidators: true }
      );
      const updatedFlat = await Flat.findById(id)
          .populate({
            path: 'hasMonteur',
            select: 'appointmentBooked installation hasMonteurName' 
          })
          .populate('technischePlanning')
          .populate('technischeSchouwer')
          .populate('werkvoorbereider');
      res.json(updatedFlat);
    }
  } catch (error) {
    console.error('Error handling planning:', error);
    res.status(500);
    throw new Error(`Error handling planning: ${error.message}`);
  }
});
const getAllHasMonteurAppointments = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 500 } = req.query; 
    const skip = (page - 1) * limit;
    const hasAppointments = await HASMonteur.find({
      'appointmentBooked.date': { $exists: true, $ne: null }
    })
      .populate({
        path: 'flat',
        select: 'adres huisNummer toevoeging complexNaam postcode'
      })
      .skip(skip)
      .limit(limit)
      .sort({ 'appointmentBooked.date': -1 }); 
    const flatsWithAppointments = hasAppointments.map(hasDoc => ({
      _id: hasDoc.flat._id,
      adres: hasDoc.flat.adres,
      huisNummer: hasDoc.flat.huisNummer,
      toevoeging: hasDoc.flat.toevoeging,
      complexNaam: hasDoc.flat.complexNaam,
      postcode: hasDoc.flat.postcode,
      hasMonteur: {
        _id: hasDoc._id,
        appointmentBooked: hasDoc.appointmentBooked,
        hasMonteurName: hasDoc.hasMonteurName,
        installation: hasDoc.installation
      }
    }));
    res.json(flatsWithAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500);
    throw new Error(`Error fetching appointments: ${error.message}`);
  }
});
module.exports = {
  handleHasMonteur,
  getAllHasMonteurAppointments,
};
