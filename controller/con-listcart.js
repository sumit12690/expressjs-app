var DoorstepCart = require('../models/doorstepCart');
module.exports.allDoorstepCartItems =function (userid, callback) {
    var query=new DoorstepCart();
    DoorstepCart.aggregate([
        { "$unwind": "$doorstepcarts.data" },
        {
            "$lookup": {
                "from": "users",
                "localField": "doorstepcarts.userid",
                "foreignField": "_id",
                "as": "resultingDoorstepcartsArray"
            }
        },
     ],function (err, data) {
        console.log(data);
        // res.render('login', {
        //     data: data,
        //     errors: errors
        // });
     });
};