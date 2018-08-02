var moment = require('moment');
module.exports.allDustbinItems = function (dustbin_data, callback) {
    let urlRegex = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$");
    let startDate = moment().utcOffset(330).format();
    let min_date = moment().utcOffset(330).subtract(1, 'day');
    // price variables that to be shown on front
    let totPrice = 0;
    // will return it to client side

    let cart_data = {
        city: {}, rwa: [], dimension: {}, material: {}, creative: {}, startDate: "", totPrice: 0
    };

    // Dustbin City validation requred
    if (dustbin_data.city.id == 1) {
        cart_data.city.id = 1;
        cart_data.city.name = "Gurgaon";
    } else {
        return callback(null, { success: false, msg: "Only Gurgaon city is allowed" });
    };

    // Dustbin dimension validation requred
    if (dustbin_data.dimension.key == 'dimension1') {
        cart_data.dimension.key = dustbin_data.dimension.key;
        cart_data.dimension.name = "dimension1";
        totPrice += 10;
    } else if (dustbin_data.dimension.key == 'dimension2') {
        cart_data.dimension.key = dustbin_data.dimension.key;
        cart_data.dimension.name = "dimension2";
        totPrice += 5;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Dimension1" });
    };

    // Dustbin Material validation requred
    if (dustbin_data.material.key == 'material1') {
        cart_data.material.key = dustbin_data.material.key;
        cart_data.material.name = "material1";
        totPrice += 25;
    } else if (dustbin_data.material.key == 'material2') {
        cart_data.material.key = dustbin_data.material.key;
        cart_data.material.name = "material2";
        totPrice += 40;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Material" });
    };

    // Dustbin RWA validation requred
    if (dustbin_data.rwa.length) {
        cart_data.rwa = dustbin_data.rwa;
        totPrice += 5 * dustbin_data.rwa.length;
    } else {
        return callback(null, { success: false, msg: "Please choose atleast one Society" });
    };

    // Dustbin creative validation requred
    if (dustbin_data.creative.key == 'yes') {
        cart_data.creative.name = "Yes";
        cart_data.creative_url = "";
    } else if (dustbin_data.creative.key == 'no') {
        cart_data.creative.name = "No";
        if (!dustbin_data.isLater) {
            if (!dustbin_data.creative_url || !dustbin_data.creative_url.match(urlRegex)) {
                return callback(null, { success: false, msg: "Please Enter valid Creative url" });
            }
        }
        cart_data.creative_url = dustbin_data.creative_url;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate creative type" });
    }

    if (!moment(startDate).isSameOrAfter(min_date)) {
        return callback(null, { success: false, msg: "Please Choose Valid Date After Today" });
    } else {
        cart_data.startDate = startDate;
    }

    cart_data.totPrice = totPrice;
    //cart_data.creative.key = dustbin_data.creative.key;
    return callback(null, { success: true, data: cart_data });
};

module.exports.addOrUpdateDustbin = function (dustbinData, userid, callback) {
    var query = new dustbinCart({
        "userid": userid,
        "type": "Dustbin",
        "orderPlaced": false,
        "savedForLater": false,
        "data": {
            "city": dustbinData.city,
            "dimension": dustbinData.dimension,
            "material": dustbinData.material,
            "creative": dustbinData.creative,
            "rwa": dustbinData.rwa,
            "creative_url": dustbinData.creative_url,
            "startDate": dustbinData.startDate,
            "totPrice": totPrice
        }
    });
    query.save(function (err, data) {
        if (err) throw err;
        let mailOptions = {
            from: '"Adecity" <no-reply@adecity.com>', // sender address
            to: "gaurav@okhlee.com", // list of receivers ,p@okhlee.com,Akshiya@okhlee.com,asif@okhlee.com
            subject: 'We have a new Dustbin Branding Order', // Subject line
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