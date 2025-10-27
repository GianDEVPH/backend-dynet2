// Streamlined district controller using service modules

const Area = require('../models/areaModel.js');
const Building = require('../models/buildingModel.js');
const Flat = require('../models/flatModel.js');
const District = require('../models/districtModel.js');
const TechnischePlanning = require('../models/technischePlanningModel.js');
const TechnischeSchouwer = require('../models/technischeSchouwerModel.js');
const Werkvoorbereider = require('../models/werkvoorBereiderModel.js');
const HASPlanning = require('../models/hasPlanningModel.js');
const HASMonteur = require('../models/hasMonteurModel.js');
const asyncHandler = require('express-async-handler');
const xlsx = require('xlsx');
const fsPromise = require('fs').promises;

const { validateExcelStructure } = require('../services/excelProcessingService');
const { checkDataConflicts: checkDataConflictsService, validateDistrictData } = require('../services/dataValidationService');
const { getCachedData, setCacheData, clearDistrictCache } = require('../services/cacheService');
const { processDistrictImport, previewImportData, getImportHistory, convertExcelDataToArrayData } = require('../services/districtImportService');
const progressTracker = require('../services/progressTracker');

const getDistrict = asyncHandler(async (req, res) => {
    try {
        const district = await District.findById(req.params.id)
            .populate({
                path: 'buildings',
                populate: {
                    path: 'flats',
                    populate: [
                        {path: 'technischePlanning', model: 'TechnischePlanning'},
                        {path: 'technischeSchouwer', model: 'TechnischeSchouwer'},
                        {path: 'werkvoorbereider', model: 'Werkvoorbereider'},
                        {path: 'hasPlanning', model: 'HASPlanning'},
                        {path: 'hasMonteur', model: 'HASMonteur'}
                    ]
                }
            })
            .populate('area', 'name');

        if (!district) {
            return res.status(404).json({ message: 'District not found' });
        }

        res.json(district);
    } catch (error) {
        console.error('Error fetching district:', error);
        res.status(500).json({ message: 'Error fetching district' });
    }
});

const getDistrictsByArea = asyncHandler(async (req, res) => {
    try {
        const areaId = req.params.areaId;
        console.log('🔍 [Districts] Fetching districts for area:', areaId);
        
        // Clear cache to ensure fresh data
        clearDistrictCache();
        
        const districts = await District.find({ area: areaId });
        console.log('📋 [Districts] Found districts:', districts.length);
        
        if (districts.length === 0) {
            // Debug: Check if there are any districts at all
            const allDistricts = await District.find({});
            console.log('🔍 [Debug] Total districts in database:', allDistricts.length);
            console.log('🔍 [Debug] Sample districts with area references:');
            allDistricts.slice(0, 5).forEach(d => {
                console.log(`   - "${d.name}" -> area: ${d.area} (type: ${typeof d.area})`);
            });
            
            // Check if areaId exists
            const area = await Area.findById(areaId);
            console.log('🔍 [Debug] Area exists:', !!area, area?.name);
        }
        
        res.json(districts);
    } catch (error) {
        console.error('Error fetching districts by area:', error);
        res.status(500).json({ message: 'Error fetching districts by area' });
    }
});

