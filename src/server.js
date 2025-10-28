// Main server entry point configuring Express server, middleware, routes, and database connection.

const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const connectDB = require('./config/db')
const path = require('path');
const verifyJWT = require('./middleware/verifyJWT')
const credentials = require('./middleware/credentials')
const corsOptions = require('./config/corsOptions')
const authRoutes = require('./routes/authRoutes')
const refreshRoutes = require('./routes/refreshRoutes')
const logoutRoutes = require('./routes/logoutRoutes')
const registerRoutes = require('./routes/registerRoutes')
const districtRoutes = require('./routes/districtRoutes.js')
const cityRoutes = require('./routes/cityRoutes')
const areaRoutes = require('./routes/areaRoutes')
const apartmentRoutes = require('./routes/apartmentRoutes')
const buildingRoutes = require('./routes/buildingRoutes.js')
const scheduleRoutes = require('./routes/scheduleRoutes')
const userRoutes = require('./routes/userRoutes.js')
const dashboardRoutes = require('./routes/dashboardRoutes')
connectDB()
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
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
const PORT = process.env.PORT || 5000
app.get('/', (req, res) => {
  res.send('✅ Backend API is live and running!');
});
app.get("/api/test", (req, res) => {
  res.send("✅ Backend werkt!");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
