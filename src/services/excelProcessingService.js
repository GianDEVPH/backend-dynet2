// Excel processing and validation service for district data imports

// Helper function for fuzzy string matching
const getLevenshteinDistance = (str1, str2) => {
    const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,      // insertion
                matrix[j - 1][i] + 1,      // deletion
                matrix[j - 1][i - 1] + cost // substitution
            );
        }
    }
    
    return matrix[str2.length][str1.length];
};

const validateExcelStructure = (data) => {
    const errors = [];
    const warnings = [];
    
    if (!Array.isArray(data) || data.length === 0) {
        errors.push('File appears to be empty or invalid');
        return { errors, warnings, isValid: false };
    }

    const firstRow = data[0];
    const availableColumns = Object.keys(firstRow);
    console.log('Available columns in Excel file:', availableColumns);

    const requiredFields = [
        {
            field: 'identifier',
            possibleNames: [
                'Opdrachtnummer', 'Zoeksleutel', 'Sleutel', 'ID', 'Identifier', 'Code', 'Reference',
                'Key', 'Unitcode', 'Unit', 'Object', 'ObjectCode', 'Eenheid',
                'EenheidCode', 'UniqueID', 'UniqueKey', 'ObjectID', 'Ref',
                'Referentie', 'Kenmerk', 'Uniek', 'UniekeCode'
            ],
            required: true
        },
        {
            field: 'address',
            possibleNames: [
                'Volledig adres', 'Adres', 'Address', 'Straat', 'Street', 'Straatnaam', 'Straatnaam en huisnummer',
                'Full address', 'Location', 'Locatie', 'Plaats',
                'Straat naam', 'StreetName', 'Woonadres', 'Hoofdadres', 'Adresregel'
            ],
            required: true
        },
        {
            field: 'houseNumber',
            possibleNames: [
                'Huisnummer', 'Huis nummer', 'HouseNumber', 'Nummer', 'Number', 'Nr',
                'Nr.', 'House Nr', 'House Number', 'Huis Nr', 'HuisNr',
                'Huisnr', 'Woningnummer', 'Pand nummer', 'PandNummer'
            ],
            required: false
        },
        {
            field: 'postcode',
            possibleNames: [
                'Postcode', 'PostCode', 'Postal Code', 'ZIP', 'Zip Code',
                'PC', 'Post Code', 'Postal', 'PLZ'
            ],
            required: false
        },
        {
            field: 'addition',
            possibleNames: [
                'Huisnummer Toevoeging', 'Toevoeging', 'Addition', 'Suffix', 'Huisext', 'Huis ext',
                'Extension', 'Ext', 'Aanvulling', 'Bijlage', 'Huisletter'
            ],
            required: false
        }
    ];

    const foundColumns = {};
    
    for (const fieldDef of requiredFields) {
        let foundColumn = null;
        
        for (const possibleName of fieldDef.possibleNames) {
            if (availableColumns.includes(possibleName)) {
                foundColumn = possibleName;
                break;
            }
        }
        
        if (!foundColumn) {
            // Enhanced fuzzy matching with multiple strategies
            for (const availableCol of availableColumns) {
                const normalizedAvailable = availableCol.toLowerCase().replace(/[^a-z0-9]/g, '');
                
                for (const possibleName of fieldDef.possibleNames) {
                    const normalizedPossible = possibleName.toLowerCase().replace(/[^a-z0-9]/g, '');
                    
                    // Strategy 1: Direct substring match
                    if (normalizedAvailable.includes(normalizedPossible) ||
                        normalizedPossible.includes(normalizedAvailable)) {
                        foundColumn = availableCol;
                        break;
                    }
                    
                    // Strategy 2: Case insensitive contains
                    if (availableCol.toLowerCase().includes(possibleName.toLowerCase()) ||
                        possibleName.toLowerCase().includes(availableCol.toLowerCase())) {
                        foundColumn = availableCol;
                        break;
                    }
                    
                    // Strategy 3: Levenshtein distance for close matches
                    if (normalizedAvailable.length >= 3 && normalizedPossible.length >= 3) {
                        const distance = getLevenshteinDistance(normalizedAvailable, normalizedPossible);
                        const maxLength = Math.max(normalizedAvailable.length, normalizedPossible.length);
                        if (distance <= Math.floor(maxLength * 0.3)) { // 30% similarity threshold
                            foundColumn = availableCol;
                            break;
                        }
                    }
                }
                if (foundColumn) break;
            }
        }
        
        if (foundColumn) {
            foundColumns[fieldDef.field] = foundColumn;
            console.log(`Mapped ${fieldDef.field} to column: ${foundColumn}`);
        } else if (fieldDef.required) {
            errors.push(`Missing required column for ${fieldDef.field}. Expected one of: ${fieldDef.possibleNames.join(', ')}`);
        }
    }

    const validRows = data.filter(row => {
        const hasIdentifier = foundColumns.identifier ? 
            (row[foundColumns.identifier] && String(row[foundColumns.identifier]).trim()) : false;
        const hasAddress = foundColumns.address ? 
            (row[foundColumns.address] && String(row[foundColumns.address]).trim()) : false;
        return hasIdentifier || hasAddress;
    });

    const emptyRows = data.length - validRows.length;
    
    if (emptyRows > 0) {
        warnings.push(`Found ${emptyRows} rows without essential data (identifier or address)`);
    }

    if (validRows.length === 0) {
        errors.push('No valid data rows found. Please check that your Excel file contains the required columns with data.');
    }

    return { 
        errors, 
        warnings, 
        isValid: errors.length === 0,
        foundColumns,
        stats: {
            totalRows: data.length,
            validRows: validRows.length,
            emptyRows,
            columnsCount: availableColumns.length,
            availableColumns
        }
    };
};

