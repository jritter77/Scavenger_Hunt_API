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
    const recipient = await User.findOne(req.body.receiver);

    if (recipient) {
      if (
        recipient.friendRequests.find((r) => r.username === sender.username)
      ) {
        console.log("Request already exists!");
        res.send("Request already exists!");
        return;
      } else if (recipient.friends.find((r) => r === sender.username)) {
        console.log("You and this user are already friends!");
        res.send("You and this user are already friends!");
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
    const receiver = await User.findOne(req.body.user);
    receiver.acceptFriendRequest(req.body.request);

    const sender = await User.findOne({ username: req.body.request.username });
    sender.friends.push(receiver.username);
    sender.save();

    res.send(req.body.request.username + " has been added as a friend!");
  } catch (e) {
    console.log(e);
  }
});

// declines friend request
router.put("/decline", ensureToken, async function (req, res, next) {
  try {
    const user = await User.findOne(req.body.user);
    user.declineFriendRequest(req.body.request);

    res.send(req.body.request.username + " has been declined as a friend.");
  } catch (e) {
    console.log(e);
  }
});

router.put("/remove", ensureToken, async function (req, res, next) {
  try {
    const user = await User.findOne(req.body.user);
    const friend = await User.findOne(req.body.friend);

    user.removeFriend(friend.username);
    friend.removeFriend(user.username);

    res.send(req.body.friend.username + " has been removed as a friend.");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
