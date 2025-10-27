// Defines the MongoDB schema for building layout information including floor plans and structural data.

const mongoose = require('mongoose')
const layoutSchema = mongoose.Schema({
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
  },
  blocks: [
    {
      blockType: { type: String },
      firstFloor: { type: Number },
      topFloor: { type: Number },
      floors: [
        {
          floor: { type: Number },
          flat: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat' },
          cableNumber: { type: Number },
          cableLength: { type: Number },
        },
      ],
    },
  ],
})
const Layout = mongoose.model('Layout', layoutSchema)
module.exports = Layout