function normalizeFlat(flat, columnMapping) {
    try {
        const getValue = (fieldName) => {
            const columnName = columnMapping[fieldName];
            return columnName ? flat[columnName] : null;
        };

        const safeString = (value) => {
            if (value === null || value === undefined || value === '') return '';
            return String(value).trim();
        };

        const safeNumber = (value) => {
            if (value === null || value === undefined || value === '') return null;
            const num = Number(value);
            return isNaN(num) ? null : num;
        };

        // Enhanced data extraction with new field names prioritized
        const zoeksleutel = safeString(getValue('identifier') || flat.Opdrachtnummer || flat.Zoeksleutel || flat.Sleutel || flat.ID);
        const adres = safeString(getValue('address') || flat['Volledig adres'] || flat.Adres || flat.Address);
        const huisNummer = safeString(getValue('houseNumber') || flat.Huisnummer || flat['Huis nummer']);
        const toevoeging = safeString(getValue('addition') || flat['Huisnummer Toevoeging'] || flat.Toevoeging || flat.Huisext);
        const postcode = safeString(getValue('postcode') || flat.Postcode || flat.PostCode);

        // More flexible validation - allow rows with at least identifier OR address+houseNumber
        const hasMinimumData = zoeksleutel || (adres && (huisNummer || adres.match(/\d+/)));
        
        if (!hasMinimumData) {
            console.warn('⚠️ Row missing essential data (need identifier OR address with number):', {
                zoeksleutel,
                adres,
                huisNummer,
                availableKeys: Object.keys(flat).slice(0, 10) // Log first 10 keys for debugging
            });
            return null;
        }

        const normalizedFlat = {
            zoeksleutel,
            adres,
            huisNummer,
            toevoeging,
            postcode,
            plaats: safeString(getValue('city') || getValue('plaats')),
            
            fcStatusHas: safeString(getValue('fcStatusHas')),
            fcStatusTs: safeString(getValue('fcStatusTs')),
            
            lat: safeNumber(getValue('latitude') || getValue('lat')),
            lng: safeNumber(getValue('longitude') || getValue('lng')),
            
            district: safeString(getValue('district')),
            building: safeString(getValue('building')),
            
            _originalData: flat
        };

        Object.keys(normalizedFlat).forEach(key => {
            if (normalizedFlat[key] === '') {
                normalizedFlat[key] = null;
            }
        });

        return normalizedFlat;
    } catch (error) {
        console.error('Error normalizing flat:', error, flat);
        return null;
    }
}

module.exports = {
    validateExcelStructure,
    normalizeFlat
};
