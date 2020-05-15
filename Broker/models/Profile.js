const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
    id: {
        type: String
    },
    profiles: [{

        time: {
            type: Number
        },
        temp: {
            type: Number
        }

    }]

});

const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;