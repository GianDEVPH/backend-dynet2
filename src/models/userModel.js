// Defines the MongoDB schema for user accounts including authentication credentials, roles, and user profile information.

const mongoose = require('mongoose')
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      Admin: Number,
      TechnischePlanning: Number,
      TechnischeSchouwer: Number,
      Werkvoorbereider: Number,
      HASPlanning: Number,
      HASMonteur: Number,
    },
    color: {
      type: String,
default: '#3498db',
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Color must be a valid hex color code'
      }
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  },
)
const User = mongoose.model('User', userSchema)
module.exports = User
