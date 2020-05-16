const mongoose = require("mongoose");
const BoilerdataSchema = new mongoose.Schema(
  {
    boilerID: { type: String },

    data: {
      timestamp: { type: String },

      power: { type: Boolean },
      charge: { type: String },
      temp: { type: String },
      volume: { type: String },
    },
  },
  { collection: "boilerdata" }
);

const Boilerdata = mongoose.model("boilerdata", BoilerdataSchema);
module.exports = Boilerdata;
