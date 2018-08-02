var moment = require('moment');
module.exports.allNoticeboardItems = function (noticeboard_data, callback) {
    let urlRegex = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$");
    let startDate = moment().utcOffset(330).format();
    let min_date = moment().utcOffset(330).subtract(1, 'day');
    let startWeek = moment().utcOffset(330).startOf('isoWeek');
    let min_week = moment().utcOffset(330).subtract(1, 'weeks').startOf('isoWeek');
    // price variables that to be shown on front
    let totPrice = 0;
    // will return it to client side
    let cart_data = {
        city: {}, rwa: [], dimension: {}, orientation: {}, creative: {}, startWeek: "", startDate: "", totPrice: 0
    };

    // Noticeboard City validation requred
    if (noticeboard_data.city.id == 1) {
        cart_data.city.id = 1;
        cart_data.city.name = "Gurgaon";
    } else {
        return callback(null, { success: false, msg: "Only Gurgaon city is allowed" });
    };

    // Noticeboard dimension validation requred
    if (noticeboard_data.dimension.key == 'dimension1') {
        cart_data.dimension.key = noticeboard_data.dimension.key;
        cart_data.dimension.name = "dimension1";
        totPrice += 10;
    } else if (noticeboard_data.dimension.key == 'dimension2') {
        cart_data.dimension.key = noticeboard_data.dimension.key;
        cart_data.dimension.name = "dimension2";
        totPrice += 5;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Dimension1" });
    };

    // Noticeboard Orientation validation requred
    if (noticeboard_data.orientation.key == 'landscape') {
        cart_data.orientation.key = noticeboard_data.orientation.key;
        cart_data.orientation.name = "Landscape";
        totPrice += 25;
    } else if (noticeboard_data.orientation.key == 'portrait') {
        cart_data.orientation.key = noticeboard_data.orientation.key;
        cart_data.orientation.name = "Portrait";
        totPrice += 40;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Orientataion" });
    };

    // Noticeboard RWA validation requred
    if (noticeboard_data.rwa.length) {
        cart_data.rwa = noticeboard_data.rwa;
        totPrice += 5 * noticeboard_data.rwa.length;
    } else {
        return callback(null, { success: false, msg: "Please choose atleast one Society" });
    };

    // Noticeboard creative validation requred
    if (noticeboard_data.creative.key == 'yes') {
        cart_data.creative.name = "Yes";
        cart_data.creative_url = "";
    } else if (noticeboard_data.creative.key == 'no') {
        cart_data.creative.name = "No";
        if (!noticeboard_data.isLater) {
            if (!noticeboard_data.creative_url || !noticeboard_data.creative_url.match(urlRegex)) {
                return callback(null, { success: false, msg: "Please Enter valid Creative url" });
            }
        }
        cart_data.creative_url = noticeboard_data.creative_url;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate creative type" });
    }

    if (!moment(startWeek).isSameOrAfter(min_week)) {
        return callback(null, { success: false, msg: "Please Choose Valid Week" });
    } else {
        cart_data.startWeek = startWeek;
    }

    if (!moment(startDate).isSameOrAfter(min_date)) {
        return callback(null, { success: false, msg: "Please Choose Valid Date After Today" });
    } else {
        cart_data.startDate = startDate;
    }

    cart_data.totPrice = totPrice;
    //cart_data.creative.key = noticeboard_data.creative.key;
    return callback(null, { success: true, data: cart_data });
};

module.exports.addOrUpdateNoticeboard = function (noticeboardData, userid, callback) {
    var query = new noticeboardCart({
        "userid": userid,
        "type": "Noticeboard",
        "orderPlaced": false,
        "savedForLater": false,
        "data": {
            "city": noticeboardData.city,
            "dimension1": noticeboardData.dimension1,
            "dimension2": noticeboardData.dimension2,
            "orientation": noticeboardData.orientation,
            "creative": noticeboardData.creative,
            "rwa": noticeboardData.rwa,
            "creative_url": noticeboardData.creative_url,
            "startDate": noticeboardData.startDate,
            "startWeek": noticeboardData.startWeek,
            "totPrice": totPrice
        }
    });
    query.save(function (err, data) {
        if (err) throw err;
        let mailOptions = {
            from: '"Adecity" <no-reply@adecity.com>', // sender address
            to: "gaurav@okhlee.com", // list of receivers ,p@okhlee.com,Akshiya@okhlee.com,asif@okhlee.com
            subject: 'We have a new Noticeboard Branding Order', // Subject line
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
    });
};