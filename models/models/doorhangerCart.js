const mongoose = require('mongoose');
const moment = require('moment');
const DoorhangerCartSchema = mongoose.Schema({
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
    type1: {
        key:String,
        name:String
    },
    type2:{
        key:String,
        name:String
    },
    type3: {
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
  }
});
const DoorhangerCart = module.exports = mongoose.model('doorhangercart', DoorhangerCartSchema);