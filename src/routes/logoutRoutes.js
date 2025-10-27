// Defines API routes for user logout operations and session termination.

const express = require('express')
const router = express.Router()
const { handleLogout } = require('../controllers/logoutController')
router.get('/', handleLogout)
module.exports = router
