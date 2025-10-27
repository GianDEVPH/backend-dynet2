// District import service for handling Excel imports and data processing

// Only import the models we actually use
const Area = require('../models/areaModel.js');
const Building = require('../models/buildingModel.js');
const Flat = require('../models/flatModel.js');
const District = require('../models/districtModel.js');

const xlsx = require('xlsx');
const fsPromise = require('fs').promises;

const { validateExcelStructure, normalizeFlat } = require('./excelProcessingService');
const { clearDistrictCache } = require('./cacheService');

const convertExcelDataToArrayData = async (req, columnMapping = {}) => {
    try {
        const filePath = req.file.path;
        const file = xlsx.readFile(filePath);
        let parsedData = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
        
        const zoeksleutelCol = columnMapping.identifier || 'Opdrachtnummer';
        const adresCol = columnMapping.address || 'Volledig adres';
        const huisNummerCol = columnMapping.houseNumber || 'Huisnummer';
        
        const allSorted = parsedData.map((target) => {
            const current = target[zoeksleutelCol] || target.Opdrachtnummer || target.Zoeksleutel || target.Sleutel || '';
            
            // Extract building identifier from opdrachtnummer (POSTCODE_HOUSENUMBER)
            const parts = current.split('_');
            const buildingKey = parts.length >= 2 ? `${parts[0]}_${parts[1]}` : current;
            
            const currentArray = [];
            parsedData.forEach((element) => {
                const compared = element[zoeksleutelCol] || element.Opdrachtnummer || element.Zoeksleutel || element.Sleutel || '';
                const comparedParts = compared.split('_');
                const comparedBuildingKey = comparedParts.length >= 2 ? `${comparedParts[0]}_${comparedParts[1]}` : compared;
                
                if (comparedBuildingKey === buildingKey) {
                    currentArray.push(element);
                }
            });
            
            // Use building key as unique identifier instead of address + house number
            const keyName = buildingKey;
            
            return {
                address: target[adresCol],
                houseNumber: target[huisNummerCol],
                postcode: target.Postcode,
                keyName: keyName,
                buildingKey: buildingKey,
                flats: currentArray
            };
        });
        
        const uniqueBuildings = allSorted.filter((building, index, self) =>
            index === self.findIndex(b => b.buildingKey === building.buildingKey)
        );
        
        return uniqueBuildings;
        
    } catch (error) {
        console.error('Error converting Excel data:', error);
        throw new Error('Failed to process Excel data');
    }
};

