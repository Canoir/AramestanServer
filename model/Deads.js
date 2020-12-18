var mongoose = require("mongoose");

const Dead = mongoose.model(
  "C_Dead",
  new mongoose.Schema({
    FullName: {
      type: String,
      default: "",
    },
    BirthDate: {
      type: Date,
      default: new Date(),
    },
    DeathDate: {
      type: Date,
      default: new Date(),
    },
    FatherName: {
      type: String,
      default: "",
    },
    StateId: {
      // Related to C_State
      type: Number,
      default: 0,
    },
    Row: {
      type: Number,
      default: 0,
    },
    GravePlaceId: {
      type: Number,
      default: 0,
    },
    DeadTypeId: {
      //Related to C_DeadType
      type: Number,
      default: 0,
    },
    NationalId: {
      type: String,
      required: true,
      unique: true,
    },
    DeathReason: {
      type: String,
      default: "",
    },
    ImageName: {
      type: String,
      default: "",
    },
    Latitiude: {
      type: String,
    },
    Longtitude: {
      type: String,
    },
    //Update V2
    IntermentDate: {
      type: Date,
    },
    IncomeDate: {
      type: Date,
    },
    DoctorName: {
      type: String,
    },
    IntermentPermitNumber: {
      type: String,
    },
    DeathPlace: {
      type: String,
    },
    FollowerName: {
      type: String,
    },
    FollowerNationalId: {
      type: String,
    },
    FollowerRelToDeadPerson: {
      type: String,
    },
    FollowerPhoneNumber: {
      type: String,
    },
    Costs: {
      type: Array,
    },
    TotalCosts: {
      type: Number,
    },
    Details: {
      type: String,
    },
    isInside: {
      type: Boolean,
      default: true,
    },
    Accepted: {
      type: Boolean,
      default: false,
    },
    // Update V3
    EditDate: {
      type: Date,
      default: new Date(),
    },
    StatementImageName: {
      type: String,
      default: "",
    },
  })
);

module.exports = Dead;
