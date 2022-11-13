let jwt = require("jsonwebtoken");

module.exports.ensureToken = function (req, res, next) {
  const JWT = req.cookies.JWT || req.query.JWT;

  console.log(req.query);

  if (JWT) {
    jwt.verify(
      JWT,
      '499bc4f459631403ea5165dce66678dfb971358cd0d5b644f6ca6817e7d2fe3051e56cb05fd20f086c2e25454a71d796a26907234970b951606513482bfe4083',
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
