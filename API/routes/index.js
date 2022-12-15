var express = require("express");
const { ensureToken } = require("../methods");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Lookout! API" });
});

module.exports = router;
