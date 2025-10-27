// Defines API routes for city management including CRUD operations for city data.

const express = require('express');
const { addCity, getCities, getCityById, deleteCity } = require('../controllers/cityController');
const router = express.Router();
router.get('/', getCities);
router.get('/:id', getCityById);
router.post('/', addCity);
router.delete('/:id', deleteCity);
module.exports = router;