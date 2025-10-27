// Database seeding script for creating initial users and development data.

const dotenv = require('dotenv')
dotenv.config({ path: '../../.env' })

const users = require('./data/users.js')
const User = require('../models/userModel.js')
const connectDB = require('../config/db.js')

const importData = async () => {
  try {
await connectDB()
await User.deleteMany({})
await User.insertMany(users)
    console.log('Data Imported!')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}
importData()
