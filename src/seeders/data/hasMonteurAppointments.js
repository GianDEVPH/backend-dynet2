// Sample HAS monteur appointments data for seeding the database with realistic installation scenarios

const hasMonteurAppointments = [
    {
        appointmentBooked: {
            type: 'HAS',
            date: new Date('2025-09-08T08:00:00Z'),
            startTime: '08:00',
            endTime: '12:00',
            weekNumber: 37,
            complaintDetails: 'Nieuwe installatie fiber optic aansluiting'
        },
        hasMonteurName: 'jasper'
    },
    {
        appointmentBooked: {
            type: 'Storing',
            date: new Date('2025-09-08T13:00:00Z'),
            startTime: '13:00',
            endTime: '15:00',
            weekNumber: 37,
            complaintDetails: 'Geen internet signaal, modem reageert niet'
        },
        hasMonteurName: 'Sarah Davis'
    },
    {
        appointmentBooked: {
            type: 'HAS',
            date: new Date('2025-09-09T09:00:00Z'),
            startTime: '09:00',
            endTime: '13:00',
            weekNumber: 37,
            complaintDetails: 'Upgrade naar Gigabit internet + TV pakket'
        },
        hasMonteurName: 'Mike Wilson'
    },
    {
        appointmentBooked: {
            type: 'Storing',
            date: new Date('2025-09-09T14:30:00Z'),
            startTime: '14:30',
            endTime: '16:00',
            weekNumber: 37,
            complaintDetails: 'Intermitterende verbinding, kabel beschadigd'
        },
        hasMonteurName: 'Sarah Davis'
    },
    {
        appointmentBooked: {
            type: 'HAS',
            date: new Date('2025-09-10T10:00:00Z'),
            startTime: '10:00',
            endTime: '14:00',
            weekNumber: 37,
            complaintDetails: 'Complete nieuwe setup voor nieuwbouw appartement'
        },
        hasMonteurName: 'Mike Wilson'
    },
    {
        appointmentBooked: {
            type: 'Storing',
            date: new Date('2025-09-11T08:30:00Z'),
            startTime: '08:30',
            endTime: '10:00',
            weekNumber: 37,
            complaintDetails: 'TV signaal zwak, kanalen vallen weg'
        },
        hasMonteurName: 'Sarah Davis'
    },
    {
        appointmentBooked: {
            type: 'HAS',
            date: new Date('2025-09-11T15:00:00Z'),
            startTime: '15:00',
            endTime: '17:00',
            weekNumber: 37,
            complaintDetails: 'Extra netwerkaansluiting in slaapkamer'
        },
        hasMonteurName: 'jasper'
    },
    {
        appointmentBooked: {
            type: 'Storing',
            date: new Date('2025-09-12T11:00:00Z'),
            startTime: '11:00',
            endTime: '12:30',
            weekNumber: 37,
            complaintDetails: 'Router herstart constant, overheating probleem'
        },
        hasMonteurName: 'Sarah Davis'
    },
    {
        appointmentBooked: {
            type: 'HAS',
            date: new Date('2025-09-15T08:00:00Z'),
            startTime: '08:00',
            endTime: '11:00',
            weekNumber: 38,
            complaintDetails: 'WiFi versterker installatie voor groot appartement'
        },
        hasMonteurName: 'jasper'
    },
    {
        appointmentBooked: {
            type: 'Storing',
            date: new Date('2025-09-15T13:30:00Z'),
            startTime: '13:30',
            endTime: '15:00',
            weekNumber: 38,
            complaintDetails: 'Upload snelheid veel te laag voor zakelijk gebruik'
        },
        hasMonteurName: 'Sarah Davis'
    },
    {
        appointmentBooked: {
            type: 'HAS',
            date: new Date('2025-09-16T09:30:00Z'),
            startTime: '09:30',
            endTime: '12:30',
            weekNumber: 38,
            complaintDetails: 'Verhuizing - aansluiting verplaatsen naar nieuwe locatie'
        },
        hasMonteurName: 'jasper'
    },
    {
        appointmentBooked: {
            type: 'Storing',
            date: new Date('2025-09-16T14:00:00Z'),
            startTime: '14:00',
            endTime: '15:30',
            weekNumber: 38,
            complaintDetails: 'Powerline adapters werken niet meer na stroomuitval'
        },
        hasMonteurName: 'Sarah Davis'
    },
    {
        appointmentBooked: {
            type: 'HAS',
            date: new Date('2025-09-17T10:00:00Z'),
            startTime: '10:00',
            endTime: '13:00',
            weekNumber: 38,
            complaintDetails: 'Gaming setup - dedicated lijn voor lage latency'
        },
        hasMonteurName: 'jasper'
    },
    {
        appointmentBooked: {
            type: 'Storing',
            date: new Date('2025-09-18T08:30:00Z'),
            startTime: '08:30',
            endTime: '10:00',
            weekNumber: 38,
            complaintDetails: 'Firmware update mislukt, apparaat niet meer toegankelijk'
        },
        hasMonteurName: 'Sarah Davis'
    },
    {
        appointmentBooked: {
            type: 'HAS',
            date: new Date('2025-09-18T15:00:00Z'),
            startTime: '15:00',
            endTime: '17:30',
            weekNumber: 38,
            complaintDetails: 'Mesh netwerk installatie voor kantoor aan huis'
        },
        hasMonteurName: 'jasper'
    },
    {
        appointmentBooked: {
            type: 'Storing',
            date: new Date('2025-09-19T09:00:00Z'),
            startTime: '09:00',
            endTime: '10:30',
            weekNumber: 38,
            complaintDetails: 'DNS problemen, websites laden niet correct'
        },
        hasMonteurName: 'Sarah Davis'
    },
    {
        appointmentBooked: {
            type: 'HAS',
            date: new Date('2025-09-22T08:30:00Z'),
            startTime: '08:30',
            endTime: '11:30',
            weekNumber: 39,
            complaintDetails: 'Nieuwbouw - eerste installatie glasvezel'
        },
        hasMonteurName: 'jasper'
    },
    {
        appointmentBooked: {
            type: 'Storing',
            date: new Date('2025-09-22T13:00:00Z'),
            startTime: '13:00',
            endTime: '14:30',
            weekNumber: 39,
            complaintDetails: 'Connectiviteit problemen na bouwwerkzaamheden'
        },
        hasMonteurName: 'Sarah Davis'
    },
    {
        appointmentBooked: {
            type: 'HAS',
            date: new Date('2025-09-23T10:00:00Z'),
            startTime: '10:00',
            endTime: '14:00',
            weekNumber: 39,
            complaintDetails: 'Bedrijfsaansluiting met redundantie voor continuïteit'
        },
        hasMonteurName: 'jasper'
    },
    {
        appointmentBooked: {
            type: 'Storing',
            date: new Date('2025-09-23T15:30:00Z'),
            startTime: '15:30',
            endTime: '17:00',
            weekNumber: 39,
            complaintDetails: 'Port forwarding werkt niet voor security systeem'
        },
        hasMonteurName: 'Sarah Davis'
    }
];

module.exports = hasMonteurAppointments;
