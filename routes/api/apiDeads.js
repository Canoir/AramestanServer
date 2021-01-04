const express = require("express");
const multer = require("multer");
const Deads = require("../../model/Deads");
const State = require("../../model/States");
const DeadType = require("../../model/DeadTypes");
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
  io.of("/api/deads/").on("connect", async (socket) => {
    socket.emit("max", Math.ceil((await Deads.countDocuments()) / 20));
    socket.on("getDataFromServer", async (page) => {
      socket.emit(
        "sendDataFromServer",
        await Deads.find({ Accepted: true })
          .sort({ EditDate: -1 })
          .skip((page - 1) * 20)
          .limit(20)
          .select("-_id FullName FatherName ImageName NationalId")
      );
    });
    socket.on("getDeadFromServer", async (nI) => {
      let data = (
        await Deads.findOne({
          NationalId: nI,
          Accepted: true,
        }).select(
          "-_id ImageName FullName FatherName BirthDate DeathDate StateId Row GravePlaceId DeadTypeId Latitiude Longtitude StatementImageName"
        )
      )._doc;
      if (data) {
        data = {
          ...data,
          State: (await State.findOne({ StateId: data.StateId })).Name,
          DeadType: (
            await DeadType.findOne({
              DeadTypeId: data.DeadTypeId,
            })
          ).Name,
          code: 200,
        };
        socket.emit("sendDeadFromServer", data);
      } else socket.emit("sendDeadFromServer", { code: 404 });
    });
    socket.on("getDeadTypesFromServer", async () => {
      socket.emit(
        "setDeadTypesFromServer",
        await DeadType.find({}).select("-_id DeadTypeId Name")
      );
    });
    socket.on("searchFilterToServer", async (filter) => {
      let result;
      let search = {};
      if (filter.fullName)
        search = {
          ...search,
          FullName: { $regex: filter.fullName, $options: "i" },
        };

      if (filter.date) {
        const input = filter.date.split("/");
        const _date = new Date(
          Number(input[0]),
          Number(input[1]),
          Number(input[2])
        );
        _date.setHours(0, 0, 0);
        const _endDate = _date;
        _endDate.setHours(23, 59, 59);
        search = { ...search, DeathDate: { $gte: _date, $lt: _endDate } };
      }
      if (filter.fatherName)
        search = {
          ...search,
          FatherName: { $regex: filter.fatherName, $options: "i" },
        };
      if (filter.deadTypeId == -2)
        search = {
          ...search,
          DeadTypeId: filter.deadTypeId,
        };

      result = await Deads.find(search)
        .sort({ EditDate: -1 })
        .skip((filter.page - 1) * 20)
        .limit(20)
        .select("-_id FullName FatherName ImageName NationalId");
      socket.emit("max", Math.ceil((await result.length) / 5));
      socket.emit("searchFilterFromServer", await result);
    });
  });
}
module.exports = (_io) => {
  sockets(_io);
  return router;
};
