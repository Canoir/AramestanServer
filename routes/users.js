const express = require("express");
const Users = require("../model/Users");
const bcrypt = require("bcrypt");
const { checkAuth, roleManaging, Roles } = require("./utils");
const router = express.Router();

router.get(
  "/",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  //Get List of Users!
  async (req, res) => {
    res.render("users", { Users: await Users.find(), user: res.locals.user });
  }
);

//Add new User
router.post("/add", checkAuth, roleManaging([Roles.God]), async (req, res) => {
  try {
    await new Users({
      Username: req.body.username,
      Password: bcrypt.hashSync(req.body.password, 10),
      RoleId: req.body.roleId,
      Name: req.body.name,
    }).save();
    res.redirect("/users");
  } catch (e) {
    console.log(e);
    if (e) throw e;
  }
});

//Edit my profile Info page!
router.get("/editme", checkAuth, (req, res) => {
  res.render("edit", { user: res.locals.user });
});

//Edit my profile Info post!
router.post("/editme", checkAuth, async (req, res) => {
  try {
    if (req.body.password == "")
      await Users.findByIdAndUpdate(req.body._id, {
        Username: req.body.username,
        Name: req.body.name,
      });
    else
      await Users.findByIdAndUpdate(req.body._id, {
        Username: req.body.username,
        Name: req.body.name,
        Password: await bcrypt.hashSync(req.body.password, 10),
      });
    res.redirect("/");
  } catch (e) {
    console.log(e);
    if (e) throw e;
  }
});

//Edit User data!
router.post("/edit", checkAuth, roleManaging([Roles.God]), async (req, res) => {
  try {
    if (req.body.password == "")
      await Users.findByIdAndUpdate(req.body.popup_content_1_HID, {
        Username: req.body.username,
        Name: req.body.name,
        RoleId: req.body.roleId,
      });
    else
      await Users.findByIdAndUpdate(req.body.popup_content_1_HID, {
        Username: req.body.username,
        Name: req.body.name,
        RoleId: req.body.roleId,
        Password: await bcrypt.hashSync(req.body.password, 10),
      });
    res.redirect("/users");
  } catch (e) {
    console.log(e);
    if (e) throw e;
  }
});

router.post(
  "/remove",
  checkAuth,
  roleManaging([Roles.God]),
  // Remove users!
  async (req, res) => {
    try {
      if (res.locals.user._id != req.body.user_remove_item_id)
        await Users.findByIdAndRemove(req.body.user_remove_item_id);
      res.redirect("/users");
    } catch (e) {
      console.log(e);
      if (e) throw e;
    }
  }
);

router.get("/denied", checkAuth, (req, res) => {
  res.render("access_denied",{});
});
module.exports = router;
