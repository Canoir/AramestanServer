var mongoose = require("mongoose");

const Cost = mongoose.model(
  "C_Costs",
  new mongoose.Schema({
    CostId: {
      type: Number,
      required: true,
      unique: true,
    },
    Name: {
      type: String,
      default: "",
    },
    Price: {
      type: Number,
      default: 0,
    },
  })
);

module.exports = Cost;
