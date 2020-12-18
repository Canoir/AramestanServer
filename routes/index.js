const express = require("express");
const Deads = require("../model/Deads");
const User = require("../model/Users");
const Setting = require("../model/Settings");
const { checkAuth, checkNotAuth, Roles, roleManaging } = require("./utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const router = express.Router();

//index of whole site!
router.get("/", checkNotAuth, async function (req, res) {
  res.redirect("/login");
});

//Dashboard!
router.get("/dashboard", checkAuth, async (req, res) => {
  switch (res.locals.user.RoleId) {
    case Roles.God:
      dashboardGodAndSupporter(req, res);
      break;
    case Roles.Supporter:
      dashboardGodAndSupporter(req, res);
      break;
    case Roles.Printer:
      res.redirect("/statements/add");
      break;
    case Roles.AcceptOfficer:
      res.redirect("/reports");
      break;
  }
});
//Login Page!
router.get("/login", checkNotAuth, async function (req, res) {
  res.render("login", { m: req.query.m });
});
//Login Post!
router.post("/login", checkNotAuth, async (req, res) => {
  const user = await User.findOne({ Username: req.body.username }).select(
    "Username Password"
  );
  if (user) {
    console.log(bcrypt.hashSync(req.body.password, 10));
    if (bcrypt.compareSync(req.body.password, user.Password)) {
      const at = await crypto.randomBytes(64).toString("base64");
      res.cookie("AuthUsername", user.Username, { maxAge: 10800000 });
      res.cookie("AuthAccessToken", at, { maxAge: 10800000 });
      await user.updateOne({ AccessToken: at });
      res.redirect("/");
    } else res.redirect(`/login?m=Password is not valid!`);
  } else res.redirect(`/login?m=Username is not valid!`);
});
//Logout!
router.get("/logout", checkAuth, (req, res) => {
  res.clearCookie("AuthUsername");
  res.clearCookie("AuthAccessToken");
  res.redirect("/");
});

router.get(
  "/setting",
  checkAuth,
  roleManaging([Roles.God]),
  //Setting Page!
  async (req, res) => {
    try {
      let data = await Setting.findOne({ i: 1 });
      if (!data) {
        await new Setting({
          i: 1,
          AramestanManager: "",
          AramestanBankAccount: "",
        }).save();
        data = await Setting.findOne({ i: 1 });
      }
      res.render("settings", { setting: data });
    } catch (e) {
      console.log(e);
      res.redirect("/");
    }
  }
);

//Post Settings!
router.post(
  "/settings",
  checkAuth,
  roleManaging([Roles.God]),
  async (req, res) => {
    try {
      await Setting.findOneAndUpdate(
        { i: 1 },
        {
          AramestanBankAccount: req.body.AramestanBankAccount,
          AramestanManager: req.body.AramestanManager,
        }
      );
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.redirect("/setting");
    }
  }
);

//The GET Method of allCount Page!
router.get(
  "/allCount",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  async (req, res) => {
    res.json({
      AllCount: await Deads.estimatedDocumentCount(),
      AllCounted: await Deads.countDocuments({ Accepted: true }),
      code: 200,
    });
  }
);

//The GET Method of monthCount Page!
router.get(
  "/monthCount",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  async (req, res) => {
    const monthDate = new Date();
    monthDate.setDate(monthDate.getDate() - 30);
    res.json({
      MonthCount: await Deads.countDocuments({
        DateTime: { $gte: monthDate.toISOString() },
      }),
      MonthCounted: await Deads.countDocuments({
        DateTime: { $gte: monthDate.toISOString() },
        Accepted: true,
      }),
      code: 200,
    });
  }
);

//The GET Method of weekCount Page!
router.get(
  "/weekCount",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  async (req, res) => {
    const weekDate = new Date();
    weekDate.setDate(weekDate.getDate() - 7);
    res.json({
      WeekCount: await Deads.countDocuments({
        DateTime: { $gte: weekDate.toISOString() },
      }),
      WeekCounted: await Deads.countDocuments({
        DateTime: { $gte: weekDate.toISOString() },
        Accepted: true,
      }),
      code: 200,
    });
  }
);

//The GET Method of dayCount Page!
router.get(
  "/dayCount",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter]),
  async (req, res) => {
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() - 1);
    res.json({
      DayCount: await Deads.countDocuments({
        DateTime: { $gte: dayDate.toISOString() },
      }),
      DayCounted: await Deads.countDocuments({
        DateTime: { $gte: dayDate.toISOString() },
        Accepted: true,
      }),
      code: 200,
    });
  }
);

async function dashboardGodAndSupporter(req, res) {
  const dead = await Deads.find({}).sort({ DeathDate: -1 }).limit(10);
  dead.forEach((el) => {
    el.deathDate = res.locals.moment(el.DeathDate + "").format("YYYY/MM/DD");
  });
  res.render("dashboard", {
    user: res.locals.user,
    Deads: dead,
  });
}
module.exports = router;
