// Defines API routes for JWT token refresh operations and session renewal.

const express = require('express')
const router = express.Router()
const { handleRefreshToken } = require('../controllers/refreshTokenController')
router.get('/', handleRefreshToken)
module.exports = router
