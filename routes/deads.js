const express = require("express");
const Dead = require("../model/Deads");
const DeadType = require("../model/DeadTypes");
const States = require("../model/States");
const Cost = require("../model/Costs");
const { checkAuth, roleManaging, Roles } = require("./utils");
const router = express.Router();

router.get(
  "/",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //Get Deaths(Search and All)
  async (req, res) => {
    let dead = [];
    let count;
    if (!req.query.id) req.query.id = 1;
    if (req.query.q) {
      const searchList = [];
      req.query.q.split(" ").forEach((el) => {
        searchList.push({ FullName: { $regex: el, $options: "i" } });
      });
      if(req.query.q2){
        req.query.q2.split(" ").forEach((el) => {
          searchList.push({ FatherName: { $regex: el, $options: "i" } });
        });
      }
      dead = await Dead.find({ $and: searchList })
        .sort({ EditDate: -1 })
        .skip((Number(req.query.id) - 1) * 20)
        .limit(20);
      count = await Dead.countDocuments({ $and: searchList });
    } else {
      count = await Dead.estimatedDocumentCount({});
      dead = await Dead.find({})
        .sort({ EditDate: -1 })
        .skip((Number(req.query.id) - 1) * 20)
        .limit(20);
    }
    dead.forEach((el) => {
      el.deathDate = res.locals.moment(el.DeathDate + "").format("YYYY/MM/DD");
    });
    res.render("deads", {
      user: res.locals.user,
      Deads: dead,
      max: Number((count) / 20),
      index: req.query.id,
    });
  }
);

router.get(
  "/details/:id",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //Death Data Details!
  async (req, res) => {
    const moment = res.locals.moment;
    const dead = await Dead.findOne({ NationalId: req.params.id });
    dead.State = (
      await States.findOne({ StateId: dead.StateId }).select("Name")
    ).Name;
    dead.DeadType = (
      await DeadType.findOne({ DeadTypeId: dead.DeadTypeId }).select("Name")
    ).Name;
    dead.deathDate = moment(dead.DeathDate + "").format("YYYY/MM/DD");
    dead.birthDate = moment(dead.BirthDate + "").format("YYYY/MM/DD");
    dead.intermentDate =
      dead.IntermentDate != null
        ? moment(dead.IntermentDate + "").format("YYYY/MM/DD")
        : "-";
    dead.incomeDate =
      dead.IncomeDate != null
        ? moment(dead.IncomeDate + "").format("YYYY/MM/DD")
        : "-";
    res.render("dead", {
      user: res.locals.user,
      Dead: dead,
    });
  }
);

router.get(
  "/add",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //Add Death Page!
  async function (req, res) {
    res.render("deads_add", {
      user: res.locals.user,
      DeadTypes: await DeadType.find({}),
      States: await States.find({}),
    });
  }
);

router.post(
  "/add",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //Add Death Post!
  async function (req, res) {
    try {
      await new Dead({
        FullName: req.body.fullName,
        BirthDate: req.body.birthDate,
        DeathDate: req.body.deathDate,
        FatherName: req.body.fatherName,
        StateId: req.body.stateId,
        Row: req.body.row,
        GravePlaceId: req.body.graveStateId,
        DeadTypeId: req.body.deathType,
        NationalId: req.body.nationalCode,
        DeathReason: req.body.deathReason,
        EditDate: new Date(),
      }).save();
      if (req.body.dirType == "0") res.redirect("/deads/");
      else res.redirect("/deads/additional/" + req.body.nationalCode);
    } catch (e) {
      res.redirect("/deads/");
    }
  }
);

router.get(
  "/edit/:id",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //Edit Dead Person Page!
  async function (req, res) {
    res.render("deads_edit", {
      user: res.locals.user,
      Dead: await Dead.findOne({ NationalId: req.params.id }),
      DeadTypes: await DeadType.find({}),
      States: await States.find({}),
    });
  }
);

router.post(
  "/edit",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //Edit dead person data Post!
  async function (req, res) {
    try {
      const dead = await Dead.findOne({ NationalId: req.body._id }).select(
        "FullName Row BirthDate DeathDate FatherName StateId GravePlaceId DeadTypeId NationalId DeathReason"
      );
      await dead.updateOne({
        FullName: req.body.fullName == "" ? dead.FullName : req.body.fullName,
        BirthDate:
          req.body.birthDate == "" ? dead.BirthDate : req.body.birthDate,
        DeathDate:
          req.body.deathDate == "" ? dead.DeathDate : req.body.deathDate,
        FatherName:
          req.body.fatherName == "" ? dead.FatherName : req.body.fatherName,
        StateId: req.body.stateId == "" ? dead.StateId : req.body.stateId,
        Row: req.body.row == "" ? dead.Row : req.body.row,
        GravePlaceId:
          req.body.graveStateId == ""
            ? dead.GravePlaceId
            : req.body.graveStateId,
        DeadTypeId:
          req.body.deathType == "" ? dead.DeadTypeId : req.body.deathType,
        NationalId:
          req.body.nationalCode == "" ? dead.NationalId : req.body.nationalCode,
        DeathReason:
          req.body.deathReason == "" ? dead.DeathReason : req.body.deathReason,
        EditDate: new Date(),
      });
    } catch (e) {
      if (e) throw e;
    }
    if (req.body.dirType == "1") {
      res.redirect("/deads/additional/" + req.body.nationalCode);
    } else res.redirect("/deads/");
  }
);

router.post(
  "/remove",
  checkAuth,
  roleManaging([Roles.God]),
  //Remove a dead Person post!
  async (req, res) => {
    try {
      await Dead.findByIdAndRemove(req.body.user_remove_item_id);
      res.redirect("/deads");
    } catch (e) {
      console.log(e);
      if (e) throw e;
    }
  }
);

router.get(
  "/additional/:id",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //get Additional data from dead person!
  async (req, res) => {
    res.render("deads_additional", {
      user: res.locals.user,
      Cost: await Cost.find({}),
      id: req.params.id,
      Dead: await Dead.findOne({ NationalId: req.params.id }),
    });
  }
);

router.post(
  "/additional/",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //Change additional Data of dead person!
  async (req, res) => {
    const costs = [];
    let totalCost = 0;
    await (await Cost.find({})).forEach((item) => {
      if (req.body["checkbox" + item.CostId] == "on") {
        costs.push(item.CostId);
        totalCost += item.Price;
      }
    });
    try {
      await Dead.findOneAndUpdate(
        { NationalId: req.body._id },
        {
          IntermentDate: req.body.intermentDate,
          IncomeDate: req.body.incomeDate,
          DoctorName: req.body.doctorName,
          IntermentPermitNumber: req.body.intermentPermitNumber,
          DeathPlace: req.body.deathPlace,
          FollowerName: req.body.followerName,
          FollowerNationalId: req.body.followerNationalId,
          FollowerRelToDeadPerson: req.body.followerRelToDeadPerson,
          FollowerPhoneNumber: req.body.followerPhoneNumber,
          Costs: costs,
          TotalCosts: totalCost,
          Details: req.body.details,
          EditDate: new Date(),
        }
      );
    } catch (e) {
      if (e) throw e;
    }
    res.redirect("/deads");
  }
);
module.exports = router;
