const express = require('express');
const router = express.Router();
//const config = require('../config/database');
const con_letterbox = require('../controller/con-letterbox');
// checking and validation on items in lift cart
router.get('/letterbox-validation', (req, res) => {
    // let list = req.body.options;
    //   if (list === undefined) {
    //     return res.json({success: false, msg: "Some Error Occured While Adding To Cart"});
    //   }
    var list = {
        city: {
            id: 1,
        },
        type: {
            key : 'flyer1'
        },
        gsm: {
            key : 10
        },
        finish: {
            key : 'matte'
        },
        side: {
            key : 'both'
        },
        creative: {
            key : 'yes'
        },
        rwa: [10],
        startDate: '',
        creative_url: {type: String},
    };
    con_letterbox.allLetterboxItems(list, (err, result) => {
        return res.json(result);
    });
});
//end of code
module.exports = router;