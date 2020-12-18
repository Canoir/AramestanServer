var mongoose = require("mongoose");

const State = mongoose.model(
  "C_States",
  new mongoose.Schema({
    StateId: {
      type: Number,
      required: true,
      unique: true,
    },
    Name: {
      type: String,
      default: "",
    },
    Rows: {
      type: Number,
      default: 1,
    },
    Count: {
      type: Number,
      default: 10,
    },
  })
);

module.exports = State;
