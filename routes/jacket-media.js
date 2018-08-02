const express = require('express');
const router = express.Router();
//const config = require('../config/database');
//const jacketCart = require('../models/jacketCart');
const con_jacket = require('../controller/jacket');
// checking and validation on items in lift cart
router.get('/jacket-validation', (req, res) => {
    // let list = req.body.options;
    //   if (list === undefined) {
    //     return res.json({success: false, msg: "Some Error Occured While Adding To Cart"});
    //   }
    var list = {
        city: {
            id: 1,
        },
        rwa: [10],
        dimension: {
            key : 'vinyl'
        },
        creative: {
            key : 'yes'
        },
        startMonth: '',
    };
    con_jacket.allJacketItems(list, (err, result) => {
        return res.json(result);
    });
});
module.exports = router;