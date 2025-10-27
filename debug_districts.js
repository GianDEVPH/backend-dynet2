const mongoose = require('mongoose');
const District = require('./src/models/districtModel');
const Area = require('./src/models/areaModel');

async function checkDistricts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/dynet');
    
    console.log('🔍 Checking districts and areas...');
    
    const areas = await Area.find({});
    console.log('📍 Areas found:', areas.length);
    areas.forEach(area => {
      console.log('  - Area:', area.name, 'ID:', area._id);
    });
    
    console.log('\n🏘️ Districts in database:');
    const districts = await District.find({}).populate('area', 'name');
    console.log('Total districts found:', districts.length);
    
    districts.forEach(district => {
      console.log('  - District:', district.name || district.district);
      console.log('    Area:', district.area?.name || 'NO AREA');
      console.log('    Area ID:', district.area?._id || district.area);
      console.log('    Raw area field:', district.area);
      console.log('');
    });
    
    // Check for districts without proper area references
    const districtsWithoutArea = districts.filter(d => !d.area);
    if (districtsWithoutArea.length > 0) {
      console.log('⚠️ Districts without proper area reference:', districtsWithoutArea.length);
      districtsWithoutArea.forEach(d => {
        console.log('  - District:', d.name || d.district, 'Raw area field:', d.area);
      });
    }
    
    // Test the API query for a specific area
    if (areas.length > 0) {
      const testAreaId = areas[0]._id;
      console.log('\n🔍 Testing API query for area:', testAreaId);
      const areaDistricts = await District.find({ area: testAreaId }).populate('area', 'name');
      console.log('Districts found for this area:', areaDistricts.length);
      areaDistricts.forEach(d => {
        console.log('  -', d.name || d.district);
      });
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.disconnect();
  }
}

checkDistricts();