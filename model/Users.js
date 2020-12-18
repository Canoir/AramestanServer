var mongoose = require("mongoose");

const User = mongoose.model(
  "C_Users",
  new mongoose.Schema({
    RoleId: {
      type: Number,
      default: 4,
    },
    Username: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      default: "admin",
    },
    Name: {
      type: String,
      default: "",
    },
    AccessToken: {
      type: String,
    },
  })
);

module.exports = User;