const processDistrictImport = async (importData, importId = null, progressTracker = null) => {
    const { filePath, areaId, districtName, operationType = 'create', validation } = importData;
    
    try {
        if (progressTracker && importId) {
            progressTracker.updateProgress(importId, {
                currentStep: 5,
                stage: 'converting',
                message: 'Converting Excel data to building structure...'
            });
        }

        console.log('🔄 [Service] Converting Excel data to building array...');
        const conversionStart = Date.now();
        const mockReq = { file: { path: filePath } };
        const convertedArray = await convertExcelDataToArrayData(mockReq, validation.foundColumns);
        const conversionEnd = Date.now();
        console.log('✅ [Service] Conversion completed:', {
            buildings: convertedArray.length,
            processingTime: `${conversionEnd - conversionStart}ms`
        });

        if (progressTracker && importId) {
            progressTracker.updateProgress(importId, {
                currentStep: 6,
                stage: 'creating_district',
                message: `${operationType === 'create' ? 'Creating' : 'Finding'} district: ${districtName}...`,
                stats: { buildings: convertedArray.length }
            });
        }
        
        let district;
        
        if (operationType === 'create') {
            district = await District.create({
                name: districtName,
                area: areaId
            });
            
            // Add district to area's districts array
            await Area.findByIdAndUpdate(
                areaId,
                { $addToSet: { districts: district._id } },
                { new: true }
            );
            console.log('✅ [Service] District added to area successfully');
        } else {
            district = await District.findOne({ name: districtName, area: areaId });
            if (!district) {
                throw new Error(`District '${districtName}' not found in specified area`);
            }
        }
        
        const buildingsDocs = [];
        const flatsDocs = [];
        
        let importStats = {
            totalFlats: 0,
            newFlats: 0,
            newBuildings: 0,
            errors: 0,
            processedBuildings: 0
        };

        if (progressTracker && importId) {
            progressTracker.updateProgress(importId, {
                currentStep: 7,
                stage: 'processing_buildings',
                message: 'Processing buildings and apartments...',
                stats: { buildings: convertedArray.length }
            });
        }

        console.log('🔄 [Service] Processing buildings and apartments...');
        console.log('📊 [Service] Processing', convertedArray.length, 'buildings');
        const processingStart = Date.now();
        
        for (let i = 0; i < convertedArray.length; i++) {
            const buildingData = convertedArray[i];
            if (i % 50 === 0) {
                console.log(`📈 [Service] Processing building ${i + 1}/${convertedArray.length}`);
            }
            try {
                // Create building directly without checking for duplicates (for speed)
                const building = new Building({
                    district: district._id,
                    address: buildingData.address,
                    postcode: buildingData.postcode,
                    flats: []
                });
                buildingsDocs.push(building);
                importStats.newBuildings++;
                
                if (buildingData.flats && buildingData.flats.length > 0) {
                    for (const flatData of buildingData.flats) {
                        importStats.totalFlats++;
                        
                        // No duplicate checking - just create the flat
                        // MongoDB will handle any unique constraints
                        
                        // Create flat with new field names and additional mappings
                        const flatDoc = new Flat({
                            building: building._id,
                            district: district._id,
                            zoeksleutel: flatData.Opdrachtnummer || flatData.Zoeksleutel || flatData.Sleutel,
                            adres: flatData['Volledig adres'] || flatData.Adres,
                            huisNummer: flatData.Huisnummer || flatData['Huis nummer'],
                            toevoeging: flatData['Huisnummer Toevoeging'] || flatData.Toevoeging || flatData.Huisext,
                            postcode: flatData.Postcode,
                            achternaam: flatData.Contactpersoon || flatData.Achternaam,
                            complexNaam: flatData.Complexnaam || flatData.ComplexNaam,
                            soortBouw: flatData['Gebouwtype hoog laag etc'] || flatData.SoortBouw,
                            email: flatData['E-mail'] || flatData.Email,
                            team: flatData['HAS ploeg'] || flatData.Team,
                            fcStatusHas: flatData['Opleverstatus KPN'] || flatData.FCStatusHAS,
                            ipVezelwaarde: flatData['IP vezelwaarde'] || flatData.IPVezelwaarde,
                            toelichtingStatus: flatData['Toelichting status'] || flatData.ToelichtingStatus,
                            ap: flatData.AP,
                            dp: flatData.DP,
                            laswerkAP: flatData['Laswerk AP gereed'] || flatData.LaswerkAP,
                            laswerkDP: flatData['Laswerk DP gereed'] || flatData.LaswerkDP,
                            odf: flatData.ODF,
                            odfPositie: flatData['ODF Positie'] || flatData.ODFPositie,
                            tkNummer: flatData.TKnr || flatData.TKNummer
                        });
                        
                        flatsDocs.push(flatDoc);
                        building.flats.push(flatDoc._id);
                        importStats.newFlats++;
                        
                        // Skip automatic planning creation - create only if needed
                    }
                }
                
                importStats.processedBuildings++;

                // Update progress every 10 buildings or at the end
                if (progressTracker && importId && (i % 10 === 0 || i === convertedArray.length - 1)) {
                    progressTracker.updateProgress(importId, {
                        currentStep: 7 + ((i / convertedArray.length) * 1), // Progress from step 7 to 8
                        stage: 'processing_buildings',
                        message: `Processing building ${i + 1}/${convertedArray.length}: ${buildingData.keyName || buildingData.address}`,
                        stats: { 
                            processedBuildings: importStats.processedBuildings,
                            processedFlats: importStats.newFlats,
                            buildings: convertedArray.length
                        }
                    });
                }

            } catch (error) {
                console.error(`Error processing building ${buildingData.address}:`, error);
                importStats.errors++;
            }
        }

        const processingEnd = Date.now();
        console.log('✅ [Service] Processing completed:', {
            processingTime: `${processingEnd - processingStart}ms`,
            stats: importStats
        });

        if (progressTracker && importId) {
            progressTracker.updateProgress(importId, {
                currentStep: 9,
                stage: 'saving',
                message: 'Saving data to database...',
                stats: { 
                    buildings: buildingsDocs.length,
                    flats: flatsDocs.length,
                    errors: importStats.errors
                }
            });
        }

        console.log('💾 [Service] Saving to database...');
        const saveStart = Date.now();
        
        // Simplified saving - just buildings and flats
        const saveResults = await Promise.allSettled([
            Building.insertMany(buildingsDocs),
            Flat.insertMany(flatsDocs)
        ]);
        
        const saveErrors = saveResults.filter(result => result.status === 'rejected');
        if (saveErrors.length > 0) {
            console.error('Save errors:', saveErrors);
            importStats.errors += saveErrors.length;
        }

        // Update district's buildings array with the building IDs
        if (buildingsDocs.length > 0) {
            const buildingIds = buildingsDocs.map(building => building._id);
            await District.findByIdAndUpdate(
                district._id,
                { $addToSet: { buildings: { $each: buildingIds } } },
                { new: true }
            );
            console.log('✅ [Service] Updated district buildings array with', buildingIds.length, 'buildings');
        }
        
        clearDistrictCache();
        
        return {
            success: true,
            district,
            stats: importStats,
            message: `Import completed: ${importStats.newFlats} flats, ${importStats.newBuildings} buildings processed`
        };
        
    } catch (error) {
        console.error('Error processing district import:', error);
        throw new Error(`Import failed: ${error.message}`);
    }
};

