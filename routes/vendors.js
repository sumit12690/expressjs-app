/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const con_vendor = require('../controller/con-vendor');
const moment = require('moment');
const config = require('../config/config');
var auth_superadmin = require('../middleware/auth');
var week = [
    { name: 'Monday', value: 'monday' },
    { name: 'Tuesday', value: 'tuesday' },
    { name: 'Wednesday', value: 'wednesday' },
    { name: 'Thursday', value: 'thursday' },
    { name: 'Friday', value: 'friday' },
    { name: 'Saturday', value: 'saturday' },
    { name: 'Sunday', value: 'sunday' },
];
var time = [
    { name: '01.00 AM', value: '01' },
    { name: '02.00 AM', value: '02' },
    { name: '03.00 AM', value: '03' },
    { name: '04.00 AM', value: '04' },
    { name: '05.00 AM', value: '05' },
    { name: '06.00 AM', value: '06' },
    { name: '07.00 AM', value: '07' },
    { name: '08.00 AM', value: '08' },
    { name: '09.00 AM', value: '09' },
    { name: '10.00 AM', value: '10' },
    { name: '11.00 AM', value: '11' },
    { name: '12.00 AM', value: '12' },
    { name: '01.00 PM', value: '13' },
    { name: '02.00 PM', value: '14' },
    { name: '03.00 PM', value: '15' },
    { name: '04.00 PM', value: '16' },
    { name: '05.00 PM', value: '17' },
    { name: '06.00 PM', value: '18' },
    { name: '07.00 PM', value: '19' },
    { name: '08.00 PM', value: '20' },
    { name: '09.00 PM', value: '21' },
    { name: '10.00 PM', value: '22' },
    { name: '11.00 PM', value: '23' },
    { name: '12.00 PM', value: '24' },
];
//aws
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const spacesEndpoint = new aws.Endpoint('ams3.digitaloceanspaces.com');
const s3 = new aws.S3({
    endpoint: spacesEndpoint
});
aws.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.s3_bucket_name,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (request, file, cb) {
            var ext = "";
            if (!path.extname(file.originalname)) {
                ext = ".jpg";
            }
            cb(null, 'vendors/profilePic/' + Date.now() + '-' + file.originalname + ext);
        },
    }),
    limits: {
        fileSize: config.vendor_file_size
    }
}).array('upload', 5);
// var storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, './vendors/profilePic/');
//     },
//     filename: function (req, file, callback) {
//         callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });
// var upload = multer({ storage: storage }).any();
// view vendors
router.get('/', auth_superadmin, function (req, res) {
    return res.render('vendor-home', {
        title: "Adecity vendors",
        role: req.session.role,
        username: req.session.username,
    });
});
router.get('/view-vendors', auth_superadmin, function (req, res) {
    con_vendor.allVendorsList((err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
        return res.render('vendor-list', {
            result: result,
            title: "Adecity vendors list",
            role: req.session.role,
            username: req.session.username,
            moment: moment
        });
    });
});
router.get('/add-vendors', auth_superadmin, (req, res) => {
    con_vendor.allCatList((err, result) => {
        if (err)
            throw err;
        return res.render('vendor-add', {
            categoryList: result,
            week: week,
            time: time,
            title: "Add adecity vendors",
            role: req.session.role,
            username: req.session.username,
            vendorData: {},
            errorData : {},
        });
    });
});
router.post('/add-vendors', auth_superadmin, (req, res) => {
    upload(req, res, function (error) {
        if (error) {
            console.log(error);
            if (error.code == "LIMIT_FILE_SIZE") {
                return res.redirect('/vendors/add-vendors?added=false&msg=File too large, maximum capacity is 15 mb');
            }
            return res.redirect('/vendors/add-vendors?added=false&msg=Technical Error, Try Again Later');
        }
        var postData = req.body;
        console.log(postData);
        con_vendor.validateVendor(postData, (err, result) => {
            if (err) {
                console.log(err);
                throw err;
            }
            if (result.success) {
                con_vendor.addVendor(postData, req.files, (err, result) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    if (result.success)
                        return res.redirect('/vendors/view-vendors?added=true&msg=Successfully added');
                    else
                        return res.redirect('/vendors/add-vendors?added=false&msg=' + result.msg);
                });
            }
            else {
                con_vendor.allCatList((err, categoryList) => {
                    console.log(postData);
                    if (err)
                        throw err;
                    return res.render('vendor-add', {
                        categoryList: categoryList,
                        week: week,
                        time: time,
                        title: "Add adecity vendors",
                        role: req.session.role,
                        username: req.session.username,
                        vendorData: postData,
                        errorData : {'error':true, 'msg':result.msg},
                    });
                });
            }
        });
    });
});
router.get('/update-vendor/:vendorid', auth_superadmin, (req, res) => {
    var vendorid = req.params.vendorid;
    con_vendor.vendorDetail(vendorid, (err, vendorData) => {
        if (err) {
            console.log(err);
            throw err;
        }
        con_vendor.allCatList((err, result) => {
            if (err) throw err;
            console.log(vendorData);
            return res.render('vendor-edit-form', {
                categoryList: result,
                week: week,
                time: time,
                title: "Adecity Vendor Update",
                role: req.session.role,
                username: req.session.username,
                vendorData: vendorData,
                errorData : {},
            });
        });
    });
});
router.post('/update-vendor/:vendorid', auth_superadmin, (req, res) => {
    var vendorid = req.params.vendorid;
    var postData = req.body;
    con_vendor.validateVendor(postData, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
        if (result.success) {
            con_vendor.updateVendor(vendorid, postData, (err, data) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (data.success)
                    return res.redirect('/vendors/update-vendor/' + req.params.vendorid + '?updated=true&msg=Updated Successfully');
                else
                    return res.redirect('/vendors/update-vendor/' + req.params.vendorid + '?updated=false&msg=' + data.msg);
            });
        }
        else {
            return res.redirect('/vendors/update-vendor/' + req.params.vendorid + '?updated=false&msg=' + result.msg);
        }
    });
});
router.get('/vendor-detail/:vendorid', auth_superadmin, (req, res) => {
    var vendorid = req.params.vendorid;
    con_vendor.vendorDetail(vendorid, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
        return res.render('vendor-detail', {
            result: result,
            title: "Adecity Vendor Detail",
            role: req.session.role,
            username: req.session.username,
            moment: moment,
            week: week
        });
    });
});
router.post('/update-vendor-image/:vendorid', auth_superadmin, (req, res) => {
    upload(req, res, function (error) {
        console.log(error);
        if (error) {
            if (error.code == "LIMIT_FILE_SIZE") {
                return res.redirect('/update-vendor-image/' + req.params.vendorid + '?added=false&msg=File too large, maximum capacity is 2 mb');
            }
            return res.redirect('/update-vendor-image/' + req.params.vendorid + '?added=false&msg=Technical Error, Try Again Later');
        }
        var vendorid = req.params.vendorid;
        var postData = req.body;
        con_vendor.updateVendorImage(vendorid, postData, req.files, (err, result, imageToDelete) => {
            if (err) {
                console.log(err);
                throw err;
            }
            if (imageToDelete) {
                deleteImageFromS3(decodeURI(imageToDelete));
            }
            if (result.success)
                return res.redirect('/vendors/view-vendors?updated=true&msg=Updated Successfully');
            else
                return res.redirect('/vendors/view-vendors?updated=false&msg=' + result.msg);
        });
    });
});
router.post('/make-image-primary', auth_superadmin, (req, res) => {
    con_vendor.makeImagePrimary(req.body, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
        return res.json(result);
    });
});
router.get('/delete-vendor/:vendorid', auth_superadmin, (req, res) => {
    var vendorid = req.params.vendorid;
    con_vendor.deleteVendor(vendorid, (err, result, imageToDelete) => {
        if (err) {
            console.log(err);
            throw err;
        }
        // if (imageToDelete.length) {
        //     deleteMultipleImageFromS3(imageToDelete);
        // }
        if (result.success)
            return res.redirect('/vendors/view-vendors?delete=true&msg=Deleted Successfully');
        else
            return res.redirect('/vendors/view-vendors?delete=false&msg=Error in deletion');
    });
});
router.get('/get-objects', (req, res) => {
    var params = {
        Bucket: config.s3_bucket_name,
        MaxKeys: 100,
        Delimiter: '/',
        Prefix: 'vendors/profilePic/'
    };
    s3.listObjectsV2(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        res.json(data);
    });
});
router.get('/update-old-vendors', auth_superadmin, function (req, res) {
    con_vendor.updateOldVendors((err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
        if (result.success)
            return res.redirect('/vendors/view-vendors?updated=true&msg=All Vendors Successfully Updated');
        else
            return res.redirect('/vendors/view-vendors?updated=false&msg=Error in Vendor Updation');
    });
});
/* router.get('/delete-objects/', (req, res) => {
    var params = {
        Bucket: config.s3_bucket_name,
        Key: req.query.id
    };
    console.log(params);
    s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}); */
