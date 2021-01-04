const { json } = require("express");
const express = require("express");
const Statement = require("../../model/Statements");
const router = express.Router();

//!Socket.io
function sockets(io = require("socket.io")()) {
  //Statements Socket
  io.of("/api/statements/").on("connect", async (socket) => {
    socket.emit("max", Math.ceil((await Statement.countDocuments()) / 5));
    socket.on("getDataFromServer", async (page) => {
      socket.emit(
        "sendDataFromServer",
        await Statement.find({})
          .sort({ Date: -1 })
          .skip((page - 1) * 5)
          .limit(5)
          .select("ImageName")
      );
    });
    socket.on("searchFilterToServer", async (data) => {
      let result;
      if (data.date != "null") {
        console.log(data + " : " + data.date);
        const input = data.date.split("/");
        const _date = new Date(
          Number(input[0]),
          Number(input[1]),
          Number(input[2])
        );
        _date.setHours(0, 0, 0);
        const _endDate = _date;
        _endDate.setHours(23, 59, 59);
        result = await Statement.find({
          DeathDate: { $gte: _date, $lt: _endDate },
          FullName: { $regex: data.text, $options: "i" },
        })
          .sort({ Date: -1 })
          .skip((data.pager - 1) * 5)
          .limit(5)
          .select("-_id ImageName");
      } else {
        result = await Statement.find({
          FullName: { $regex: data.text, $options: "i" },
        })
          .sort({ Date: -1 })
          .skip((data.pager - 1) * 5)
          .limit(5)
          .select("-_id ImageName");
      }
      socket.emit("max", Math.ceil((await result.length) / 5));
      socket.emit("searchFilterFromServer", await result);
    });
  });
}
module.exports = (_io) => {
  sockets(_io);
  return router;
};
