// Database connection configuration for MongoDB including connection string and options.

const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
mongoose.set('strictQuery', false)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}
module.exports = connectDB
