const mongoose = require('mongoose');
const BoilerSchema = new mongoose.Schema({
    nodeID:{
        type:String,
        required:true
    },
    userID:{
        type:String,
        required:true
    },
    capacity:{
        type: Number
     },
    surface:{
        type:Number
     },
    power:{
        type:Number
    }
});

const Boiler = mongoose.model('Boiler',BoilerSchema);
module.exports = Boiler;