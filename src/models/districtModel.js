// Defines the MongoDB schema for districts including district information and relationships to areas and buildings.

const mongoose = require('mongoose')
const districtSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
      required: true
    },
    buildings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
      },
    ],
    priority: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  },
)
const District = mongoose.model('District', districtSchema)
module.exports = District