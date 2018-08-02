const mongoose = require('mongoose');
const moment = require('moment');
// Lift Kart Schema
const DoorstepCartSchema = mongoose.Schema({
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
    gsm: {
        key:String,
        name:String
    },
    finish:{
        key:String,
        name:String
    },
    side: {
        key:String,
        name:String
    },
    rwa: [{
    }],
    startDate:String,
    creative: {
        key:String,
        name:String
    },
    creative_url: {type: String},
    totPrice: {type: String},
  }
});
const DoorstepCart = module.exports = mongoose.model('doorstepcart', DoorstepCartSchema);