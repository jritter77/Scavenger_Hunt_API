let mongoose = require("mongoose");
let crypto = require('crypto');


const UserSchema = mongoose.Schema({
    username: String,
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
UserSchema.methods.changeCredentials = function({username, password}) {
    this.username = username;
    this.setPassword(password);
}

// Accept another user's friend request
UserSchema.methods.acceptFriendRequest = function(request) {
    this.friends.push(request.id);
    this.friendRequests.remove(request);
}

// Sets password for current user
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
}

// Verifies if password is valid
UserSchema.methods.validPassword = function(password) { 
    let hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
}; 

const User = module.exports = mongoose.model('User', UserSchema);
