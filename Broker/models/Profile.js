const mongoose = require('mongoose');
const subProfileSchema = new mongoose.Schema({

    time: {
        type: Number
    },
    temp: {
        type: Number
    }

}, { _id: false });
const ProfileSchema = new mongoose.Schema({
    id: {
        type: String
    },
    profiles: [subProfileSchema]

});

const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;