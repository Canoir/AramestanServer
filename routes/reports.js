const express = require("express");
const Deads = require("../model/Deads");
const Costs = require("../model/Costs");
const Setting = require("../model/Settings");
const States = require("../model/States");
const { checkAuth, roleManaging, Roles } = require("./utils");
const router = express.Router();

const REPORT_TYPE_1 = 2;
const REPORT_TYPE_2 = 1;
const REPORT_TYPE_3 = 3;

router.get(
  "/",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter, Roles.AcceptOfficer]),
  //Reports Page!
  async (req, res) => {
    res.render("reports", { user: res.locals.user });
  }
);

router.get(
  "/preview",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter, Roles.AcceptOfficer]),
  //Reports pages!
  async (req, res) => {
    const moment = res.locals.moment;
    if (req.query.nI) {
      if (res.locals.user.RoleId == Roles.AcceptOfficer)
        res.redirect("/users/denied");
      const el = await Deads.find({ NationalId: req.query.nI });
      el[0].StatesId = (
        await States.findOne({ StateId: el[0].StateId }).select("Name")
      ).Name;
      el[0].Cost = await Promise.all(
        el[0].Costs.map(async (item) => {
          return await Costs.findOne({ CostId: item });
        })
      );
      res.render("report_preview", {
        deads: await el,
        type: 2,
        len: 2,
        tC: 0,
        startDate: 0,
        endDate: 0,
        fPC: true,
        role: res.locals.user.RoleId,
        setting: await Setting.findOne({ i: 1 }).select("AramestanBankAccount"),
        today: moment(Date() + "").format("YYYY/MM/DD"),
      });
    } else {
      const type = Number(req.query.typeId);
      const startDate = new Date(Number(req.query.startDate));
      const endDate = new Date(Number(req.query.endDate));
      const fourPagesCheck = req.query.fourPagesCheck == "on";
      let deads;
      //
      if (fourPagesCheck && res.locals.user.RoleId == Roles.AcceptOfficer)
        res.redirect("/users/denied");
      //
      switch (type) {
        case REPORT_TYPE_1: {
          deads = await Deads.find({
            DeathDate: { $gte: startDate, $lt: endDate },
          }).sort({ DeathDate: -1 });
          break;
        }
        case REPORT_TYPE_2: {
          deads = await Deads.find({
            IntermentDate: { $gte: startDate, $lt: endDate },
          }).sort({ IntermentDate: -1 });
          break;
        }
        case REPORT_TYPE_3: {
          if (res.locals.user.RoleId == Roles.AcceptOfficer)
            res.redirect("/users/denied");
          deads = await Deads.find({
            IncomeDate: { $gte: startDate, $lt: endDate },
          }).sort({ IncomeDate: -1 });
          break;
        }
      }
      let TotalCost = 0;
      const dead = await Promise.all(
        deads.map(async (el) => {
          switch (type) {
            case REPORT_TYPE_1: {
              el.DeathDates = moment(el.DeathDate + "").format("YYYY/MM/DD");
              break;
            }
            case REPORT_TYPE_2: {
              el.IntermentDates = moment(el.IntermentDate + "").format(
                "YYYY/MM/DD"
              );
              break;
            }
            case REPORT_TYPE_3: {
              el.IncomeDates = moment(el.IncomeDate + "").format("YYYY/MM/DD");
              break;
            }
          }
          el.Cost = await Promise.all(
            el.Costs.map(async (item) => {
              return await Costs.findOne({ CostId: item });
            })
          );
          el.StatesId = (await States.findOne({ StateId: el.StateId })).Name;
          TotalCost += el.TotalCosts;
          if (!TotalCost) TotalCost = 0;
          if (req.query.outOfMalayer) {
            if (el.Cost.filter((i) => i == -1)) return el;
          } else return el;
        })
      );
      res.render("report_preview", {
        deads: await dead,
        type: type,
        len: (await dead).length,
        tC: await TotalCost,
        startDate: moment(startDate + "").format("YYYY/MM/DD"),
        endDate: moment(endDate + "").format("YYYY/MM/DD"),
        fPC: fourPagesCheck,
        role: res.locals.user.RoleId,
        today: moment(Date() + "").format("YYYY/MM/DD"),
      });
    }
  }
);

router.get(
  "/death-report",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  // Post method of death report
  async (req, res) => {
    const moment = res.locals.moment;
    let result;
    if (req.query.nI) {
      const _ = await Deads.findOne({ NationalId: req.query.nI });
      result = {
        today: moment(Date() + "").format("YYYY/MM/DD"),
        death: _,
        setting: await Setting.findOne({ i: 1 }).select("AramestanManager"),
      };
      result.death.DeathsDate = moment(_.DeathDate).format("YYYY/MM/DD");
      result.death.IntermentsDate = moment(_.IntermentsDate).format(
        "YYYY/MM/DD"
      );
    }
    res.render("death_report", result);
  }
);
module.exports = router;
