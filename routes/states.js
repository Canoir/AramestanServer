const express = require("express");
const State = require("../model/States");
const { checkAuth, roleManaging, Roles, findNextId } = require("./utils");
const router = express.Router();

router.get(
  "/",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //Get List of states!
  async (req, res) => {
    res.render("states", {
      State: await State.find({}),
      user: res.locals.user,
    });
  }
);

router.post(
  "/remove",
  checkAuth,
  roleManaging([Roles.God]),
  //Remove States post!
  async (req, res) => {
    try {
      await State.findByIdAndRemove(req.body.user_remove_item_id);
      res.redirect("/states");
    } catch (e) {
      console.log(e);
      if (e) throw e;
    }
  }
);

router.post(
  "/add",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //Add new State!
  async (req, res) => {
    try {
      await new State({
        StateId: await findNextId("C_States"),
        Name: req.body.name,
        Rows: Number(req.body.rows),
        Count: Number(req.body.count),
      }).save();
      res.redirect("/states");
    } catch (e) {
      console.log(e);
      if (e) throw e;
    }
  }
);

router.post(
  "/edit",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //Edit Some State!
  async (req, res) => {
    try {
      await State.findByIdAndUpdate(req.body.popup_content_2_HID, {
        Name: req.body.name,
        Rows: Number(req.body.rows),
        Count: Number(req.body.count),
      });
      res.redirect("/states");
    } catch (e) {
      console.log(e);
      if (e) throw e;
    }
  }
);
module.exports = router;
