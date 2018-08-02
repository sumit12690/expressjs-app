var moment = require('moment');
module.exports.allDoorhangerItems = function (doorhanger_data, callback) {
    let urlRegex = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$");
    let startDate = moment().utcOffset(330).format();
    let min_date = moment().utcOffset(330).subtract(1, 'day');
    // price variables that to be shown on front
    let totPrice = 0;
    // will return it to client side
    let cart_data = {
        city: {}, rwa: [], type1: {}, type2: {}, type3: {}, creative: {}, startDate: "", totPrice: 0
    };

    // Doorhanger City validation requred
    if (doorhanger_data.city.id == 1) {
        cart_data.city.id = 1;
        cart_data.city.name = "Gurgaon";
    } else {
        return callback(null, { success: false, msg: "Only Gurgaon city is allowed" });
    };

    // Doorhanger RWA validation requred
    if (doorhanger_data.rwa.length) {
        cart_data.rwa = doorhanger_data.rwa;
        totPrice+=5*doorhanger_data.rwa.length;
    } else {
        return callback(null, { success: false, msg: "Please choose atleast one Society" });
    };

    // Doorhanger Type1 validation requred
    if (doorhanger_data.type1.key == 'type1') {
        cart_data.type1.key = doorhanger_data.type1.key;
        cart_data.type1.name = 'Type1';
        totPrice+=50;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Type 1." });
    };

    // Doorhanger Type2 validation requred
    if (doorhanger_data.type2.key == 'type2') {
        cart_data.type2.key = doorhanger_data.type2.key;
        cart_data.type2.name = 'Type2';
        totPrice+=50;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Type 2." });
    };

    // Doorhanger Type3 validation requred
    if (doorhanger_data.type3.key == 'type1') {
        cart_data.type3.key = doorhanger_data.type3.key;
        cart_data.type3.name = 'Type3';
        totPrice+=50;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate Type 3." });
    };

    // Doorhanger creative validation requred
    if (doorhanger_data.creative.key == 'yes') {
        cart_data.creative.name = "Yes";
        cart_data.creative_url = "";
    } else if (doorhanger_data.creative.key == 'no') {
        cart_data.creative.name = "No";
        if (!doorhanger_data.isLater) {
            if (!doorhanger_data.creative_url || !doorhanger_data.creative_url.match(urlRegex)) {
                return callback(null, { success: false, msg: "Please Enter valid Creative url" });
            }
        }
        cart_data.creative_url = doorhanger_data.creative_url;
    } else {
        return callback(null, { success: false, msg: "Please Choose appropriate creative type" });
    }
    cart_data.startDate = startDate;
    cart_data.totPrice = totPrice;
    //cart_data.creative.key = doorhanger_data.creative.key;
    return callback(null, { success: true, data: cart_data });
};

module.exports.addOrUpdateDoorhanger = function (doorhangerData, userid, callback) {
    var query = new doorhangerCart({
        "userid": userid,
        "type": "doorhanger",
        "orderPlaced": false,
        "savedForLater": false,
        "data": {
            "city": doorhangerData.city,
            "rwa": doorhangerData.rwa,
            "type1": doorhangerData.type1,
            "type2": doorhangerData.type2,
            "type3": doorhangerData.type3,
            "creative": doorhangerData.creative,
            "creative_url": doorhangerData.creative_url,
            "startDate": doorhangerData.startDate,
            "totPrice" : totPrice
        }
    });

    query.save(function (err, data) {
        if (err) throw err;
        let mailOptions = {
            from: '"Adecity" <no-reply@adecity.com>', // sender address
            to: "gaurav@okhlee.com", // list of receivers ,p@okhlee.com,Akshiya@okhlee.com,asif@okhlee.com
            subject: 'We have a new Doorhanger Branding Order', // Subject line
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