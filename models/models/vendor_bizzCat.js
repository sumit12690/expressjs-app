const mongoose = require('mongoose');
const bizCatSchema = mongoose.Schema({
  catname: { type: String, required: true },
  slug: { type: String, required: true },
  type: { type: String, enum: ['business', 'home'] },
  sub_category: [{
    sub_cat_name: String,
    slug: String
  }]
});
const bizzCat = module.exports = mongoose.model('vendorCategorie', bizCatSchema);
