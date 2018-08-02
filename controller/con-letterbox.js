var moment = require('moment');
module.exports.allLetterboxItems = function (letterbox_data, callback) {
    let urlRegex = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$");
    let startDate = moment().utcOffset(330).format();
    let min_date = moment().utcOffset(330).subtract(1, 'day');
    // price variables that to be shown on front
    let totPrice = 0;

    // will return it to client side
    let cart_data = {
        city: {}, rwa: [], type: {}, gsm: {}, finish: {}, side: {}, creative: {}, startDate: "", totPrice: 0
    };

    // Letterbox City validation requred
    if (letterbox_data.city.id == 1) {
        cart_data.city.id = 1;
        cart_data.city.name = "Gurgaon";
    } else {
        return callback(null, { success: false, msg: "Only Gurgaon city is allowed" });
    };

    // Letterbox Type validation requred
    if (letterbox_data.type.key == 'flyer1') {
        cart_data.type.key = letterbox_data.type.key;
        cart_data.type.name = "Flyer 1";
        totPrice += 10;
    } else if (letterbox_data.type.key == 'flyer2') {
        cart_data.type.key = letterbox_data.type.key;
        cart_data.type.name = "Flyer 2";
        totPrice += 5;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Type" });
    };

    // Letterbox GSM Validation required
    if (letterbox_data.gsm.key == 10 || letterbox_data.gsm.key == 20 || letterbox_data.gsm.key == 30) {
        cart_data.gsm.key = letterbox_data.gsm.key;
        cart_data.gsm.name = letterbox_data.gsm.key;
        totPrice += letterbox_data.gsm.key;
    }
    else {
        return callback(null, { success: false, msg: "Please Choose appropriate GSM" });
    };

    // Letterbox Finish validation requred
    if (letterbox_data.finish.key == 'glossy') {
        cart_data.finish.key = letterbox_data.finish.key;
        cart_data.finish.name = 'Glossy';
        totPrice += 50;
    } else if (letterbox_data.finish.key == 'matte') {
        cart_data.finish.key = letterbox_data.finish.key;
        cart_data.finish.name = "Matte";
        totPrice += 100;
    } else if (letterbox_data.finish.key == 'plain') {
        cart_data.finish.key = letterbox_data.finish.key;
        cart_data.finish.name = "Plain";
        totPrice += 150;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Finish." });
    };

    // Letterbox Side validation requred
    if (letterbox_data.side.key == 'one') {
        cart_data.side.key = letterbox_data.side.key;
        cart_data.side.name = "One Side";
        totPrice += 25;
    } else if (letterbox_data.side.key == 'both') {
        cart_data.side.key = letterbox_data.side.key;
        cart_data.side.name = "Both Side";
        totPrice += 40;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Side" });
    };


    // Letterbox RWA validation requred
    if (letterbox_data.rwa.length) {
        cart_data.rwa = letterbox_data.rwa;
        totPrice += 5 * letterbox_data.rwa.length;
    } else {
        return callback(null, { success: false, msg: "Please choose atleast one Society" });
    };

    // Letterbox creative validation requred
    if (letterbox_data.creative.key == 'yes') {
        cart_data.creative.name = "Yes";
        cart_data.creative_url = "";
    } else if (letterbox_data.creative.key == 'no') {
        cart_data.creative.name = "No";
        if (!letterbox_data.isLater) {
            if (!letterbox_data.creative_url || !letterbox_data.creative_url.match(urlRegex)) {
                return callback(null, { success: false, msg: "Please Enter valid Creative url" });
            }
        }
        cart_data.creative_url = letterbox_data.creative_url;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate creative type" });
    }

    if (!moment(startDate).isSameOrAfter(min_date)) {
        return callback(null, { success: false, msg: "Please Choose Valid Date After Today" });
    } else {
        cart_data.startDate = startDate;
    }

    cart_data.totPrice = totPrice;
    //cart_data.creative.key = letterbox_data.creative.key;
    return callback(null, { success: true, data: cart_data });
};

module.exports.addOrUpdateLetterbox = function (letterboxData, userid, callback) {
    var query = new letterboxCart({
        "userid": userid,
        "type": "Letterbox",
        "orderPlaced": false,
        "savedForLater": false,
        "data": {
            "city": letterboxData.city,
            "type": letterboxData.dimension,
            "gsm": letterboxData.material,
            "finish": letterboxData.dimension,
            "side": letterboxData.material,
            "creative": letterboxData.creative,
            "rwa": letterboxData.rwa,
            "creative_url": letterboxData.creative_url,
            "startDate": letterboxData.startDate,
            "totPrice": totPrice
        }
    });
    query.save(function (err, data) {
        if (err) throw err;
        let mailOptions = {
            from: '"Adecity" <no-reply@adecity.com>', // sender address
            to: "gaurav@okhlee.com", // list of receivers ,p@okhlee.com,Akshiya@okhlee.com,asif@okhlee.com
            subject: 'We have a new Letterbox Branding Order', // Subject line
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