const express = require("express");
const router = express.Router();

router.get("/test-res", (req, res) => {
  res.send("reservations route OK");
});

module.exports = router;
