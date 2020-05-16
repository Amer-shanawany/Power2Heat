const mongoose = require('mongoose');
const SettingsSchema = new mongoose.Schema({
    boilerID: {
        type: String,
        required: true
    },
    volume: {
        type: Number,
    },
    wattage: {
        type: Number
    },
    mintemp: {
        type: Number,
    },
    maxtemp: {
        type: Number,
    },
    desiredtemp: {
        type: Number
    }

})

const Settings = mongoose.model('Settings', SettingsSchema)
module.exports = Settings;