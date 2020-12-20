const express = require("express");
const Statement = require("../../model/Statements");
const router = express.Router();

//!Socket.io
function sockets(io) {
  //Statements Socket
  io.of("/api/statements/").on("connect", (socket) => {
    socket.on("getDataFromServer", async (page) => {
      socket.emit(
        "sendDataFromServer",
        await Statement.find({})
          .skip((page - 1) * 20)
          .limit(20)
          .select("ImageName")
      );
    });
  });
}
module.exports = (_io) => {
  sockets(_io);
  return router;
};
