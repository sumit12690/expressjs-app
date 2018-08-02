var moment = require('moment');
module.exports.allDoorstepItems = function (jacket_data, callback) {
    let urlRegex = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$");
    let startDate = moment().utcOffset(330).format();
    let startMonth = moment().utcOffset(330).format("MMMM");
    let min_month = moment().utcOffset(330).subtract(1, 'month');
    // price variables that to be shown on front
    let totPrice = 0;
    // will return it to client side
    let cart_data = {
        city: {}, dimension: {}, rwa: [], creative: {}, startMonth: "", totPrice: 0
    };
    // Jacket City validation requred
    if (jacket_data.city.id == 1) {
        cart_data.city.id = 1;
        cart_data.city.name = "Gurgaon";
    } else {
        return callback(null, { success: false, msg: "Only Gurgaon city is allowed" });
    }
    if (!moment(startMonth).isSameOrAfter(min_date)) {
        return callback(null, { success: false, msg: "Please Choose Valid Date After Today" });
    }
    // Jacket RWA validation requred
    if (jacket_data.rwa.length) {
        cart_data.rwa = jacket_data.rwa;
        totPrice += 5 * jacket_data.rwa.length;
    } else {
        return callback(null, { success: false, msg: "Please choose atleast one Society" });
    }
    // Jacket dimension validation requred
    if (jacket_data.dimension.key == 'vinyl') {
        cart_data.dimension.key = jacket_data.dimension.key;
        cart_data.dimension.name = "Vinyl Sticker";
        totPrice += 10;
    } else if (jacket_data.dimension.key == 'option') {
        cart_data.dimension.key = jacket_data.dimension.key;
        cart_data.dimension.name = "Option2";
        totPrice += 5;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Dimension type" });
    }
    // Jacket creative validation requred
    if (jacket_data.creative.key == 'yes') {
        cart_data.creative.name = "Yes";
        cart_data.creative_url = "";
    } else if (jacket_data.creative.key == 'no') {
        cart_data.creative.name = "No";
        if (!jacket_data.isLater) {
            if (!jacket_data.creative_url || !jacket_data.creative_url.match(urlRegex)) {
                return callback(null, { success: false, msg: "Please Enter valid Creative url" });
            }
        }
        cart_data.creative_url = jacket_data.creative_url;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate creative type" });
    }
    if (!moment(startMonth).isSameOrAfter(min_month)) {
        return callback(null, { success: false, msg: "Please Choose Valid Date After Today" });
    } else {
        cart_data.startMonth = startMonth;
    }
    cart_data.totPrice = totPrice;
    //cart_data.creative.key = jacket_data.creative.key;
    return callback(null, { success: true, data: cart_data });
};

module.exports.addOrUpdateJacket = function (jacketData, userid, callback) {
    var query = new jacketCart({
        "userid": userid,
        "type": "jacket",
        "orderPlaced": false,
        "savedForLater": false,
        "data": {
            "city": jacketData.city,
            "rwa": jacketData.rwa,
            "dimension": jacketData.dimension,
            "creative": jacketData.creative,
            "creative_url": jacketData.creative_url,
            "startMonth": jacketData.startMonth,
            "totPrice": totPrice
        }
    });
    query.save(function (err, data) {
        if (err) throw err;
        let mailOptions = {
            from: '"Adecity" <no-reply@adecity.com>', // sender address
            to: "gaurav@okhlee.com", // list of receivers ,p@okhlee.com,Akshiya@okhlee.com,asif@okhlee.com
            subject: 'We have a new Jacket Branding Order', // Subject line
            html: `<p>Please <a href='http://www.admin-panel.adecity.com/orders/lift'>click here</a> to view order`
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return callback(null, { success: false, msg: "Something error occured, please try again later", })
            }
            return callback(err, { success: true, msg: 'cart added' });
        });
    });
};