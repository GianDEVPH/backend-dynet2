const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const connectDB = require('./config/db')
const path = require('path')
const verifyJWT = require('./middleware/verifyJWT')
const credentials = require('./middleware/credentials')
const corsOptions = require('./config/corsOptions')

// 🔹 1. Verbind met database
connectDB()

// Auto-run seeders if environment variable is set
if (process.env.RUN_SEEDERS === 'true') {
  console.log('Running seeders...')
  const { exec } = require('child_process')
  exec('npm run seed:all', (error, stdout, stderr) => {
    if (error) {
      console.error('Seeder error:', error)
    } else {
      console.log('Seeders completed:', stdout)
    }
  })
}

app.get('/api/test', (req, res) => {
  res.send('✅ Backend werkt!')
})

app.get('/', (req, res) => {
  res.send('Server is live!');
});


// 🔹 2. Middleware vóór routes
app.use(credentials)            // Handelt cookies & headers af
app.use(cors(corsOptions))      // <---- HIER CORS AANROEP
app.use(express.json())
app.use(cookieParser())

// 🔹 3. Routes importeren
const authRoutes = require('./routes/authRoutes')
const refreshRoutes = require('./routes/refreshRoutes')
const logoutRoutes = require('./routes/logoutRoutes')
const registerRoutes = require('./routes/registerRoutes')
const districtRoutes = require('./routes/districtRoutes')
const cityRoutes = require('./routes/cityRoutes')
const areaRoutes = require('./routes/areaRoutes')
const apartmentRoutes = require('./routes/apartmentRoutes')
const buildingRoutes = require('./routes/buildingRoutes')
const scheduleRoutes = require('./routes/scheduleRoutes')
const userRoutes = require('./routes/userRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const setupRoutes = require('./routes/setupRoutes')

// Try to load seeder routes with error handling
let seederRoutes;
try {
  seederRoutes = require('./routes/seederRoutes')
  console.log('✅ Seeder routes loaded successfully')
} catch (error) {
  console.error('❌ Error loading seeder routes:', error.message)
}

// 🔹 4. Routes gebruiken
app.use('/auth', authRoutes)
app.use('/register', registerRoutes)
app.use('/refresh', refreshRoutes)
app.use('/logout', logoutRoutes)
app.use('/api/district', verifyJWT, districtRoutes)
app.use('/api/city', verifyJWT, cityRoutes)
app.use('/api/area', verifyJWT, areaRoutes)
app.use('/api/apartment', verifyJWT, apartmentRoutes)
app.use('/api/building', verifyJWT, buildingRoutes)
app.use('/api/schedule', verifyJWT, scheduleRoutes)
app.use('/api/users', verifyJWT, userRoutes)
app.use('/api/dashboard', verifyJWT, dashboardRoutes)
app.use('/setup', setupRoutes)  // Public setup route for initial admin creation

// Only register seeder routes if they loaded successfully
if (seederRoutes) {
  app.use('/api/seeder', seederRoutes)
  console.log('✅ Seeder routes registered at /api/seeder')
} else {
  console.log('⚠️  Seeder routes not available')
}



// 🔹 6. Start server
// Kies poort van Render of fallback naar 5000 voor lokaal gebruik
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

