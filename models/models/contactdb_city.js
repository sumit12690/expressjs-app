const mongoose = require('mongoose');

const contactdb_city = mongoose.Schema({
  city: {type: String, required: true}
});

const contactNumbers_city = module.exports = mongoose.model('contactNumbers_city', contactdb_city);