const mongoose = require("mongoose");

const Setting = mongoose.model(
  "C_Settings",
  new mongoose.Schema({
    i: {
      type: Number,
      required: true,
      unique: true,
    },
    AramestanManager: {
      type: String,
    },
    AramestanBankAccount: {
      type: String,
    },
  })
);

module.exports = Setting;
