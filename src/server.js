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

// 🔹 5. Test endpoint
app.get('/', (req, res) => {
  res.send('✅ Backend API is live and running!')
})
app.get('/api/test', (req, res) => {
  res.send('✅ Backend werkt!')
})

// 🔹 6. Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
