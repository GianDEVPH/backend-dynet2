// Defines API routes for area management including CRUD operations for geographical area data.

const express = require('express');
const { addArea, getAreas, getAreasByCity, deleteArea } = require('../controllers/areaController');
const router = express.Router();
router.get('/', getAreas);
router.post('/:cityId', addArea);
router.get('/:cityId', getAreasByCity);
router.delete('/:id', deleteArea);
module.exports = router;