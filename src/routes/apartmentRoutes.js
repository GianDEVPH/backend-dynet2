// Defines API routes for apartment operations including endpoints for apartment data retrieval and management.

const express = require('express');
const router = express.Router();
const {
    getApartmentById,
    updateApartmentAppointment
} = require('../controllers/apartmentController');
const {
    handleTechnischePlanning,
    getAllTechnischePlanningAppointments
} = require('../controllers/technischePlanningController');
const {
    handleHasMonteur,
    getAllHasMonteurAppointments
} = require('../controllers/hasMonteurController');
router.get('/:id', getApartmentById);
router.put('/:id/appointment', updateApartmentAppointment);
router.put('/:id/technische-planning', handleTechnischePlanning);
router.get('/appointments/all-technischeplanning', getAllTechnischePlanningAppointments);
router.put('/:id/has-monteur', handleHasMonteur);
router.get('/appointments/all-hasmonteur', getAllHasMonteurAppointments);
module.exports = router;