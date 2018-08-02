var moment = require('moment');
module.exports.allLiftItems = function (list, callback) {
    let urlRegex = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$");
    let startDate = moment(list.startDate).utcOffset(330).format();
    let min_date = moment().utcOffset(330).subtract(1, 'day');
    //price variables that to be shown on front
    let totPrice = 0;
    // will return it to client side
    let cart_data = {
        material: {}, city: {}, rwa: [], type: {}, creative: {}, total_month: 0, startDate: "", creative_url: "", totPrice: 0
    };
    cart_data.total_month = list.total_month;
    if (list.city.id == 1) {
        cart_data.city.id = 1;
        cart_data.city.name = "Gurgaon";
    } else {
        return callback(null, { success: false, msg: "Only Gurgaon city is allowed" });
    }
    if (list.rwa.length) {
        cart_data.rwa = list.rwa;
    } else {
        return callback(null, { success: false, msg: "Please choose atleast one Society" });
    }
    //lift material validation requred
    if (list.material.key == 'vinyl') {
        cart_data.material.key = list.material.key;
        cart_data.material.name = "Vinyl Sticker";
    } else if (list.material.key == 'option') {
        cart_data.material.key = list.material.key;
        cart_data.material.name = "Option2";
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Material type" });
    }
    //lift ad type
    cart_data.type.key = list.type.key;
    if (list.type.key == 'inside') {
        cart_data.type.name = "Inside Lift";
    } else if (list.type.key == 'outside') {
        cart_data.type.name = "Outside Lift";
    } else if (list.type.key == 'both') {
        cart_data.type.name = "Both Sides";
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate type" });
    }
    cart_data.startDate = startDate;
    cart_data.creative.key = list.creative.key;
    if (!moment(startDate).isSameOrAfter(min_date)) {
        return callback(null, { success: false, msg: "Please Choose Valid Date After Today" });
    }
    //lift creative validation requred
    if (list.creative.key == 'yes') {
        cart_data.creative.name = "Yes";
        cart_data.creative_url = "";
    } else if (list.creative.key == 'no') {
        cart_data.creative.name = "No";
        if (!list.isLater) {
            if (!list.creative_url || !list.creative_url.match(urlRegex)) {
                return callback(null, { success: false, msg: "Please Enter valid Creative url" });
            }
        }
        cart_data.creative_url = list.creative_url;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate creative type" });
    }
    return callback(null, { success: true, data: cart_data });
};

module.exports.addOrUpdateLift = function (liftData, userid, callback) {
    var query = new liftCart({
        "userid": userid,
        "type": "lift",
        "orderPlaced": false,
        "savedForLater": false,
        "data": {
            "city": liftData.city,
            "rwa": liftData.rwa,
            "total_month": liftData.total_month,
            "startDate": liftData.startDate,
            "creative": liftData.creative,
            "material": liftData.material,
            "type": liftData.type,
            "creative_url": liftData.creative_url,
            "totPrice": totPrice
        }
    });
    query.save(function (err, data) {
        if (err) throw err;
        let mailOptions = {
            from: '"Adecity" <no-reply@adecity.com>', // sender address
            to: "gaurav@okhlee.com", // list of receivers ,p@okhlee.com,Akshiya@okhlee.com,asif@okhlee.com
            subject: 'We have a new Lift Branding Order', // Subject line
            html: `
             <p>Please <a href='http://www.admin-panel.adecity.com/orders/lift'>click here</a> to view order`
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