const mongoose = require("mongoose");

const Statement = mongoose.model(
  "C_Statements",
  new mongoose.Schema({
    NationalId: {
      type: String,
      required: true,
      unique: true,
    },
    Date: {
      type: Date,
      default: new Date(),
    },
    ImageName: {
      type: String,
      default: "",
    },
  })
);

module.exports = Statement;
