const express = require("express");
const router = express.Router();

router.get("/test-salles", (req, res) => {
  res.send("salles route OK");
});

module.exports = router;
