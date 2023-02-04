let mongoose = require("mongoose");
let crypto = require("crypto");

const UserSchema = mongoose.Schema({
  username: { type: String, unique: true },
  hash: String,
  salt: String,
  isAdmin: Boolean,

  activityLog: Object,

  huntHistory: Object,
  friends: Array,
  friendRequests: Array,
  groupInvites: Array,
  sharedHunts: Array,
});

// Change user credentials
UserSchema.methods.changeCredentials = function ({ username, password }) {
  this.username = username;
  this.setPassword(password);
};

// Accept another user's friend request
UserSchema.methods.acceptFriendRequest = function (request) {
  this.friends.push(request.username);
  const i = this.friendRequests.findIndex(
    (e) => e.username === request.username
  );
  this.friendRequests.splice(i, 1);
  this.save();
};

// Decline another user's friend request
UserSchema.methods.declineFriendRequest = function (request) {
  console.log(this.friendRequests, request);
  const i = this.friendRequests.findIndex(
    (e) => e.username === request.username
  );
  console.log("Request index: " + i);
  this.friendRequests.splice(i, 1);
  this.save();
};

UserSchema.methods.removeFriend = function (friendName) {
  let i = this.friends.indexOf(friendName);
  this.friends.splice(i, 1);
  this.save();
};

// Sets password for current user
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");

  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
};

// Verifies if password is valid
UserSchema.methods.validPassword = function (password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.hash === hash;
};

UserSchema.methods.incrementCreated = function () {
  this.huntHistory.huntsCreated += 1;
  this.markModified("huntHistory");
  this.save();
};

UserSchema.methods.incrementDownloaded = function () {
  this.huntHistory.huntsDownloaded += 1;
  this.markModified("huntHistory");
  this.save();
};

UserSchema.methods.incrementPlayed = function () {
  this.huntHistory.huntsPlayed += 1;
  this.markModified("huntHistory");
  this.save();
};

UserSchema.methods.incrementCompleted = function () {
  this.huntHistory.huntsCompleted += 1;
  this.markModified("huntHistory");
  this.save();
};

UserSchema.methods.incrementPublished = function () {
  this.huntHistory.huntsPublished += 1;
  this.markModified("huntHistory");
  this.save();
};

const User = (module.exports = mongoose.model("User", UserSchema));
