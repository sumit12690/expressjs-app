const mongoose = require('mongoose');
const moment = require('moment');
// Lift Kart Schema
const JacketCartSchema = mongoose.Schema({
  userid: mongoose.Schema.Types.ObjectId,
  orderPlaced: {type: Boolean, Deafult: false},
  savedForLater: {type: Boolean, Deafult: false},
  cartDate:{type:String,Deafult:moment().format()},
  type: {type: String},
  data: {
    city: {
        id:String,
        name:String
    },
    dimension: {
        key:String,
        name:String
    },
    rwa: [{
    }],
    startMonth:{type:String,Deafult:moment().format('MMM')},
    creative: {
        key:String,
        name:String
    },
    creative_url: {type: String},
  }
});
const JacketCart = module.exports = mongoose.model('jacketcart', JacketCartSchema);