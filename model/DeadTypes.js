var mongoose = require("mongoose");

const DeadType = mongoose.model(
  "C_DeadTypes",
  new mongoose.Schema({
    DeadTypeId: {
      type: Number,
      required: true,
      unique: true,
    },
    Name: {
      type: String,
      default:""
    },
  })
);

module.exports = DeadType;
