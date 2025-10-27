// Data validation and duplicate checking service for district imports

const Flat = require('../models/flatModel.js');
const Building = require('../models/buildingModel.js');
const District = require('../models/districtModel.js');

const checkForExistingFlats = async (flatData, allowUpdates = true) => {
    try {
        let existingFlat = null;
        let matchReason = null;
        
        // Primary check: zoeksleutel (unique identifier)
        if (flatData.zoeksleutel && flatData.zoeksleutel.trim()) {
            existingFlat = await Flat.findOne({ 
                zoeksleutel: flatData.zoeksleutel.trim()
            });
            if (existingFlat) {
                matchReason = 'zoeksleutel';
            }
        }
        
        // Secondary check: exact address match only if no zoeksleutel match
        if (!existingFlat && flatData.adres && flatData.huisNummer) {
            existingFlat = await Flat.findOne({
                adres: flatData.adres,
                huisNummer: flatData.huisNummer,
                toevoeging: flatData.toevoeging || ''
            });
            if (existingFlat) {
                matchReason = 'address';
            }
        }
        
        if (existingFlat) {
            // If updates are allowed, we'll flag for update instead of skip
            return { 
                exists: true, 
                reason: matchReason, 
                existing: existingFlat,
                shouldUpdate: allowUpdates,
                canImport: allowUpdates // Allow import if updates are enabled
            };
        }
        
        return { exists: false, canImport: true };
    } catch (error) {
        console.error('Error checking for existing flat:', error);
        return { exists: false, canImport: true };
    }
};

const validateDistrictData = async (districtData, areaId) => {
    const errors = [];
    const warnings = [];
    
    try {
        const existingDistrict = await District.findOne({
            name: districtData.district,
            area: areaId
        });
        
        if (existingDistrict) {
            warnings.push(`District '${districtData.district}' already exists in this area`);
        }
        
        if (!districtData.district) {
            errors.push('District name is required');
        }
        
        if (!areaId) {
            errors.push('Area ID is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            existingDistrict
        };
    } catch (error) {
        console.error('Error validating district data:', error);
        return {
            isValid: false,
            errors: ['Error validating district data'],
            warnings: []
        };
    }
};

const checkDataConflicts = async (flatData, existingFlats) => {
    const conflicts = [];
    
    try {
        for (const flat of flatData) {
            const conflict = await checkForExistingFlats(flat);
            if (conflict.exists) {
                conflicts.push({
                    newFlat: flat,
                    existingFlat: conflict.existing,
                    conflictReason: conflict.reason
                });
            }
        }
        
        return {
            hasConflicts: conflicts.length > 0,
            conflicts,
            conflictCount: conflicts.length
        };
    } catch (error) {
        console.error('Error checking for data conflicts:', error);
        return {
            hasConflicts: false,
            conflicts: [],
            conflictCount: 0
        };
    }
};

const validateBuildingAssignment = async (flatData) => {
    const validationResults = [];
    
    try {
        for (const flat of flatData) {
            const buildingQuery = {
                address: flat.adres,
                postcode: flat.postcode
            };
            
            let building = await Building.findOne(buildingQuery);
            
            if (!building) {
                validationResults.push({
                    flat: flat,
                    building: null,
                    action: 'create_building',
                    buildingData: buildingQuery
                });
            } else {
                validationResults.push({
                    flat: flat,
                    building: building,
                    action: 'use_existing_building'
                });
            }
        }
        
        return {
            isValid: true,
            results: validationResults
        };
    } catch (error) {
        console.error('Error validating building assignments:', error);
        return {
            isValid: false,
            error: 'Error validating building assignments',
            results: []
        };
    }
};

module.exports = {
    checkForExistingFlats,
    validateDistrictData,
    checkDataConflicts,
    validateBuildingAssignment
};
