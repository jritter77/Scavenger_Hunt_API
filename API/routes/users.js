let express = require("express");
let cors = require("cors");
let router = express.Router();
let jwt = require("jsonwebtoken");
const { ensureToken } = require("../methods");
const User = require("../models/Users");

// GET user according to query
router.get("/", ensureToken, async function (req, res, next) {
  try {
    const user = await User.findOne(
      { username: req.query.username },
      { username: 1, huntHistory: 1 }
    );

    res.send(user);
  } catch (e) {
    console.log(e);
  }
});

// Create New User
router.post("/", async function (req, res, next) {
  try {
    const user = new User(req.body);

    user.setPassword(req.body.password);

    user.huntHistory = {
      huntsCreated: 0,
      huntsDownloaded: 0,
      huntsPlayed: 0,
      huntsCompleted: 0,
      huntsPublished: 0
    }

    await user.save();

    res.send(`<h1>${user.username} was added to database!</h1>`);
  } catch (e) {
    console.log(e);
  }
});

// Delete Current User
router.delete("/", ensureToken, async function (req, res, next) {
  try {
    const result = await User.findOneAndDelete(req.body.user);

    res.clearCookie("JWT");

    res.send(`<h1>${result.username} has been deleted from the database!</h1>`);
  } catch (e) {
    console.log(e);
  }
});

// Edit Current User
router.put("/", ensureToken, async function (req, res, next) {
  try {
    const result = await User.updateOne(req.body.user, req.body.attr);
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});


// Edit Current users password
router.put("/changePassword", ensureToken, async function (req, res, next) {
  try {
    const user = await User.findOne(req.body.user);
    user.setPassword(req.body.password);
    const result = await user.save();
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

// Login Route
router.post("/login", async function (req, res, next) {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (user && user.validPassword(req.body.password)) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET);
      res.cookie("JWT", token, { httpOnly: true });
      res.send({ id: user._id, username: user.username, token: token });
    } else {
      console.log("Invalid Credentials");
      res.send(false);
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
