// Routes for database seeding operations

const express = require('express')
const router = express.Router()
const { runSeeder } = require('../controllers/seederController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')

// Test endpoint to verify routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Seeder routes are working!' })
})

// Public endpoint for initial setup (REMOVE AFTER FIRST USE)
router.post('/init/:seederType', runSeeder)

// Protected endpoint for regular use (requires admin)
router.post('/run/:seederType', verifyJWT, verifyRoles('Admin'), runSeeder)

module.exports = router