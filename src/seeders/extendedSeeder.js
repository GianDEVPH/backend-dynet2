// Extended seeder for additional appointments to create a fully populated calendar view

require('dotenv').config({ path: '../../.env' });
const connectDB = require('../config/db');
const Flat = require('../models/flatModel');
const TechnischePlanning = require('../models/technischePlanningModel');
const HASMonteur = require('../models/hasMonteurModel');

const additionalTechnischeAppointments = [
    {
        telephone: '+31 6 13579246',
        vveWocoName: 'VVE Future Living',
        technischeSchouwerName: 'james',
        readyForSchouwer: true,
        signed: true,
        calledAlready: true,
        timesCalled: 1,
        appointmentBooked: {
            date: new Date('2025-09-24T09:00:00Z'),
            startTime: '09:00',
            endTime: '10:30',
            weekNumber: 40
        },
        additionalNotes: 'Smart home systeem controle',
        smsSent: true
    },
    {
        telephone: '+31 6 24681357',
        vveWocoName: 'VVE Tech Hub',
        technischeSchouwerName: 'Anna Johnson',
        readyForSchouwer: true,
        signed: false,
        calledAlready: true,
        timesCalled: 2,
        appointmentBooked: {
            date: new Date('2025-09-25T14:00:00Z'),
            startTime: '14:00',
            endTime: '15:30',
            weekNumber: 40
        },
        additionalNotes: 'Hercontrole na aanpassingen',
        smsSent: true
    },
    {
        telephone: '+31 6 35792468',
        vveWocoName: 'VVE City Center',
        technischeSchouwerName: 'Mark Brown',
        readyForSchouwer: true,
        signed: true,
        calledAlready: true,
        timesCalled: 1,
        appointmentBooked: {
            date: new Date('2025-09-26T11:00:00Z'),
            startTime: '11:00',
            endTime: '12:00',
            weekNumber: 40
        },
        additionalNotes: 'Routine controle nieuwbouw',
        smsSent: true
    }
];

const additionalHasAppointments = [
    {
        appointmentBooked: {
            type: 'HAS',
            date: new Date('2025-09-24T13:00:00Z'),
            startTime: '13:00',
            endTime: '16:00',
            weekNumber: 40,
            complaintDetails: 'Business package installatie kantoorpand'
        },
        hasMonteurName: 'jasper'
    },
    {
        appointmentBooked: {
            type: 'Storing',
            date: new Date('2025-09-25T10:00:00Z'),
            startTime: '10:00',
            endTime: '11:30',
            weekNumber: 40,
            complaintDetails: 'VoIP telefonie werkt niet na wijziging netwerk'
        },
        hasMonteurName: 'Sarah Davis'
    },
    {
        appointmentBooked: {
            type: 'Complaint',
            date: new Date('2025-09-26T15:00:00Z'),
            startTime: '15:00',
            endTime: '16:30',
            weekNumber: 40,
            complaintDetails: 'Klacht over servicekwaliteit - tweede bezoek'
        },
        hasMonteurName: 'jasper'
    }
];

const extendSeeder = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB for extended seeding');

        const additionalApartments = [
            {
                zoeksleutel: 'NH-AMS-016',
                postcode: '1026EF',
                complexNaam: 'Future Living',
                soortBouw: 'Smart Building',
                adres: 'Tech Street',
                huisNummer: '100',
                toevoeging: 'A',
                email: 'tech1@email.com',
                team: 'Team Innovation',
                fcStatusHas: 'Smart Ready',
                ipVezelwaarde: '192.168.1.116'
            },
            {
                zoeksleutel: 'NH-AMS-017',
                postcode: '1027GH',
                complexNaam: 'Tech Hub',
                soortBouw: 'Business Complex',
                adres: 'Innovation Lane',
                huisNummer: '250',
                toevoeging: 'B',
                email: 'business@email.com',
                team: 'Team Business',
                fcStatusHas: 'Enterprise Ready',
                ipVezelwaarde: '192.168.1.117'
            },
            {
                zoeksleutel: 'NH-AMS-018',
                postcode: '1028IJ',
                complexNaam: 'City Center',
                soortBouw: 'Mixed Commercial',
                adres: 'Central Plaza',
                huisNummer: '75',
                toevoeging: '',
                email: 'plaza@email.com',
                team: 'Team Premium',
                fcStatusHas: 'VIP Service',
                ipVezelwaarde: '192.168.1.118'
            }
        ];

        console.log('Creating additional apartments...');
        const newFlats = [];
        
        for (const apartmentInfo of additionalApartments) {
            const flat = await Flat.create(apartmentInfo);
            newFlats.push(flat);
            console.log(`Created additional apartment: ${flat.adres} ${flat.huisNummer}${flat.toevoeging}`);
        }

        console.log('Adding more technische planning appointments...');
        for (let i = 0; i < additionalTechnischeAppointments.length; i++) {
            const appointmentData = additionalTechnischeAppointments[i];
            const flat = newFlats[i];

            const planning = await TechnischePlanning.create({
                flat: flat._id,
                ...appointmentData
            });

            flat.technischePlanning = planning._id;
            await flat.save();

            console.log(`Added technische planning: ${flat.adres} - ${appointmentData.technischeSchouwerName}`);
        }

        console.log('Adding more HAS monteur appointments...');
        for (let i = 0; i < additionalHasAppointments.length; i++) {
            const appointmentData = additionalHasAppointments[i];
            const flat = newFlats[i];

            const hasMonteur = await HASMonteur.create({
                flat: flat._id,
                ...appointmentData
            });

            if (!flat.hasMonteur) {
                flat.hasMonteur = hasMonteur._id;
                await flat.save();
            }

            console.log(`Added HAS appointment: ${flat.adres} - ${appointmentData.hasMonteurName} (${appointmentData.appointmentBooked.type})`);
        }

        console.log('🎉 Extended seeding completed!');
        console.log(`📊 Added: ${newFlats.length} more apartments`);
        console.log(`📅 Added: ${additionalTechnischeAppointments.length} more technische planning appointments`);
        console.log(`🔧 Added: ${additionalHasAppointments.length} more HAS monteur appointments`);
        console.log('');
        console.log('Your calendar is now even more populated for a comprehensive demo! 📅✨');
        
        process.exit(0);
    } catch (error) {
        console.error('Error in extended seeding:', error);
        process.exit(1);
    }
};

extendSeeder();
