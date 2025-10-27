// Defines API routes for district management including CRUD operations for district data.

const express = require('express');
const { 
    getDistrict, 
    getDistrictsByArea, 
    importDistrict, 
    updateDistrict, 
    getAllDistricts,
    updateDistrictPriority,
    previewDistrictData,
    checkDataConflicts,
    importDistrictEnhanced,
    getImportHistory
} = require('../controllers/districtController');
const progressTracker = require('../services/progressTracker');
const router = express.Router();
const upload = require('../controllers/uploadController');
router.get('/all', getAllDistricts);
router.get('/:id', getDistrict);
router.get('/area/:areaId', getDistrictsByArea);
router.post('/', upload.single('file'), importDistrict);
router.put('/', upload.single('file'), updateDistrict);
router.post('/priority', updateDistrictPriority);
router.post('/preview', upload.single('file'), previewDistrictData);
router.post('/check-conflicts', checkDataConflicts);
router.post('/import-enhanced', upload.single('file'), importDistrictEnhanced);
router.get('/import-history/:areaId', getImportHistory);

// Progress tracking routes
router.get('/import-progress/:importId', (req, res) => {
    const { importId } = req.params;
    console.log(`🔌 [Route] SSE connection request for import: ${importId}`);
    
    try {
        progressTracker.addClient(importId, res);
    } catch (error) {
        console.error(`❌ [Route] Error setting up SSE for ${importId}:`, error);
        res.status(500).json({ error: 'Failed to establish progress connection' });
    }
});

// Polling fallback endpoint
router.get('/import-status/:importId', (req, res) => {
    const { importId } = req.params;
    const status = progressTracker.getImportStatus(importId);
    
    if (!status) {
        return res.status(404).json({ error: 'Import not found' });
    }
    
    res.json(status);
});

module.exports = router;