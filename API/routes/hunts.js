let express = require("express");
let router = express.Router();
const { ensureToken } = require("../methods");
const Hunt = require("../models/Hunts");

/* GET hunt/s */
router.get("/", ensureToken, async function (req, res, next) {
  try {
    const searchTerm = req.query.search
      ? { $text: { $search: req.query.search } }
      : {};

    const found = await Hunt.find(searchTerm, {
      author: 1,
      title: 1,
      description: 1,
      ratings: 1,
      downloads: 1,
    });

    res.send(found);
  } catch (e) {
    console.log(e);
  }
});

router.get("/download", ensureToken, async function (req, res, next) {
  try {
    const found = await Hunt.findOne({ _id: req.query.huntId });

    console.log(found);

    res.send(found);
  } catch (e) {
    console.log(e);
  }
});

router.post("/", ensureToken, async function (req, res, next) {
  try {
    const hunt = new Hunt(req.body.hunt);

    await hunt.save();

    res.send(`<h1>${hunt.title} was added to database!</h1>`);
  } catch (e) {
    console.log(e);
  }
});

router.delete("/", ensureToken, async function (req, res, next) {
  try {
    const result = await Hunt.findOneAndDelete(req.body.hunt);

    res.send(`<h1>${result.title} has been deleted from the database!</h1>`);
  } catch (e) {
    console.log(e);
  }
});

router.put("/", ensureToken, async function (req, res, next) {
  try {
    const result = await Hunt.findOneAndUpdate(req.body.hunt, req.body.attr);

    res.send(`<h1>${result.title} has been updated!</h1>`);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
