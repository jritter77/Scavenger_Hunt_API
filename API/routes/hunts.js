let express = require("express");
let router = express.Router();
const { ensureToken } = require("../methods");
const Hunt = require("../models/Hunts");

/* Gets all hunts fitting search criteria and returns shallow info about each */
router.get("/", ensureToken, async function (req, res, next) {
  try {
    const searchTerm = req.query.search
      ? { $text: { $search: req.query.search } }
      : {};

    const found = await Hunt.find(searchTerm, {
      author: 1,
      authorId: 1,
      title: 1,
      description: 1,
      ratings: 1,
      downloads: 1,
      },
      {limit: req.query.limit}
    );

    res.send(found);
  } catch (e) {
    console.log(e);
  }
});


// Finds specified hunt and returns full hunt info
router.get("/download", ensureToken, async function (req, res, next) {
  try {
    const found = await Hunt.findOne({ _id: req.query.huntId });

    res.send(found);
  } catch (e) {
    console.log(e);
    res.send(false);
  }
});

// Create new hunt with specified attributes contained in 'hunt' in request body object
router.post("/", ensureToken, async function (req, res, next) {
  try {
    const hunt = new Hunt(req.body.hunt);

    const result = await hunt.save();

    res.send(result);
  } catch (e) {
    console.log(e);
  }
});


// Creates a new rating object for specified hunt
router.post("/rating", ensureToken, async function (req, res, next) {
  try {
    const hunt = await Hunt.findOne({_id: req.body.huntId});

    if (!hunt.ratings) {
      hunt.ratings = {};
    }

    hunt.ratings[req.body.userId] = req.body.rating;

    hunt.markModified('ratings')

    const result = await hunt.save();

    await hunt.markModified('ratings')

    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

// Tries to delete specified hunt 
router.delete("/", ensureToken, async function (req, res, next) {
  try {
    const result = await Hunt.findOneAndDelete({_id: req.query.huntId});

    res.send(`<h1>${result.title} has been deleted from the database!</h1>`);
  } catch (e) {
    console.log(e);
  }
});

// Updates an existing hunt according to specified attributes
router.put("/", ensureToken, async function (req, res, next) {
  try {
    const result = await Hunt.findOneAndUpdate(req.body.hunt, req.body.attr);

    res.send(`<h1>${result.title} has been updated!</h1>`);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
