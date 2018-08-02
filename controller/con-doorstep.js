var moment = require('moment');
var DoorstepCart = require('../models/doorstepCart');
var Order = require('../models/order');
var mongoose = require('mongoose');
module.exports.allDoorstepItems = function (doorstep_data, callback) {
    let urlRegex = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$");
    let startDate = moment().utcOffset(330).format();
    let min_date = moment().utcOffset(330).subtract(1, 'day');

    // price variables that to be shown on front
    let totPrice = 0;

    // will return it to client side
    let cart_data = {
        city: {}, dimension: {}, gsm: {}, finish: {}, side: {}, rwa: [], creative: {}, startDate: "", totPrice: 0
    };

    // Doorstep City validation requred
    if (doorstep_data.city.id == 1) {
        cart_data.city.id = 1;
        cart_data.city.name = "Gurgaon";
    } else {
        return callback(null, { success: false, msg: "Only Gurgaon city is allowed" });
    };

    // Doorstep dimension validation requred
    if (doorstep_data.dimension.key == 'vinyl') {
        cart_data.dimension.key = doorstep_data.dimension.key;
        cart_data.dimension.name = "Vinyl Sticker";
        totPrice += 10;
    } else if (doorstep_data.dimension.key == 'option') {
        cart_data.dimension.key = doorstep_data.dimension.key;
        cart_data.dimension.name = "Option2";
        totPrice += 5;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Dimension type" });
    };

    // Doorstep GSM Validation required
    if (doorstep_data.gsm.key == 10 || doorstep_data.gsm.key == 20 || doorstep_data.gsm.key == 30) {
        cart_data.gsm.key = doorstep_data.gsm.key;
        cart_data.gsm.name = doorstep_data.gsm.key;
        totPrice += doorstep_data.gsm.key;
    }
    else {
        return callback(null, { success: false, msg: "Please Choose appropriate GSM" });
    };

    // Doorstep Finish validation requred
    if (doorstep_data.finish.key == 'glossy') {
        cart_data.finish.key = doorstep_data.finish.key;
        cart_data.finish.name = 'Glossy';
        totPrice += 50;
    } else if (doorstep_data.finish.key == 'matte') {
        cart_data.finish.key = doorstep_data.finish.key;
        cart_data.finish.name = "Matte";
        totPrice += 100;
    } else if (doorstep_data.finish.key == 'plain') {
        cart_data.finish.key = doorstep_data.finish.key;
        cart_data.finish.name = "Plain";
        totPrice += 150;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Finish." });
    };

    // Doorstep Side validation requred
    if (doorstep_data.side.key == 'one') {
        cart_data.side.key = doorstep_data.side.key;
        cart_data.side.name = "One Side";
        totPrice += 25;
    } else if (doorstep_data.side.key == 'both') {
        cart_data.side.key = doorstep_data.side.key;
        cart_data.side.name = "Both Side";
        totPrice += 40;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Side" });
    };

    // Doorstep RWA validation requred
    if (doorstep_data.rwa.length) {
        cart_data.rwa = doorstep_data.rwa;
        totPrice += 5 * doorstep_data.rwa.length;
    } else {
        return callback(null, { success: false, msg: "Please choose atleast one Society" });
    };

    // Doorstep creative validation requred
    if (doorstep_data.creative.key == 'yes') {
        cart_data.creative.name = "Yes";
        cart_data.creative_url = "";
    } else if (doorstep_data.creative.key == 'no') {
        cart_data.creative.name = "No";
        if (!doorstep_data.isLater) {
            if (!doorstep_data.creative_url || !doorstep_data.creative_url.match(urlRegex)) {
                return callback(null, { success: false, msg: "Please Enter valid Creative url" });
            }
        }
        cart_data.creative_url = doorstep_data.creative_url;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate creative type" });
    }
    if (!moment(startDate).isSameOrAfter(min_date)) {
        return callback(null, { success: false, msg: "Please Choose Valid Date After Today" });
    } else {
        cart_data.startDate = startDate;
    }
    cart_data.totPrice = totPrice;
    //cart_data.creative.key = doorstep_data.creative.key;
    return callback(null, { success: true, data: cart_data });
};

