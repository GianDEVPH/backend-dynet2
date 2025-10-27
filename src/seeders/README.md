# Database Seeders

This directory contains all database seeding scripts and data for the Dynet appointment management system.

## Directory Structure

```
seeders/
├── data/                           # Seeding data files
│   ├── apartmentData.js           # Sample apartment/flat information
│   ├── hasMonteurAppointments.js  # HAS monteur appointment data
│   ├── roles_list.js              # System roles configuration
│   ├── technischePlanningAppointments.js  # Technical planning appointment data
│   └── users.js                   # User data with roles and colors
├── appointmentSeeder.js           # Main appointment and apartment seeder
├── extendedSeeder.js             # Additional appointments for comprehensive demo
├── seedAll.js                    # Master script to run all seeders
└── userSeeder.js                 # User and roles seeder
```

## Available Scripts

Run these commands from the backend root directory:

### Individual Seeders
```bash
npm run seed:users        # Create users with roles and colors
npm run seed:appointments # Create apartments and appointments  
npm run seed:extended     # Add additional appointments
```

### Master Seeder
```bash
npm run seed:all          # Run all seeders in sequence
```

## Seeded Data

### Users with Roles and Colors
- **Admin**: `admin` (red #e74c3c)
- **TechnischePlanning**: `john` (blue #3498db)
- **TechnischeSchouwer**: 
  - `james` (purple #9b59b6)
  - `Anna Johnson` (orange #e67e22)
  - `Mark Brown` (dark blue-gray #34495e)
- **Werkvoorbereider**: `jack` (orange #f39c12)
- **HASPlanning**: `jane` (green #2ecc71)
- **HASMonteur**: 
  - `jasper` (teal #1abc9c)
  - `Sarah Davis` (yellow #f39c12)
  - `Mike Wilson` (purple #8e44ad)

### Appointments
- **15+ Technische Planning Appointments** assigned to TechnischeSchouwer role users
- **20+ HAS Monteur Appointments** assigned to HASMonteur role users
- **18+ Sample Apartments** with realistic data
- **Multiple weeks** of appointments for comprehensive calendar view

### Appointment Types
- **Technische Planning**: Technical inspections and schouwing appointments
- **HAS Installations**: New fiber optic installations and upgrades
- **HAS Repairs (Storing)**: Internet/TV connectivity issues and troubleshooting
- **HAS Complaints**: Customer service and follow-up appointments

## Features

✅ **Role-based Assignment**: Appointments assigned to users with correct roles  
✅ **Color Coding**: Each user has unique color for visual identification  
✅ **Realistic Data**: Professional appointment details and scenarios  
✅ **Filter Compatible**: Works with role-based filtering in agenda views  
✅ **Demo Ready**: Comprehensive data for customer presentations  

## Usage Notes

1. **Run seeders in order**: Users → Appointments → Extended (or use `seed:all`)
2. **Environment**: Ensure `.env` file is configured with MongoDB connection
3. **Clean slate**: Seeders clear existing data before inserting new data
4. **Development only**: These seeders are for development and demo purposes

## Customization

To modify seeded data:
1. Edit files in the `data/` directory
2. Update appointment assignments in seeder scripts
3. Adjust colors and roles in `users.js`
4. Re-run appropriate seeder scripts

---

*Part of the Dynet Appointment Management System*
