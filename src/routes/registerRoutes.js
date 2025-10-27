// Defines API routes for user registration including new user creation endpoints.

const express = require('express')
const router = express.Router()
const { handleNewUser } = require('../controllers/registerController')
router.post('/', handleNewUser)
module.exports = router