function deleteMultipleImageFromS3(image_arr) {
    var newImages = image_arr.map(function (img) {
        return { 'Key': decodeURI(img.image_url.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, '')) };
    });
    var params = {
        Bucket: config.s3_bucket_name,
        Delete: {
            Objects: newImages,
            Quiet: false
        }
    };
    s3.deleteObjects(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}
function deleteImageFromS3(image_key) {
    var params = {
        Bucket: config.s3_bucket_name,
        Key: image_key.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, '')
    };
    s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
        /*
    data = {
        }
        */
    });
}
function getDistanceFromLatLonInKm(lat1,long1,lat2=26.89893,long2=75.827179) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(long2-long1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
module.exports = router;
/* router.post('/update-vendors/:vendorid', (req, res) => {
    upload(req, res, function (error) {
        if (error) {
            console.log(error);
            return res.json({ success: false, msg: 'Error in Uploading file' });
        }
        var vendorid = req.params.vendorid;
        var postData = req.body;
        con_vendor.validateVendor(postData, (err, result) => {
            if (err) {
                console.log(err);
                throw err;
            }
            if (result.success) {
                console.log(req.files)
                con_vendor.updateVendor(vendorid, postData, req.files, (err, result) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    if (result.success)
                        return res.redirect('/vendors/view-vendors?updated=true&msg=Updated Successfully');
                    else
                        return res.redirect('/vendors/view-vendors?updated=false&msg=' + result.msg);
                });
            }
            else {
                return res.redirect('/vendors/view-vendors?updated=false&msg=' + result.msg);
            }
        });
    });
}); */