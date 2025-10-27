// Defines API routes for scheduling operations including appointment management endpoints.

const express = require('express')
const router = express.Router()
const { createSchedule } = require('../controllers/scheduleController')
router.post('/:id', createSchedule)
module.exports = router
