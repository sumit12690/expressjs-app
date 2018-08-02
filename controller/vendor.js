/* jshint esversion:6 */
var moment = require('moment');
var Vendor = require('../models/models/vendor');
var bizzCat = require('../models/models/bizzCat');
var mongoose = require('mongoose');
var async = require('async');
module.exports.allVendorsList = function (callback) {
    Vendor.find({}, function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        return callback(err, data);
    });
};
module.exports.latestVendors = function (callback) {
    Vendor.find({}, {}, { sort: { createdAt: -1 } }, function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        return callback(err, data);
    });
};
module.exports.oldestVendors = function (callback) {
    Vendor.find({}, {}, { sort: { createdAt: 1 } }, function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        return callback(err, data);
    });
};
module.exports.nearestVendors = function (options, callback) {
    var aggregateQuery = [{
        "$geoNear": {
            "near": {
                "type": "Point",
                "coordinates": [parseFloat(options.lng), parseFloat(options.lat)]
            },
            "distanceField": 'distance',
            "spherical": true,
        },
    }, {
        "$sort": { "distance": 1 }
    }];
    Vendor.aggregate(aggregateQuery, function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        return callback(err, data);
    });
};
module.exports.vendorsJson = function (postData, callback) {
    var objectid = mongoose.Types.ObjectId;
    var lng = parseFloat(postData.lng);
    var lat = parseFloat(postData.lat);
    var maxDistance = parseFloat(postData.maxDistance);
    var geoNearQuery = '';
    var sortBy = postData.sortBy;
    var matchQuery = {
        $match: {
            "business_category.cat_id": objectid("5acb7349b1eb260d047f7ae7")
        }
    };
    var aggregateQuery = [];
    if (sortBy == 'distance') {
        if ((lng && lng !== 0) && (lat && lat !== 0) && maxDistance) {
            geoNearQuery = {
                "$geoNear": {
                    "near": {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    distanceField: 'distance',
                    spherical: true,
                    distanceMultiplier: 0.001
                }
            }
            aggregateQuery.push(geoNearQuery);
            sortQuery = { "$sort": { "distance": 1 } };
        }
    }
   // aggregateQuery.push(matchQuery);
   aggregateQuery.push({ "$project": {
        "_id": 0,
        "address": 1,
        "distance": 1,
       // "location": 1
    }});
   
    var sortQuery = '';
    if (sortBy == 'latest') {
        sortQuery = { "$sort": { "createdAt": -1 } };
    }
    if (sortBy == 'oldest') {
        sortQuery = { "$sort": { "createdAt": 1 } };
    }
    if (sortQuery != '') {
        aggregateQuery.push(sortQuery);
    }
    console.log(aggregateQuery);

    Vendor.aggregate(aggregateQuery, function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        return callback(err, data);
    });
};
var meterConversion = (function () {
    var mToKm = function (distance) {
        return parseFloat(distance / 1000);
    };
    var kmToM = function (distance) {
        return parseFloat(distance * 1000);
    };
    return {
        mToKm: mToKm,
        kmToM: kmToM
    };
})();