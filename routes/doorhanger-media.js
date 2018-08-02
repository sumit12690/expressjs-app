const express = require('express');
const router = express.Router();
//const config = require('../config/database');
//const doorhangerCart = require('../models/doorhangerCart');
const con_doorhanger = require('../controller/con-doorhanger');
// checking and validation on items in lift cart
router.get('/doorhanger-validation', (req, res) => {
    // let list = req.body.options;
    //   if (list === undefined) {
    //     return res.json({success: false, msg: "Some Error Occured While Adding To Cart"});
    //   }
    var list = {
        city: {
            id: 1,
        },
        type1: {
            key : 'type1'
        },
        type2: {
            key : 'type2'
        },
        type3: {
            key : 'type3'
        },
        creative: {
            key : 'yes'
        },
        rwa: [10],
        startDate: '',
        creative_url: {type: String},
    };
    con_doorhanger.allDoorhangerItems(list, (err, result) => {
        return res.json(result);
    });
});
//end of code
module.exports = router;