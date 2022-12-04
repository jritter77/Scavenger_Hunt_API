let express = require("express");
let router = express.Router();
let jwt = require("jsonwebtoken");
const { ensureToken } = require("../methods");
const User = require("../models/Users.js");

// Returns current users friends list and friend requests
router.get("/", ensureToken, async function (req, res, next) {
  try {
    const result = await User.findOne(req.body.user, {
      friends: 1,
      friendRequests: 1,
      _id: 0,
    });

    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

// Create New Friend Request
router.post("/", ensureToken, async function (req, res, next) {
  try {
    const sender = await User.findOne(req.body.user);
    const recipient = await User.findOne({ username: req.body.receiver });

    if (recipient) {
      if (
        recipient.friendRequests.find((r) => r.username === sender.username)
      ) {
        console.log("Request already exists!");
        res.send("Request already exists!");
        return;
      }

      recipient.friendRequests.push({
        _id: sender._id,
        username: sender.username,
      });

      recipient.save();

      res.send("Friend Request Sent!");
    } else {
      res.send(receiver + "is not a valid user.");
    }
  } catch (e) {
    console.log(e);
  }
});

// accepts friend request and adds sender to current users friend list
router.put("/accept", ensureToken, async function (req, res, next) {
  try {
    const user = User.findOne(req.body.user);
    user.acceptFriendRequest(req.request);
    user.save();

    res.send(req.request.username + "has been added as a friend!");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
