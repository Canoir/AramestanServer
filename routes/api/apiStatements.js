const express = require("express");
const Statement = require("../../model/Statements");
const router = express.Router();

//!Socket.io
function sockets(io) {
  //Statements Socket
  io.of("/api/statements/").on("connect", async (socket) => {
    socket.emit(
      "max",
      Math.ceil((await Statement.estimatedDocumentCount()) / 5)
    );
    socket.on("getDataFromServer", async (page) => {
      socket.emit(
        "sendDataFromServer",
        await Statement.find({})
          .skip((page - 1) * 5)
          .limit(10)
          .select("ImageName")
      );
    });
  });
}
module.exports = (_io) => {
  sockets(_io);
  return router;
};
