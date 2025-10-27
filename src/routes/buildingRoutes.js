// Defines API routes for building operations including building data retrieval and management endpoints.

const express = require('express');
const router = express.Router();
const {
  getBuilding,
  createBuildingLayout,
  updateBuildingLayout,
  blockBuilding,
  unblockBuilding
} = require('../controllers/buildingController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../seeders/data/roles_list');
router.get('/:id', getBuilding);
router.post('/layout/:id', createBuildingLayout);
router.put('/layout/:id', updateBuildingLayout);
router.put('/block/:buildingId', verifyRoles(ROLES_LIST.Werkvoorbereider), blockBuilding);
router.put('/unblock/:buildingId', verifyRoles(ROLES_LIST.Werkvoorbereider), unblockBuilding);
module.exports = router;
