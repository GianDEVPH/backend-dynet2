// Cache service for district data management

// Cache for district data (5 minute cache)
let districtCache = {
    data: null,
    timestamp: 0,
ttl: 5 * 60 * 1000
};

const isCacheValid = () => {
    const now = Date.now();
    return districtCache.data && (now - districtCache.timestamp) < districtCache.ttl;
};

const getCachedData = () => {
    if (isCacheValid()) {
        console.log('Returning cached district data');
        return districtCache.data;
    }
    return null;
};

const setCacheData = (data) => {
    districtCache = {
        data: data,
        timestamp: Date.now(),
        ttl: districtCache.ttl
    };
};

const clearDistrictCache = () => {
    districtCache.data = null;
    districtCache.timestamp = 0;
    console.log('District cache cleared');
};

const getCacheStatus = () => {
    return {
        hasData: !!districtCache.data,
        timestamp: districtCache.timestamp,
        age: Date.now() - districtCache.timestamp,
        ttl: districtCache.ttl,
        isValid: isCacheValid()
    };
};

const configureCacheTTL = (ttlInMinutes) => {
    districtCache.ttl = ttlInMinutes * 60 * 1000;
    console.log(`Cache TTL configured to ${ttlInMinutes} minutes`);
};

module.exports = {
    isCacheValid,
    getCachedData,
    setCacheData,
    clearDistrictCache,
    getCacheStatus,
    configureCacheTTL
};
