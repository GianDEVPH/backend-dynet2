// Provides dashboard statistics and metrics including counts of installations, appointments, and various project status indicators.

const asyncHandler = require('express-async-handler');
const City = require('../models/cityModel');
const Area = require('../models/areaModel');
const District = require('../models/districtModel');
const Building = require('../models/buildingModel');
const Flat = require('../models/flatModel');
const TechnischePlanning = require('../models/technischePlanningModel');
const HASMonteur = require('../models/hasMonteurModel');
let dashboardCache = {
    data: null,
    timestamp: 0,
ttl: 2 * 60 * 1000
};

const getDashboardStats = asyncHandler(async (req, res) => {
    try {
        const now = Date.now();
        if (dashboardCache.data && (now - dashboardCache.timestamp) < dashboardCache.ttl) {
            console.log('Returning cached dashboard stats');
            return res.json(dashboardCache.data);
        }

        console.log('Fetching fresh dashboard stats');
        const startTime = Date.now();

        const [
            totalCities,
            totalAreas,
            totalDistricts,
            totalBuildings,
            totalFlats,
            completedInstallationsCount,
            scheduledTechnicalPlanningCount,
            scheduledHASAppointmentsCount
        ] = await Promise.all([
            City.countDocuments(),
            Area.countDocuments(),
            District.countDocuments(),
            Building.countDocuments(),
            Flat.countDocuments(),
            Flat.countDocuments({ fcStatusHas: '2' }),
            TechnischePlanning.countDocuments({
                'appointmentBooked.date': { 
                    $exists: true, 
                    $ne: null,
                    $gte: new Date(),
$lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            }),
            HASMonteur.countDocuments({
                'appointmentBooked.date': { 
                    $exists: true, 
                    $ne: null,
                    $gte: new Date(),
$lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            })
        ]);

        const dashboardData = {
            totalCities: totalCities || 1,
            totalAreas: totalAreas || 1,
            totalDistricts,
            totalBuildings,
            totalFlats,
            completedInstallations: completedInstallationsCount,
            pendingInstallations: totalFlats - completedInstallationsCount,
            scheduledAppointments: scheduledTechnicalPlanningCount + scheduledHASAppointmentsCount,
            completionPercentage: totalFlats > 0 ? Math.round((completedInstallationsCount / totalFlats) * 100) : 0
        };

        const queryTime = Date.now() - startTime;
        console.log(`Dashboard stats query completed in ${queryTime}ms`);

        dashboardCache = {
            data: dashboardData,
            timestamp: now,
            ttl: dashboardCache.ttl
        };

        res.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ 
            message: 'Error fetching dashboard stats',
            error: error.message 
        });
    }
});

const getRecentActivity = asyncHandler(async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const [recentTechnicalPlannings, recentInstallations] = await Promise.all([
            TechnischePlanning.find({
                'appointmentBooked.date': { $gte: oneWeekAgo }
            })
            .populate({
                path: 'flat',
                select: 'adres huisNummer toevoeging complexNaam'
            })
            .sort({ 'appointmentBooked.date': -1 })
            .limit(10),
            HASMonteur.find({
                $or: [
                    { 'appointmentBooked.date': { $gte: oneWeekAgo } },
                    { 'installation.startTime': { $gte: oneWeekAgo } }
                ]
            })
            .populate({
                path: 'flat',
                select: 'adres huisNummer toevoeging complexNaam'
            })
            .sort({ 'appointmentBooked.date': -1 })
            .limit(10)
        ]);
        const recentActivity = [
            ...recentTechnicalPlannings.map(tp => ({
                type: 'technical_planning',
                date: tp.appointmentBooked.date,
                location: `${tp.flat.adres} ${tp.flat.huisNummer}${tp.flat.toevoeging || ''}`,
                complexName: tp.flat.complexNaam,
                status: 'scheduled'
            })),
            ...recentInstallations.map(install => ({
                type: 'installation',
                date: install.appointmentBooked.date || install.installation.startTime,
                location: `${install.flat.adres} ${install.flat.huisNummer}${install.flat.toevoeging || ''}`,
                complexName: install.flat.complexNaam,
                status: install.installation.status
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(recentActivity);
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500);
        throw new Error(`Error fetching recent activity: ${error.message}`);
    }
});
module.exports = {
    getDashboardStats,
    getRecentActivity
};
