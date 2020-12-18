const express = require("express");
const { checkAuth, roleManaging, Roles, findNextId } = require("./utils");
const Cost = require("../model/Costs");
const router = express.Router();

router.get(
  "/",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //Main Costs Page!
  async (req, res) => {
    res.render("costs", { Cost: await Cost.find({}), user: res.locals.user });
  }
);

router.post(
  "/remove",
  checkAuth,
  roleManaging([Roles.God]),
  //Remove Costs!
  async (req, res) => {
    try {
      await Cost.findByIdAndRemove(req.body.user_remove_item_id);
      res.redirect("/costs");
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
  //Add Costs!
  async (req, res) => {
    try {
      await new Cost({
        CostId: await findNextId("C_Costs"),
        Name: req.body.name,
        Price: Number(req.body.price),
      }).save();
      res.redirect("/costs");
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
  //Editing A Cost!
  async (req, res) => {
    try {
      await Cost.findByIdAndUpdate(req.body.popup_content_4_HID, {
        Name: req.body.name,
        Price: Number(req.body.price),
      });
      res.redirect("/costs");
    } catch (e) {
      console.log(e);
      if (e) throw e;
    }
  }
);
module.exports = router;
