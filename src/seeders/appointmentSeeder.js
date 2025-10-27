// Comprehensive seeder for populating the database with sample apartments and appointments for demo purposes

require('dotenv').config({ path: '../../.env' });
const connectDB = require('../config/db');
const Flat = require('../models/flatModel');
const TechnischePlanning = require('../models/technischePlanningModel');
const HASMonteur = require('../models/hasMonteurModel');

const apartmentData = require('./data/apartmentData');
const technischePlanningAppointments = require('./data/technischePlanningAppointments');
const hasMonteurAppointments = require('./data/hasMonteurAppointments');

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        console.log('Clearing existing data...');
        await TechnischePlanning.deleteMany({});
        await HASMonteur.deleteMany({});
        
        console.log('Creating sample apartments...');
        const createdFlats = [];

        for (let i = 0; i < apartmentData.length; i++) {
            const apartmentInfo = apartmentData[i];
            
            let flat = await Flat.findOne({ 
                adres: apartmentInfo.adres, 
                huisNummer: apartmentInfo.huisNummer,
                toevoeging: apartmentInfo.toevoeging 
            });
            
            if (!flat) {
                flat = await Flat.create(apartmentInfo);
                console.log(`Created apartment: ${flat.adres} ${flat.huisNummer}${flat.toevoeging}`);
            } else {
                Object.assign(flat, apartmentInfo);
                await flat.save();
                console.log(`Updated apartment: ${flat.adres} ${flat.huisNummer}${flat.toevoeging}`);
            }
            
            createdFlats.push(flat);
        }

        console.log('Creating technische planning appointments...');
        
        for (let i = 0; i < Math.min(technischePlanningAppointments.length, createdFlats.length); i++) {
            const appointmentData = technischePlanningAppointments[i];
            const flat = createdFlats[i];

            const planning = await TechnischePlanning.create({
                flat: flat._id,
                ...appointmentData
            });

            flat.technischePlanning = planning._id;
            await flat.save();

            console.log(`Created technische planning for: ${flat.adres} ${flat.huisNummer}${flat.toevoeging} - ${appointmentData.technischeSchouwerName}`);
        }

        console.log('Creating HAS monteur appointments...');
        
const hasMonteurStartIndex = Math.floor(createdFlats.length / 3);
        
        for (let i = 0; i < Math.min(hasMonteurAppointments.length, createdFlats.length - hasMonteurStartIndex); i++) {
            const appointmentData = hasMonteurAppointments[i];
            const flat = createdFlats[hasMonteurStartIndex + i];

            const hasMonteur = await HASMonteur.create({
                flat: flat._id,
                ...appointmentData
            });

            flat.hasMonteur = hasMonteur._id;
            await flat.save();

            console.log(`Created HAS monteur appointment for: ${flat.adres} ${flat.huisNummer}${flat.toevoeging} - ${appointmentData.hasMonteurName} (${appointmentData.appointmentBooked.type})`);
        }

        console.log('🎉 Database seeded successfully!');
        console.log(`📊 Created/Updated: ${createdFlats.length} apartments`);
        console.log(`📅 Created: ${technischePlanningAppointments.length} technische planning appointments`);
        console.log(`🔧 Created: ${hasMonteurAppointments.length} HAS monteur appointments`);
        console.log('');
        console.log('Sample data includes:');
        console.log('- Realistic apartment information with various building types');
        console.log('- Technical inspection appointments for technische schouwers');
        console.log('- Installation and repair appointments for HAS monteurs');
        console.log('- Appointments scheduled across multiple weeks for realistic calendar view');
        console.log('- Various appointment types: Installation, Storing (repairs), maintenance');
        console.log('');
        console.log('Your app is now populated with demo data for customer presentation! 🚀');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
