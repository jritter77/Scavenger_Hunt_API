let jwt = require("jsonwebtoken");

// Security function which forbids access to protected route
// if not logged in.
module.exports.ensureToken = function (req, res, next) {
  const JWT = req.cookies.JWT || req.query.JWT;

  if (JWT) {
    jwt.verify(
      JWT,
      process.env.SECRET,
      (err, result) => {
        if (err) {
          res.redirect(403, "/login");
        } else {
          req.body.user = { _id: result.id };
          next();
        }
      }
    );
  } else {
    res.redirect(403, "/login");
  }
};
