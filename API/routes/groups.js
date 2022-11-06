let express = require("express");
let router = express.Router();
let jwt = require("jsonwebtoken");
const { ensureToken } = require("../methods");
const { UserModel } = require("../models/Users");

// Create New Friend Request
router.get("/", ensureToken, async function (req, res, next) {
    console.log('GET /groups')
  });
  
  
  
  module.exports = router;