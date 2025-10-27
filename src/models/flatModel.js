// Defines the MongoDB schema for individual apartments/flats including addresses, status information, and relationships to various planning models.

const mongoose = require('mongoose');
const flatSchema = mongoose.Schema({
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
    },
    zoeksleutel: {
        type: String,
        default: '',
    },
    postcode: {
        type: String,
        default: ''
    },
    complexNaam: {
        type: String,
        default: '',
    },
    soortBouw: {
        type: String,
        default: '',
    },
    adres: {
        type: String,
        default: '',
    },
    huisNummer: {
        type: String,
        default: '',
    },
    toevoeging: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        default: '',
    },
    team: {
        type: String,
        default: '',
    },
    fcStatusHas: {
        type: String,
        default: '',
    },
    ipVezelwaarde: {
        type: String,
        default: '',
    },
    toelichtingStatus: {
        type: String,
        default: ''
    },
    laswerkAP: {
        type: String,
        default: '',
    },
    laswerkDP: {
        type: String,
        default: '',
    },
    ap: {
        type: String,
        default: '',
    },
    dp: {
        type: String,
        default: '',
    },
    odf: {
        type: String,
        default: '',
    },
    odfPositie: {
        type: String,
        default: '',
    },
    tkNummer: {
        type: String,
        default: '',
    },
    technischePlanning: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TechnischePlanning',
    },
    technischeSchouwer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TechnischeSchouwer',
    },
    werkvoorbereider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Werkvoorbereider',
    },
    hasPlanning: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HASPlanning',
    },
    hasMonteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HASMonteur',
    }
}, {
    timestamps: true
});
const Flat = mongoose.model('Flat', flatSchema);
module.exports = Flat;
