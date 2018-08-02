const mongoose = require('mongoose');
const moment = require('moment');
// Lift Kart Schema
const LiftCartSchema = mongoose.Schema({
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
    material: {
        key:String,
        name:String
    },
    rwa: [{
    }],
    type:{
        key:String,
        name:String
    },
    total_month:Number,
    startDate:String,
    creative: {
        key:String,
        name:String
    },
    creative_url: {type: String},
  }
});
const LiftCart = module.exports = mongoose.model('liftcart', LiftCartSchema);