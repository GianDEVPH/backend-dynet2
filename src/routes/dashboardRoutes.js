// Defines API routes for dashboard data including statistics and metrics endpoints.

const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getRecentActivity
} = require('../controllers/dashboardController');
router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);
module.exports = router;
