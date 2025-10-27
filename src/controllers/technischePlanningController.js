// Manages technical planning operations including appointment scheduling, week number calculations, and technical inspection coordination.

const TechnischePlanning = require('../models/technischePlanningModel');
const Flat = require('../models/flatModel');
const asyncHandler = require('express-async-handler');
const getWeekNumber = (date) => {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((date.getDay() + 1 + days) / 7);
};
const handleTechnischePlanning = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const planningData = req.body;
    const flat = await Flat.findById(id).populate('technischePlanning');
    if (!flat) {
        res.status(404);
        throw new Error('Flat not found');
    }
    try {
        if (!flat.technischePlanning) {
            const planningDataToSave = { ...planningData };
            if (planningDataToSave.appointmentBooked && planningDataToSave.appointmentBooked.date) {
                const appointmentDate = new Date(planningDataToSave.appointmentBooked.date);
                planningDataToSave.appointmentBooked.weekNumber = getWeekNumber(appointmentDate);
            }
            const newPlanning = await TechnischePlanning.create({
                flat: id,
                ...planningDataToSave,
                technischeSchouwerName: planningData.technischeSchouwerName || ''
            });
            flat.technischePlanning = newPlanning._id;
            flat.markModified('technischePlanning');
            await flat.save();
            const updatedFlat = await Flat.findById(id).populate('technischePlanning');
            res.json(updatedFlat);
        } else {
            const planningDataToUpdate = { ...planningData };
            if (planningDataToUpdate.appointmentBooked && planningDataToUpdate.appointmentBooked.date) {
                const appointmentDate = new Date(planningDataToUpdate.appointmentBooked.date);
                planningDataToUpdate.appointmentBooked.weekNumber = getWeekNumber(appointmentDate);
            }
            const updatedPlanning = await TechnischePlanning.findByIdAndUpdate(
                flat.technischePlanning._id,
                {
                    ...planningDataToUpdate,
                    technischeSchouwerName: planningData.technischeSchouwerName || flat.technischePlanning.technischeSchouwerName || ''
                },
                {new: true}
            );
            flat.markModified('technischePlanning');
            await flat.save();
            const updatedFlat = await Flat.findById(id).populate('technischePlanning');
            res.json(updatedFlat);
        }
    } catch (error) {
        console.error('Error handling planning:', error);
        res.status(500);
        throw new Error(`Error handling planning: ${error.message}`);
    }
});
const getAllTechnischePlanningAppointments = asyncHandler(async (req, res) => {
    try {
        const {page = 1, limit = 500} = req.query; 
        const skip = (page - 1) * limit;
        const tpAppointments = await TechnischePlanning.find({
            'appointmentBooked.date': { $exists: true, $ne: null }
        })
            .populate({
                path: 'flat',
                select: 'adres huisNummer toevoeging complexNaam postcode'
            })
            .skip(skip)
            .limit(limit)
            .sort({ 'appointmentBooked.date': -1 }); 
        const flatsWithAppointments = tpAppointments.map(tpDoc => ({
            _id: tpDoc.flat._id,
            adres: tpDoc.flat.adres,
            huisNummer: tpDoc.flat.huisNummer,
            toevoeging: tpDoc.flat.toevoeging,
            complexNaam: tpDoc.flat.complexNaam,
            postcode: tpDoc.flat.postcode,
            technischePlanning: {
                _id: tpDoc._id,
                appointmentBooked: tpDoc.appointmentBooked,
                telephone: tpDoc.telephone,
                additionalNotes: tpDoc.additionalNotes,
                technischeSchouwerName: tpDoc.technischeSchouwerName
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
    handleTechnischePlanning,
    getAllTechnischePlanningAppointments,
};
