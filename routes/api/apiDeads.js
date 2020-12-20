const express = require("express");
const multer = require("multer");
const Deads = require("../../model/Deads");
const Statement = require("../../model/Statements");
const router = express.Router();

//Picture Uploading
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

//Get single Dead
router.post("/get", async function (req, res) {
  try {
    const dead = await Deads.findOne({
      NationalId: req.body.NationalId,
    }).select("FullName FatherName");
    res.json({ Name: dead.FullName, FatherName: dead.FatherName, code: 200 });
  } catch (e) {
    res.json({ code: 500 });
  }
});
//Find From StateId!
router.post("/getFromState", async (req, res) => {
  try {
    res.json({
      deads: await Deads.find({ StateId: Number(req.body.StateId) }).sort({
        Row: 1,
        GravePlaceId: 1,
      }),
      code: 200,
    });
  } catch (e) {
    res.json({ code: 500 });
  }
});
//Add Picture for Death!
router.post("/addPic", upload.single("image"), async function (req, res) {
  try {
    const dead = await Deads.findOne({
      NationalId: req.body.NationalId,
    }).select("Accepted Latitiude Longtitude");
    let object = { ImageName: req.file.filename };
    if (!dead.Accepted && dead.Latitiude != "" && dead.Longtitude != "")
      object = { ImageName: req.file.filename, Accepted: true };
    await dead.updateOne(object);
    res.json({ code: 200 });
  } catch (e) {
    res.json({ code: 500 });
  }
});
//Add Location to death!
router.post("/addLoc", async function (req, res) {
  try {
    const dead = await Deads.findOne({
      NationalId: req.body.NationalId,
    }).select("Accepted ImageName");
    let object = {
      Latitiude: req.body.Latitiude,
      Longtitude: req.body.Longtitude,
    };
    if (!dead.Accepted && dead.ImageName)
      object = {
        Latitiude: req.body.Latitiude,
        Longtitude: req.body.Longtitude,
        Accepted: true,
      };
    await dead.updateOne(object);
    res.json({ code: 200 });
  } catch (e) {
    res.json({ code: 500 });
  }
});
//Post Json For Searching!
router.post("/search", async (req, res) => {
  try {
    res.json({
      deads: await Deads.find({
        FullName: { $regex: req.body.fullName, $options: "i" },
      }).limit(20),
      code: 200,
    });
  } catch (e) {
    res.json({ code: 500 });
  }
});
//!Socket.io
function sockets(io) {
  //Deads Socket
  io.of("/api/deads/").on("connect", (socket) => {
    socket.on("getDataFromServer", async (page) => {
      socket.emit(
        "sendDataFromServer",
        await Deads.find({})
          .sort({ EditDate: -1 })
          .skip((page - 1) * 20)
          .limit(20)
          .select("FullName FatherName ImageName NationalId")
      );
    });
  });
}
module.exports = (_io) => {
  sockets(_io);
  return router;
};
