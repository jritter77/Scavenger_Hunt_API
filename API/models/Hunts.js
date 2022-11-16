let mongoose = require("mongoose");

  
const HuntSchema = mongoose.Schema({
    author: String,
    authorId: String,
    title: String,
    description: String,

    clueList: Object,

    ratings: Object,
    downloads: Number,
});

HuntSchema.index({title: 'text', description: 'text'});
  
const Hunt = module.exports = mongoose.model('Hunt', HuntSchema);
    

  