const getAllDistricts = asyncHandler(async (req, res) => {
    try {
        const cachedData = getCachedData();
        if (cachedData) {
            return res.json(cachedData);
        }

        console.log('Fetching fresh district data');
        const startTime = Date.now();

        const districtsWithStats = await District.aggregate([
            {
                $lookup: {
                    from: 'areas',
                    localField: 'area',
                    foreignField: '_id',
                    as: 'area'
                }
            },
            {
                $unwind: {
                    path: '$area',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'buildings',
                    let: { districtId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$district', '$$districtId'] } } },
                        {
                            $lookup: {
                                from: 'flats',
                                let: { buildingId: '$_id' },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$building', '$$buildingId'] } } },
                                    {
                                        $group: {
                                            _id: null,
                                            totalFlats: { $sum: 1 },
                                            completedFlats: {
                                                $sum: {
                                                    $cond: [{ $eq: ['$fcStatusHas', '2'] }, 1, 0]
                                                }
                                            }
                                        }
                                    }
                                ],
                                as: 'flatStats'
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                address: 1,
                                totalFlats: { $ifNull: [{ $arrayElemAt: ['$flatStats.totalFlats', 0] }, 0] },
                                completedFlats: { $ifNull: [{ $arrayElemAt: ['$flatStats.completedFlats', 0] }, 0] }
                            }
                        }
                    ],
                    as: 'buildingsWithStats'
                }
            },
            {
                $addFields: {
                    stats: {
                        $let: {
                            vars: {
                                totalFlats: { $sum: '$buildingsWithStats.totalFlats' },
                                completedFlats: { $sum: '$buildingsWithStats.completedFlats' }
                            },
                            in: {
                                totalFlats: '$$totalFlats',
                                completedFlats: '$$completedFlats',
                                remainingFlats: { $subtract: ['$$totalFlats', '$$completedFlats'] },
                                completionPercentage: {
                                    $cond: [
                                        { $gt: ['$$totalFlats', 0] },
                                        { $round: [{ $multiply: [{ $divide: ['$$completedFlats', '$$totalFlats'] }, 100] }] },
                                        0
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    area: { _id: 1, name: 1 },
                    priority: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    buildings: '$buildingsWithStats._id',
                    stats: 1
                }
            },
            { $sort: { priority: 1 } }
        ]);

        const result = districtsWithStats.map((district, index) => ({
            ...district,
            currentRank: index + 1,
            isPriorityFirst: index === 0
        }));

        const queryTime = Date.now() - startTime;
        console.log(`District query completed in ${queryTime}ms`);

        setCacheData(result);

        res.json(result);
    } catch (error) {
        console.error('Error fetching all districts:', error);
        res.status(500).json({ message: 'Error fetching all districts' });
    }
});

const updateDistrictPriority = asyncHandler(async (req, res) => {
    try {
        const { priority } = req.body;
        
        const updatedDistrict = await District.findByIdAndUpdate(
            req.params.id,
            { priority },
            { new: true }
        ).populate('area', 'name');

        if (!updatedDistrict) {
            return res.status(404).json({ message: 'District not found' });
        }

        clearDistrictCache();

        res.json(updatedDistrict);
    } catch (error) {
        console.error('Error updating district priority:', error);
        res.status(500).json({ message: 'Error updating district priority' });
    }
});

const previewDistrictData = asyncHandler(async (req, res) => {
    try {
        console.log('🔄 [Preview] Request received:', {
            hasFile: !!req.file,
            filename: req.file?.originalname,
            areaId: req.body.areaId
        });

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const areaId = req.body.areaId;

        console.log('📂 [Preview] Processing file:', filePath);
        const startTime = Date.now();
        const previewResult = await previewImportData(filePath, areaId);
        const endTime = Date.now();
        console.log('📊 [Preview] Result:', { 
            success: previewResult.success, 
            errors: previewResult.errors?.length || 0,
            previewCount: previewResult.preview?.length || 0,
            processingTime: `${endTime - startTime}ms`
        });

        await fsPromise.unlink(filePath);

        if (!previewResult.success) {
            return res.status(400).json({
                message: 'Preview failed',
                errors: previewResult.errors,
                warnings: previewResult.warnings
            });
        }

        res.json({
            message: 'Preview generated successfully',
            validation: previewResult.validation,
            preview: previewResult.preview,
            stats: previewResult.stats
        });

    } catch (error) {
        console.error('Error previewing district data:', error);
        if (req.file) {
            await fsPromise.unlink(req.file.path);
        }
        res.status(500).json({ message: 'Error previewing district data' });
    }
});

const checkDataConflicts = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const file = xlsx.readFile(filePath);
        const parsedData = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

        const validation = validateExcelStructure(parsedData);
        
        if (!validation.isValid) {
            await fsPromise.unlink(filePath);
            return res.status(400).json({
                message: 'File validation failed',
                errors: validation.errors
            });
        }

        const conflicts = await checkDataConflictsService(parsedData);

        await fsPromise.unlink(filePath);

        res.json({
            hasConflicts: conflicts.hasConflicts,
            conflicts: conflicts.conflicts,
            conflictCount: conflicts.conflictCount
        });

    } catch (error) {
        console.error('Error checking data conflicts:', error);
        if (req.file) {
            await fsPromise.unlink(req.file.path);
        }
        res.status(500).json({ message: 'Error checking data conflicts' });
    }
});

const importDistrictEnhanced = asyncHandler(async (req, res) => {
    try {
        console.log('🚀 [Import] Request received:', {
            hasFile: !!req.file,
            filename: req.file?.originalname,
            fileSize: req.file?.size,
            areaId: req.body.areaId,
            currentDistrict: req.body.currentDistrict,
            operationType: req.body.operationType
        });

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file provided'
            });
        }

        const { areaId, currentDistrict, operationType = 'create' } = req.body;
        const filePath = req.file.path;

        // CRITICAL: Always validate the file before processing
        console.log('🔍 [Import] Validating Excel file structure...');
        const file = xlsx.readFile(filePath);
        const parsedData = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
        const validation = validateExcelStructure(parsedData);

        if (!validation.isValid) {
            await fsPromise.unlink(filePath);
            return res.status(400).json({
                success: false,
                error: 'File validation failed',
                errors: validation.errors,
                warnings: validation.warnings
            });
        }

        console.log('✅ [Import] Validation passed, starting import process...');
        const importResult = await processDistrictImport({
            filePath,
            areaId,
            districtName: currentDistrict,
            operationType,
            validation
        });

        // Clean up uploaded file
        await fsPromise.unlink(filePath);

        if (importResult.success) {
            console.log('✅ [Import] Import completed successfully');
            res.json({
                success: true,
                message: 'District imported successfully',
                stats: importResult.stats
            });
        } else {
            console.log('❌ [Import] Import failed:', importResult.error);
            res.status(400).json({
                success: false,
                error: importResult.error
            });
        }

    } catch (error) {
        console.error('❌ [Import] Error during import:', error);
        if (req.file) {
            await fsPromise.unlink(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const getImportHistoryController = asyncHandler(async (req, res) => {
    try {
        const { areaId, limit = 50 } = req.query;
        
        const result = await getImportHistory(areaId, limit);
        
        res.json({
            success: true,
            history: result.history,
            totalCount: result.totalCount
        });
        
    } catch (error) {
        console.error('Error getting import history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve import history'
        });
    }
});

const importDistrict = asyncHandler(async (req, res) => {
    return importDistrictEnhanced(req, res);
});

const updateDistrict = asyncHandler(async (req, res) => {
    try {
        const { name, priority } = req.body;
        
        const updatedDistrict = await District.findByIdAndUpdate(
            req.params.id,
            { name, priority },
            { new: true }
        ).populate('area', 'name');

        if (!updatedDistrict) {
            return res.status(404).json({ message: 'District not found' });
        }

        clearDistrictCache();

        res.json(updatedDistrict);
    } catch (error) {
        console.error('Error updating district:', error);
        res.status(500).json({ message: 'Error updating district' });
    }
});

module.exports = {
    getDistrict,
    getDistrictsByArea,
    getAllDistricts,
    updateDistrictPriority,
    previewDistrictData,
    checkDataConflicts,
    importDistrictEnhanced,
    getImportHistory: getImportHistoryController,
    importDistrict,
    updateDistrict
};
