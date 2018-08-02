const mongoose = require('mongoose');

const contactDb = mongoose.Schema({
  dbname: {type: String, required: true},
  contactno: [String],
  city:String
});

const contactNumbers = module.exports = mongoose.model('contactNumbers', contactDb);