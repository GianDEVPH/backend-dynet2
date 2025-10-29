// One-time setup route for creating initial admin user

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/userModel')

// Public endpoint for initial admin creation (ONE TIME USE)
router.post('/create-admin', async (req, res) => {
  try {
    // Check if any users exist
    const userCount = await User.countDocuments()
    
    if (userCount > 0) {
      return res.status(403).json({ 
        message: 'Setup already completed. Users exist in database.' 
      })
    }

    // Create initial admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const adminUser = await User.create({
      email: 'admin@dynet.nl',
      password: hashedPassword,
      roles: {
        Admin: true,
        Planner: true,
        Monteur: true
      }
    })

    res.json({
      success: true,
      message: 'Initial admin user created successfully!',
      credentials: {
        email: 'admin@dynet.nl',
        password: 'admin123',
        note: 'PLEASE CHANGE THIS PASSWORD AFTER FIRST LOGIN'
      }
    })

  } catch (error) {
    console.error('Setup error:', error)
    res.status(500).json({ 
      message: 'Error creating admin user',
      error: error.message 
    })
  }
})

// Check if setup is needed
router.get('/status', async (req, res) => {
  try {
    const userCount = await User.countDocuments()
    res.json({
      setupComplete: userCount > 0,
      userCount: userCount,
      message: userCount === 0 ? 'No users found. Run /setup/create-admin to create initial admin.' : 'Setup already completed.'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
