const mongoose = require("mongoose");
const BoilerSchema = new mongoose.Schema({
  boilerID: {
    type: String,
    required: true,
  },

  data: {
    timestamp: {
      type: Number,
    },
    power: {
      type: Boolean,
    },
    charge: {
      type: Number,
    },
    temp: {
      type: Number,
    },
    volume: {
      type: Number,
    },
  },
});

const Boiler = mongoose.model("Boiler", BoilerSchema);
module.exports = Boiler;
