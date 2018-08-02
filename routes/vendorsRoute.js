/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const vendor = require('../controller/vendor');
const moment = require('moment');
const config = require('../config/config');
var auth_superadmin = require('../middleware/auth');
router.get('/', auth_superadmin, function (req, res) {
    vendor.allVendorsList((err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.json(data);
    });
});
router.get('/latest-vendors', auth_superadmin, function (req, res) {
    vendor.latestVendors((err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.json(data);
    });
});
router.get('/oldest-vendors', auth_superadmin, function (req, res) {
    vendor.oldestVendors((err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.json(data);
    });
});
router.get('/nearest-vendors/:lat/:lng', auth_superadmin, function (req, res) {
    var options = {'lat':req.params.lat,'lng':req.params.lng};
    vendor.nearestVendors(options,(err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.json(data);
    });
});
router.post('/get-vendors-json', auth_superadmin, function (req, res) {
    var postData = req.body;
    vendor.vendorsJson(postData,(err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.json(data);
    });
});
module.exports = router;