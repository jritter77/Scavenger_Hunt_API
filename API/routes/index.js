var express = require("express");
const { ensureToken } = require("../methods");
var router = express.Router();

/* GET home page. */
router.get("/", ensureToken, function (req, res, next) {
  res.render("index", { title: "Lookout! API" });
});

router.get("/newUser", function (req, res, next) {
  res.render("newUser");
});

router.get("/deleteUser", ensureToken, function (req, res, next) {
  res.render("deleteUser");
});

router.get("/editUser", ensureToken, function (req, res, next) {
  res.render("editUser");
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/newHunt", ensureToken, function (req, res, next) {
  res.render("newHunt");
});

router.get("/addFriend", ensureToken, function(req, res, next) {
  res.render("newFriendRequest");
})

router.get("/viewFriends", ensureToken, function(req, res, next) {
  res.render("viewFriends");
})

module.exports = router;
