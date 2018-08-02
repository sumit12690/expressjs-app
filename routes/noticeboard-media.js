const express = require('express');
const router = express.Router();
//const config = require('../config/database');
//const noticeboardCart = require('../models/noticeboardCart');
const con_noticeboard = require('../controller/con-noticeboard');
// checking and validation on items in lift cart
router.get('/noticeboard-validation', (req, res) => {
    // let list = req.body.options;
    //   if (list === undefined) {
    //     return res.json({success: false, msg: "Some Error Occured While Adding To Cart"});
    //   }
    var list = {
        city: {
            id: 1,
        },
        dimension1: {
            key : 'vinyl'
        },
        dimension2: {
            key : 'vinyl'
        },
        orientation: {
            key : 'landscape'
        },
        creative: {
            key : 'yes'
        },
        rwa: [10],
        startDate: '',
        creative_url: {type: String},
    };
    con_noticeboard.allNoticeboardItems(list, (err, result) => {
        return res.json(result);
    });
});
//end of code
module.exports = router;