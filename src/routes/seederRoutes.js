// Routes for database seeding operations

const express = require('express')
const router = express.Router()
const { runSeeder } = require('../controllers/seederController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')

// Only admin users can run seeders
router.post('/run/:seederType', verifyJWT, verifyRoles('Admin'), runSeeder)

module.exports = router