const multer = require("multer");
const User = require("../model/Users");
const Counter = require("../model/Counter");

const Utils = {
  //Get Current User if is valid and set it in :
  //  ^res.locals.user
  getUser: async (req, res, next) => {
    if (req.cookies["AuthUsername"]) {
      //He is Logged Before!
      const user = await User.findOne({
        Username: req.cookies["AuthUsername"],
      });
      if (user.AccessToken == req.cookies["AuthAccessToken"])
        res.locals.user = user;
    }
    next();
  },
  //Check if user has Authenticated
  checkAuth: async (req, res, next) => {
    if (req.cookies["AuthUsername"]) {
      //He is Logged Before!
      const user = await User.findOne({
        Username: req.cookies["AuthUsername"],
      });
      if (user.AccessToken == req.cookies["AuthAccessToken"]) {
        res.locals.user = user;
        next();
      } else res.redirect("/login");
    } else {
      //new Login
      res.redirect("/login");
    }
  },
  //check if user is not Authenticated!
  checkNotAuth: async (req, res, next) => {
    if (req.cookies["AuthUsername"]) {
      //He is Logged Before!
      const user = await User.findOne({
        Username: req.cookies["AuthUsername"],
      });
      if (user.AccessToken == req.cookies["AuthAccessToken"]) {
        res.locals.user = user;
        res.redirect("/dashboard");
      } else next();
    }
    //new Login
    else next();
  },
  findNextId: async (dbName) => {
    const res = await Counter.findOne({ CounterName: dbName });
    let result;
    if (res) {
      result = res.Counter;
      await res.updateOne({ Counter: res.Counter + 1 });
    } else {
      await new Counter({ CounterName: dbName }).save();
      result = 1;
    }
    return result;
  },
  roleManaging: (roles) => {
    return (req, res, next) => {
      let access = false;
      for (let i = 0; i < roles.length; i++) {
        if (roles[i] == res.locals.user.RoleId) {
          access = true;
          break;
        }
      }
      if (access) next();
      else res.redirect("/users/denied");
    };
  },

  Roles: { God: 1, Supporter: 2, Printer: 3, AcceptOfficer: 4 },
};
module.exports = Utils;
