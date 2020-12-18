const express = require("express");
const States = require("../../model/States");
const router = express.Router();

//Get All States via Post!
router.post("/getAll", async (req, res) => {
  try {
    res.json({ states: await States.find({}), code: 200 });
  } catch (e) {
    res.json({ code: 500 });
  }
});
module.exports = router;
