// Manages building data operations including fetching building lists, individual building details, and building-related information.

const Building = require('../models/buildingModel.js');
const Layout = require('../models/layoutModel');
const asyncHandler = require('express-async-handler');
const getBuilding = asyncHandler(async (req, res) => {
    const currentBuilding = await Building.findById(req.params.id)
        .populate({
            path: 'flats',
            populate: [
                {
                    path: 'technischePlanning',
                    model: 'TechnischePlanning',
                    select: 'appointmentBooked telephone vveWocoName technischeSchouwerName readyForSchouwer signed calledAlready timesCalled additionalNotes smsSent'
                },
                {
                    path: 'hasMonteur',
                    model: 'HASMonteur',
                    select: 'appointmentBooked hasMonteurName installation'
                }
            ]
        })
        .populate('layout');
    if (!currentBuilding) {
        res.status(404);
        throw new Error('Building not found');
    }
    res.json(currentBuilding);
});
const createBuildingLayout = asyncHandler(async (req, res) => {
    const buildingId = req.params.id;
    const layout = await Layout.create({
        building: buildingId,
        blocks: req.body.map(block => ({
            blockType: block.blockType,
            firstFloor: block.firstFloor,
            topFloor: block.topFloor,
            floors: block.floors.map(element => ({
                floor: element.floor,
                flat: element.flat,
                cableNumber: element.cableNumber,
                cableLength: element.cableLength,
            })),
        })),
    });
    await Building.findByIdAndUpdate(buildingId, { layout: layout._id });
    res.json(layout);
});
const updateBuildingLayout = asyncHandler(async (req, res) => {
    const buildingId = req.params.id;
    const building = await Building.findById(buildingId, { layout: 1 });
    if (!building) {
        res.status(404);
        throw new Error('Building not found');
    }
    await Layout.findByIdAndUpdate(building.layout, {
        building: buildingId,
        blocks: req.body.map(block => ({
            blockType: block.blockType,
            firstFloor: block.firstFloor,
            topFloor: block.topFloor,
            floors: block.floors.map(element => ({
                floor: element.floor,
                flat: element.flat,
                cableNumber: element.cableNumber,
                cableLength: element.cableLength,
            })),
        })),
    });
    res.json({ message: 'Layout updated successfully!' });
});

const blockBuilding = asyncHandler(async (req, res) => {
    const { buildingId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    
    if (!reason || reason.trim() === '') {
        res.status(400);
        throw new Error('Block reason is required');
    }
    
    const building = await Building.findByIdAndUpdate(
        buildingId,
        {
            isBlocked: true,
            blockReason: reason.trim(),
            blockedBy: userId,
            blockedAt: new Date()
        },
        { new: true }
    );
    
    if (!building) {
        res.status(404);
        throw new Error('Building not found');
    }
    
    res.json({
        message: 'Building blocked successfully',
        building: {
            _id: building._id,
            address: building.address,
            isBlocked: building.isBlocked,
            blockReason: building.blockReason,
            blockedAt: building.blockedAt
        }
    });
});

const unblockBuilding = asyncHandler(async (req, res) => {
    const { buildingId } = req.params;
    
    const building = await Building.findByIdAndUpdate(
        buildingId,
        {
            isBlocked: false,
            blockReason: '',
            blockedBy: null,
            blockedAt: null
        },
        { new: true }
    );
    
    if (!building) {
        res.status(404);
        throw new Error('Building not found');
    }
    
    res.json({
        message: 'Building unblocked successfully',
        building: {
            _id: building._id,
            address: building.address,
            isBlocked: building.isBlocked
        }
    });
});

module.exports = {
    getBuilding,
    createBuildingLayout,
    updateBuildingLayout,
    blockBuilding,
    unblockBuilding,
};