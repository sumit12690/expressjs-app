const express = require('express');
const router = express.Router();
//const config = require('../config/database');
const con_dustbin = require('../controller/con-dustbin');
// checking and validation on items in lift cart
router.get('/dustbin-validation', (req, res) => {
    // let list = req.body.options;
    //   if (list === undefined) {
    //     return res.json({success: false, msg: "Some Error Occured While Adding To Cart"});
    //   }
    var list = {
        city: {
            id: 1,
        },
        dimension: {
            key : 'dimension1'
        },
        material: {
            key : 'material1'
        },
        creative: {
            key : 'yes'
        },
        rwa: [10],
        startDate: '',
        creative_url: {type: String},
    };
    con_dustbin.allDustbinItems(list, (err, result) => {
        return res.json(result);
    });
});
//end of code
module.exports = router;