// Defines the MongoDB schema for cities including city names and geographical organizational structure.

const mongoose = require('mongoose')
const citySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  areas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area'
  }]
})
const City = mongoose.model('City', citySchema)
module.exports = City
