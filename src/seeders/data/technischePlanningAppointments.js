// Sample technische planning appointments data for seeding the database with realistic appointment scenarios

const technischePlanningAppointments = [
    {
        telephone: '+31 6 12345678',
        vveWocoName: 'VVE De Boomgaard',
        technischeSchouwerName: 'james',
        readyForSchouwer: true,
        signed: false,
        calledAlready: true,
        timesCalled: 2,
        appointmentBooked: {
            date: new Date('2025-09-08T09:00:00Z'),
            startTime: '09:00',
            endTime: '10:30',
            weekNumber: 37
        },
        additionalNotes: 'Klant vraagt om vroege afspraak vanwege werk',
        smsSent: true
    },
    {
        telephone: '+31 6 23456789',
        vveWocoName: 'VVE Nieuwbouw Central',
        technischeSchouwerName: 'Anna Johnson',
        readyForSchouwer: true,
        signed: true,
        calledAlready: true,
        timesCalled: 1,
        appointmentBooked: {
            date: new Date('2025-09-09T13:30:00Z'),
            startTime: '13:30',
            endTime: '15:00',
            weekNumber: 37
        },
        additionalNotes: 'Tweede bezoek - eerste keer was niemand thuis',
        smsSent: true
    },
    {
        telephone: '+31 6 34567890',
        vveWocoName: 'VVE Stadswijk',
        technischeSchouwerName: 'Mark Brown',
        readyForSchouwer: false,
        signed: false,
        calledAlready: false,
        timesCalled: 0,
        appointmentBooked: {
            date: new Date('2025-09-10T10:00:00Z'),
            startTime: '10:00',
            endTime: '11:00',
            weekNumber: 37
        },
        additionalNotes: 'Wacht op VVE goedkeuring',
        smsSent: false
    },
    {
        telephone: '+31 6 45678901',
        vveWocoName: 'VVE Groene Hart',
        technischeSchouwerName: 'james',
        readyForSchouwer: true,
        signed: false,
        calledAlready: true,
        timesCalled: 3,
        appointmentBooked: {
            date: new Date('2025-09-11T14:00:00Z'),
            startTime: '14:00',
            endTime: '15:30',
            weekNumber: 37
        },
        additionalNotes: 'Klant heeft specifieke tijdwensen',
        smsSent: true
    },
    {
        telephone: '+31 6 56789012',
        vveWocoName: 'VVE Waterfront',
        technischeSchouwerName: 'Anna Johnson',
        readyForSchouwer: true,
        signed: true,
        calledAlready: true,
        timesCalled: 1,
        appointmentBooked: {
            date: new Date('2025-09-12T08:30:00Z'),
            startTime: '08:30',
            endTime: '10:00',
            weekNumber: 37
        },
        additionalNotes: 'Complexe installatie - extra tijd nodig',
        smsSent: true
    },
    {
        telephone: '+31 6 67890123',
        vveWocoName: 'VVE De Linden',
        technischeSchouwerName: 'Mark Brown',
        readyForSchouwer: true,
        signed: false,
        calledAlready: true,
        timesCalled: 2,
        appointmentBooked: {
            date: new Date('2025-09-15T11:00:00Z'),
            startTime: '11:00',
            endTime: '12:30',
            weekNumber: 38
        },
        additionalNotes: 'Hercontrole na eerdere problemen',
        smsSent: true
    },
    {
        telephone: '+31 6 78901234',
        vveWocoName: 'VVE Parkzicht',
        technischeSchouwerName: 'Anna Johnson',
        readyForSchouwer: true,
        signed: true,
        calledAlready: true,
        timesCalled: 1,
        appointmentBooked: {
            date: new Date('2025-09-16T15:00:00Z'),
            startTime: '15:00',
            endTime: '16:00',
            weekNumber: 38
        },
        additionalNotes: 'Standaard technische schouwing',
        smsSent: true
    },
    {
        telephone: '+31 6 89012345',
        vveWocoName: 'VVE Modern Living',
        technischeSchouwerName: 'Anna Johnson',
        readyForSchouwer: false,
        signed: false,
        calledAlready: true,
        timesCalled: 4,
        appointmentBooked: {
            date: new Date('2025-09-17T09:30:00Z'),
            startTime: '09:30',
            endTime: '11:00',
            weekNumber: 38
        },
        additionalNotes: 'Klant moeilijk bereikbaar - meerdere pogingen',
        smsSent: false
    },
    {
        telephone: '+31 6 90123456',
        vveWocoName: 'VVE Centrum Plaza',
        technischeSchouwerName: 'Mark Brown',
        readyForSchouwer: true,
        signed: true,
        calledAlready: true,
        timesCalled: 1,
        appointmentBooked: {
            date: new Date('2025-09-18T13:00:00Z'),
            startTime: '13:00',
            endTime: '14:30',
            weekNumber: 38
        },
        additionalNotes: 'VIP klant - prioriteit behandeling',
        smsSent: true
    },
    {
        telephone: '+31 6 01234567',
        vveWocoName: 'VVE Rivierpark',
        technischeSchouwerName: 'Mark Brown',
        readyForSchouwer: true,
        signed: false,
        calledAlready: true,
        timesCalled: 2,
        appointmentBooked: {
            date: new Date('2025-09-19T10:30:00Z'),
            startTime: '10:30',
            endTime: '12:00',
            weekNumber: 38
        },
        additionalNotes: 'Toegangsproblemen vorige keer - sleutel geregeld',
        smsSent: true
    },
    {
        telephone: '+31 6 11223344',
        vveWocoName: 'VVE De Toren',
        technischeSchouwerName: 'james',
        readyForSchouwer: true,
        signed: true,
        calledAlready: true,
        timesCalled: 1,
        appointmentBooked: {
            date: new Date('2025-09-22T08:00:00Z'),
            startTime: '08:00',
            endTime: '09:30',
            weekNumber: 39
        },
        additionalNotes: 'Eerste afspraak van de week',
        smsSent: true
    },
    {
        telephone: '+31 6 22334455',
        vveWocoName: 'VVE Residential Complex',
        technischeSchouwerName: 'Anna Johnson',
        readyForSchouwer: true,
        signed: false,
        calledAlready: true,
        timesCalled: 3,
        appointmentBooked: {
            date: new Date('2025-09-23T14:30:00Z'),
            startTime: '14:30',
            endTime: '16:00',
            weekNumber: 39
        },
        additionalNotes: 'Nacontrole na installatie vorige maand',
        smsSent: true
    }
];

module.exports = technischePlanningAppointments;
