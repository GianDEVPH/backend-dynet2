// Handles user authentication including login, password verification, JWT token generation, and session management.

const bcrypt = require('bcrypt')
const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const handleLogin = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' })
  const foundUser = await User.findOne({ email: email }).exec()
  if (!foundUser) return res.sendStatus(401)
  const match = await bcrypt.compare(password, foundUser.password)
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean)
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
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, 
    })
    res.json({ roles, accessToken })
  } else {
    res.sendStatus(401)
  }
}
module.exports = { handleLogin }
