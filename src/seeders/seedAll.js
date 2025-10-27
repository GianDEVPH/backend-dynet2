// Master seeder script that runs all seeders in sequence for complete database population

require('dotenv').config({ path: '../../.env' });
const { execSync } = require('child_process');
const path = require('path');

const runSeeder = (seederPath, description) => {
    try {
        console.log(`\n🔄 Running ${description}...`);
        execSync(`node ${seederPath}`, { stdio: 'inherit', cwd: __dirname });
        console.log(`✅ ${description} completed successfully!`);
    } catch (error) {
        console.error(`❌ Error running ${description}:`, error.message);
        process.exit(1);
    }
};

const runAllSeeders = async () => {
    console.log('🚀 Starting complete database seeding process...\n');
    
    runSeeder('./userSeeder.js', 'User Seeder');
    runSeeder('./appointmentSeeder.js', 'Appointment Seeder');
    runSeeder('./extendedSeeder.js', 'Extended Appointment Seeder');
    
    console.log('\n🎉 ALL SEEDERS COMPLETED SUCCESSFULLY! 🎉');
    console.log('');
    console.log('📋 Database now contains:');
    console.log('👥 Users with individual colors');
    console.log('🏠 Sample apartments with realistic data');
    console.log('📅 Technische planning appointments (Technische Schouwers)');
    console.log('🔧 HAS monteur appointments (Installation & Repair)');
    console.log('');
    console.log('🎯 Your app is now fully populated for customer demo!');
    console.log('💡 Visit the agenda pages to see color-coded appointments by user.');
    console.log('');
};

runAllSeeders();
