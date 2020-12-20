const express = require("express");
const Dead = require("../model/Deads");
const Statement = require("../model/Statements");
const { checkAuth, roleManaging, Roles } = require("./utils");
const multer = require("multer");
const router = express.Router();
//Disk Handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../Aramestan/public/images/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/[-T:\.Z]/g, "") +
        "_" +
        file.originalname
    );
  },
});
const upload = multer({ storage: storage });

router.get(
  "/add",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter, Roles.Printer]),
  // Statements Add Page!
  (req, res) => {
    res.render("statements_add", { user: res.locals.user });
  }
);

router.post(
  "/getInfo",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter, Roles.Printer]),
  // Statements Add Post!
  async (req, res) => {
    res.json({
      dead: await Dead.findOne({ NationalId: req.body.nI }).select(
        "FullName FatherName"
      ),
      code: 200,
    });
  }
);

router.post(
  "/addPic",
  checkAuth,
  roleManaging([Roles.God, Roles.Supporter, Roles.Printer]),
  upload.single("image"),
  // Add pic for statement
  async (req, res) => {
    try {
      await Dead.findOneAndUpdate(
        { NationalId: req.body.nI },
        { StatementImageName: req.file.filename }
      );
      const state = await Statement.findOne({ NationalId: req.body.nI });
      if (!state)
        await new Statement({
          NationalId: req.body.nI,
          ImageName: req.file.filename,
        }).save();
      else await state.updateOne({ ImageName: req.file.filename });
      res.redirect("/statements/add?m=200");
    } catch (e) {
      console.log(e);
      res.redirect("/statements/add?m=500");
    }
  }
);

module.exports = router;
