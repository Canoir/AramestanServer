const express = require("express");
const DeadType = require("../model/DeadTypes");
const { checkAuth, roleManaging, Roles, findNextId } = require("./utils");
const router = express.Router();

router.get(
  "/",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //get Dead Types!
  async (req, res) => {
    res.render("deadtypes", {
      DeadType: await DeadType.find({}),
      user: res.locals.user,
    });
  }
);

router.post(
  "/remove",
  checkAuth,
  roleManaging([Roles.God]),
  //Remove a Dead Type!
  async (req, res) => {
    try {
      await DeadType.findByIdAndRemove(req.body.user_remove_item_id);
      res.redirect("/deadtypes");
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
  //Add dead type!
  async (req, res) => {
    try {
      await new DeadType({
        DeadTypeId: await findNextId("C_DeadTypes"),
        Name: req.body.name,
      }).save();
      res.redirect("/deadtypes");
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
  //Edit a dead Type!
  async (req, res) => {
    try {
      await DeadType.findByIdAndUpdate(req.body.popup_content_3_HID, {
        Name: req.body.name,
      });
      res.redirect("/deadtypes");
    } catch (e) {
      console.log(e);
      if (e) throw e;
    }
  }
);
module.exports = router;
