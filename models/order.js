const mongoose = require('mongoose');
const moment = require('moment');

// Order Schema
const OrderDetails = mongoose.Schema({
  userid: mongoose.Schema.Types.ObjectId,
  _id: {type: String},
  product: [{
    product_type: {type: String},
    product_id: mongoose.Schema.Types.ObjectId,
    product_amount: {type: String},
    credits: {type: String},
    order_status:{type: String},
    _id: false
  }],
  total_amount: {type: Number},
  paid_amount: {type: Number},
  remain_amount: {type: Number},
  isOrderConfirmed: {type: Boolean, default: false},
  orderDate:{type:String,default:moment().format()},
  transaction_data: {
    eror:{ type: String},
    eror_msg:{ type:String },
    status: {type: String},
    txnid: {type: String},
    bnk_ref_nmbr: {type: String},
    txndate: {type: String},
    bankname: {type: String},
    paymentmode: {type: String},
    txnamount: {type: Number}
  }
});

const Order = module.exports = mongoose.model('Order', OrderDetails);