const previewImportData = async (filePath, areaId) => {
    try {
        const file = xlsx.readFile(filePath);
        const parsedData = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
        
        const validation = validateExcelStructure(parsedData);
        
        if (!validation.isValid) {
            return {
                success: false,
                errors: validation.errors,
                warnings: validation.warnings
            };
        }
        
        // Process all data to generate building statistics
        const allFlats = parsedData.map(row => 
            normalizeFlat(row, validation.foundColumns)
        ).filter(flat => flat !== null);
        
        // Convert to building array for accurate statistics
        const mockReq = { file: { path: filePath } };
        console.log('🔄 [Preview] Converting to building data with columns:', validation.foundColumns);
        const buildingData = await convertExcelDataToArrayData(mockReq, validation.foundColumns);
        console.log('📊 [Preview] Building conversion result:', {
            buildingCount: buildingData?.length || 0,
            flatCount: allFlats.length,
            sampleBuilding: buildingData?.[0]
        });
        
        const totalBuildings = buildingData?.length || 0;
        const totalFlats = allFlats.length;
        const buildingsWithMultipleFlats = buildingData?.filter(building => building.flats?.length > 1).length || 0;
        
        // Sample data for preview (first 10 flats)
        const sampleSize = Math.min(10, allFlats.length);
        const preview = allFlats.slice(0, sampleSize);
        
        // Sample buildings for building preview (first 5 buildings)
        const buildingPreviewSize = Math.min(5, totalBuildings);
        const buildingPreview = totalBuildings > 0 ? buildingData.slice(0, buildingPreviewSize).map(building => ({
            address: building?.address || 'Unknown',
            houseNumber: building?.houseNumber || 'N/A',
            flats: building?.flats?.length || 0,
            keyName: building?.keyName || 'Unknown'
        })) : [];
        
        console.log('🏢 [Preview] Building preview sample:', buildingPreview.length, 'buildings');
        
        return {
            success: true,
            validation,
            preview,
            buildingPreview,
            stats: {
                totalRows: parsedData.length,
                totalBuildings,
                totalFlats,
                buildingsWithMultipleFlats,
                sampleSize: preview.length,
                validRows: validation.stats.validRows
            }
        };
        
    } catch (error) {
        console.error('Error previewing import data:', error);
        return {
            success: false,
            errors: ['Error reading file for preview']
        };
    }
};

const getImportHistory = async (areaId = null, limit = 50) => {
    try {
        const query = areaId ? { area: areaId } : {};
        
        const districts = await District.find(query)
            .populate('area', 'name')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        
        const historyWithStats = await Promise.all(
            districts.map(async (district) => {
                const [buildingCount, flatCount] = await Promise.all([
                    Building.countDocuments({ district: district._id }),
                    Flat.countDocuments({ district: district._id })
                ]);
                
                return {
                    ...district,
                    stats: {
                        buildings: buildingCount,
                        flats: flatCount
                    }
                };
            })
        );
        
        return {
            success: true,
            history: historyWithStats
        };
        
    } catch (error) {
        console.error('Error getting import history:', error);
        return {
            success: false,
            error: 'Failed to get import history'
        };
    }
};

module.exports = {
    convertExcelDataToArrayData,
    processDistrictImport,
    previewImportData,
    getImportHistory
};
