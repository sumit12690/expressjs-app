const express = require('express');
const router = express.Router();
//const config = require('../config/database');
//const doorstepCart = require('../models/doorstepCart');
const con_doorstep = require('../controller/con-doorstep');
// checking and validation on items in Doorstep cart
router.get('/doorstep-validation', (req, res) => {
    // let list = req.body.options;
    //   if (list === undefined) {
    //     return res.json({success: false, msg: "Some Error Occured While Adding To Cart"});
    //   }
    var list = {
        city: {
            id: 1,
        },
        dimension: {
            key: 'vinyl'
        },
        gsm: {
            key: 10
        },
        finish: {
            key: 'matte'
        },
        side: {
            key: 'both'
        },
        creative: {
            key: 'yes'
        },
        rwa: [10],
        startDate: '',
        creative_url: { type: String },
    };
    con_doorstep.allDoorstepItems(list, (err, result) => {
        if (result.success) {
            con_doorstep.addOrUpdateDoorstep(result.data, '5aa21aa88e27700a44d5bd33', (err, result) => {
                if (err) {
                    console.log(err);
                }
                return res.json(result);
            });
        }
    });
});
router.get('/list-cart', (req, res) => {
    con_doorstep.allDoorstepCartItems('5aa21aa88e27700a44d5bd33', (err, results) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(results);
        return res.render('cartlist', {
            results: results,
            errors: {}
        });
    });
});

router.get('/cart-item-detail/:cartid', (req, res) => {
    var cartid = req.params.cartid;
    console.log(cartid);
    con_doorstep.doorstepCartItemDetail(cartid, (err, results) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(results);
        return res.render('cartdetail', {
            results: results,
            errors: {}
        });
    });
});

router.get('/add-to-order/:cartid', (req, res) => {
    var cartid = req.params.cartid;
    console.log(cartid);
    con_doorstep.doorstepCartItemDetail(cartid, (err, results) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(results);
        return res.render('order-form', {
            results: results,
            errors: {}
        });
    });
});

router.post('/add-to-order/:cartid', (req, res) => {
    var cartid = req.params.cartid;
    var postData = req.body;
    console.log(cartid);
    con_doorstep.addOrderItem(cartid, postData, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
        if (result.success) {
            con_doorstep.updateCartOrderStatus(cartid, (err, result) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log(result);
                return res.json(result);
            });
        } else {
            console.log(result);
            return res.json(result);
        }

    });
});

//end of code
module.exports = router;