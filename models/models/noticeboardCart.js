const mongoose = require('mongoose');
const moment = require('moment');
// Noticeboard Kart Schema
const NoticeboardCartSchema = mongoose.Schema({
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
    dimension1: {
        key:String,
        name:String
    },
    dimension2: {
        key:String,
        name:String
    },
    orientation:{
        key:String,
        name:String
    },
    rwa: [{
    }],
    startDate:String,
    startWeek:String,
    creative: {
        key:String,
        name:String
    },
    creative_url: {type: String},
  }
});
const NoticeboardCart = module.exports = mongoose.model('noticeboardcart', NoticeboardCartSchema);