module.exports.addOrUpdateDoorstep = function (doorstepData, userid, callback) {
    var query = new DoorstepCart({
        "userid": userid,
        "type": "doorstep",
        "orderPlaced": false,
        "savedForLater": false,
        "data": {
            "city": doorstepData.city,
            "dimension": doorstepData.dimension,
            "gsm": doorstepData.gsm,
            "finish": doorstepData.finish,
            "side": doorstepData.side,
            "creative": doorstepData.creative,
            "rwa": doorstepData.rwa,
            "creative_url": doorstepData.creative_url,
            "startDate": doorstepData.startDate,
            "totPrice": doorstepData.totPrice
        }
    });

    query.save(function (err, data) {
        if (err) throw err;
        let mailOptions = {
            from: '"Adecity" <no-reply@adecity.com>', // sender address
            to: "gaurav@okhlee.com", // list of receivers ,p@okhlee.com,Akshiya@okhlee.com,asif@okhlee.com
            subject: 'We have a new Doorstep Branding Order', // Subject line
            html: `<p>Please <a href='http://www.admin-panel.adecity.com/orders/lift'>click here</a> to view order`
        };
        // send mail with defined transport object
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.log(error);
        //         return callback(null, { success: false, msg: "Something error occured, please try again later", })
        //     }
        //     return callback(err, { success: true, msg: 'cart added' });
        // });
        return callback(err, { success: true, msg: 'cart added' });
    });
};

module.exports.allDoorstepCartItems = function (userid, callback) {
    DoorstepCart.aggregate(
        [
            {
                "$match": {
                    "orderPlaced": false
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "userid",
                    "foreignField": "_id",
                    "as": "user"
                }
            },
        ]
        , function (err, data) {
            if (err) {
                console.log(err);
                throw err;
            }
            return callback(err, data);
        });
};

module.exports.doorstepCartItemDetail = function (cartid, callback) {
    var objectid = mongoose.Types.ObjectId;
    DoorstepCart.aggregate(
        [
            {
                "$match": {
                    "_id": objectid(cartid)
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "userid",
                    "foreignField": "_id",
                    "as": "user"
                }
            },

        ]
        , function (err, data) {
            if (err) {
                console.log(err);
                throw err;
            }
            return callback(err, data);
        });
};

module.exports.addOrderItem = function (cartid, postData, callback) {
    var objectid = mongoose.Types.ObjectId;
    DoorstepCart.aggregate(
        [{ "$match": { "_id": objectid(cartid) } }, { "$lookup": { "from": "users", "localField": "userid", "foreignField": "_id", "as": "user" } },],
        function (err, cartItemData) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(cartItemData);
            var order = new Order({
                _id: 'ADC' + Date.now(),
                userid: cartItemData[0].userid,
                product: [{
                    product_type: cartItemData[0].type,
                    product_id: cartid,
                    product_amount: cartItemData[0].data.totPrice,
                    credits: 'yes',
                    order_status: 'success',
                }],
                total_amount: postData.total_amount,
                paid_amount: postData.paid_amount,
                remain_amount: postData.remain_amount,
                isOrderConfirmed: true,
                orderDate: moment(Date.now()).format(),
                transaction_data: {
                    eror: 'test',
                    eror_msg: 'test',
                    status: 'Success',
                    txnid: postData.txnid,
                    bnk_ref_nmbr: postData.bnk_ref_nmbr,
                    txndate: moment().format(),
                    bankname: postData.bankname,
                    paymentmode: postData.paymentmode,
                    txnamount: postData.txnamount,
                }
            });
            console.log(order);
            order.save(function (err, data) {
                if (err) throw err;
                return callback(err, { success: true, msg: 'Order added' });
            });
        });
};

module.exports.updateCartOrderStatus = function (cartid, callback) {
    var objectid = mongoose.Types.ObjectId;
    console.log(cartid);
    DoorstepCart.update({ '_id': objectid(cartid) }, {
        "orderPlaced": true,
    }, function (err, data) {
        return callback(err, { success: true, msg: 'Order Added and cart updated as well' });
    });
};