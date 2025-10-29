// Manages user logout operations including JWT token invalidation and session cleanup.

const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const handleLogout = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) 
  const refreshToken = cookies.jwt
  const foundUser = await User.findOne({ refreshToken: refreshToken }).exec()
  if (!foundUser) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict', 
    })
    res.sendStatus(204) 
    return
  }
  await User.findOneAndUpdate(
    { refreshToken: refreshToken },
    { refreshToken: '' },
  )
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict', 
    maxAge: 24 * 60 * 60 * 1000,
  })
  res.sendStatus(204) 
}
module.exports = { handleLogout }
