// Handles user authentication including login, password verification, JWT token generation, and session management.

const bcrypt = require('bcrypt')
const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' })
    
    const foundUser = await User.findOne({ email: email }).exec()
    if (!foundUser) return res.sendStatus(401)
    
    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {
      // Extract role names where the value is truthy (1 or greater)
      const roles = Object.keys(foundUser.roles).filter(role => foundUser.roles[role])
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '90m' }
      )
      const refreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      )
      await foundUser.updateOne({ refreshToken: refreshToken }).exec()
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict', // None for cross-origin in production
        maxAge: 24 * 60 * 60 * 1000, 
      })
      res.json({ roles, accessToken })
    } else {
      res.sendStatus(401)
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
module.exports = { handleLogin }
