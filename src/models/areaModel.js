// Defines the MongoDB schema for geographical areas including area names, relationships to cities, and organizational structure.

const mongoose = require('mongoose')
const areaSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    districts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    }]
});
const Area = mongoose.model('Area', areaSchema);
module.exports = Area