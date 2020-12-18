var mongoose = require("mongoose");

const Counter = mongoose.model(
  "C_Counters",
  new mongoose.Schema({
    CounterName: {
      type: String,
      required: true,
      unique: true,
    },
    Counter: {
      type: Number,
      default: 1,
    },
  })
);

module.exports = Counter;
