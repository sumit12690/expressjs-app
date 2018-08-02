/* jshint esversion:6 */
var moment = require('moment');
var Vendor = require('../models/models/vendor');
var vendor_bizzCat = require('../models/models/vendor_bizzCat');
var mongoose = require('mongoose');
var async = require('async');
const week = [
    { name: 'Monday', value: 'monday' },
    { name: 'Tuesday', value: 'tuesday' },
    { name: 'Wednesday', value: 'wednesday' },
    { name: 'Thursday', value: 'thursday' },
    { name: 'Friday', value: 'friday' },
    { name: 'Saturday', value: 'saturday' },
    { name: 'Sunday', value: 'sunday' },
];
module.exports.validateVendor = function (vendorData, callback) {
    let urlRegex = new RegExp("^(?:([A-Za-z]+):)?(\\/{0,3})([0-9.\\-A-Za-z]+)(?::(\\d+))?(?:\\/([^?#]*))?(?:\\?([^#]*))?(?:#(.*))?$");
    // let urlRegex = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$");
    let nameRegex = new RegExp("^[a-zA-Z ]{2,60}$");
    let phoneRegex = new RegExp("^[7-9][0-9]{9}$");
    let emailRegex = new RegExp("^([\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4})?$");
    var objectid = mongoose.Types.ObjectId;
    if (!vendorData.vendor_name || !vendorData.vendor_name.match(nameRegex)) {
        return callback(null, { success: false, msg: "Please Enter a valid Name." });
    }
    if (vendorData.vendor_email && !vendorData.vendor_email.match(emailRegex)) {
        return callback(null, { success: false, msg: "Please Enter a valid Email Address." });
    }
    if (vendorData.vendor_website && !vendorData.vendor_website.match(urlRegex)) {
        return callback(null, { success: false, msg: "Please Enter a valid website link." });
    }
    if (vendorData.vendor_fb_link && !vendorData.vendor_fb_link.match(urlRegex)) {
        return callback(null, { success: false, msg: "Please Enter a valid Facebook link." });
    }
    if (vendorData.vendor_twitter_link && !vendorData.vendor_twitter_link.match(urlRegex)) {
        return callback(null, { success: false, msg: "Please Enter a valid Twitter link." });
    }
    if (vendorData.vendor_instagram_link && !vendorData.vendor_instagram_link.match(urlRegex)) {
        return callback(null, { success: false, msg: "Please Enter a valid instagram link." });
    }
    if (vendorData.vendor_linkedin_link && !vendorData.vendor_linkedin_link.match(urlRegex)) {
        return callback(null, { success: false, msg: "Please Enter a valid Linkedin link." });
    }
    if (!vendorData.vendor_desc) {
        return callback(null, { success: false, msg: "Please Enter a valid Description." });
    }
    if (!vendorData.subscription_type || !(vendorData.subscription_type == 'bronze' || vendorData.subscription_type == 'silver' || vendorData.subscription_type == 'gold')) {
        return callback(null, { success: false, msg: "Please select a valid Subscription." });
    }
    if (vendorData.vendor_other_phones) {
        var phones = Array.isArray(vendorData.vendor_other_phones) ? vendorData.vendor_other_phones : [vendorData.vendor_other_phones];
        var i;
        for (i = 0; i < phones.length; i++) {
            if (!phones[i].match(phoneRegex))
                return callback(null, { success: false, msg: "Please Enter a valid Phone Numbers." });
        }
    }
    if (!vendorData.cat_id || vendorData.cat_id == "") return callback(null, { success: false, msg: "Please Select Category." });
    vendor_bizzCat.findById({ '_id': objectid(vendorData.cat_id) }, function (err, catData) {
        if (err)
            return callback(null, { success: false, msg: "Please Select Appropriate Category." });
        else
            return callback(null, { success: true });
    });
};
module.exports.allCatList = function (callback) {
    vendor_bizzCat.find({}, { sub_category: 0 }, function (err, data) {
        return callback(err, data);
    });
};
module.exports.allVendorsList = function (callback) {
    Vendor.find({}, function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        return callback(err, data);
    });
};
module.exports.addVendor = function (vendorData, imagesData, callback) {
    var objectid = mongoose.Types.ObjectId;
    var vendor_bizz_cat = {};
    let business_subcategory = {};
    var vendor_images_data = [];
    var vendor_phone_data = [];
    var vendor_add_info = {};
    var social_url = {};
    var vendor_timings = [];
    var count = 0;
    // vendor_bizzCat.aggregate([
    //     { $unwind: { "path": "$sub_category", "preserveNullAndEmptyArrays": true } },
    //     { 
    //         $match: match_data
    //     }
    // ], function (err, catData) {
    vendor_bizzCat.findById({ '_id': objectid(vendorData.cat_id) }, function (err, catData) {
        if (err)
            return callback(err);
        if (catData) {
            vendor_bizz_cat = {
                cat_id: catData._id,
                name: catData.catname,
                slug: catData.slug,
            };
            if (catData.sub_category && catData.sub_category.length) {
                var elem = catData.sub_category.filter(item => {
                    return item._id == vendorData.subcat_id;
                });
                if (elem.length) {
                    business_subcategory.cat_id = elem[0]._id;
                    business_subcategory.name = elem[0].sub_cat_name;
                    business_subcategory.slug = elem[0].slug;
                }
                else {
                    return callback(err, { success: false, msg: 'Please Select Appropriate Subcategory.' });
                }
            }
            if (!vendorData.willDoLater) {
                for (var i = 0; i < week.length; i++) {
                    vendor_timings.push({
                        week_name: week[i].value,
                        startTime: vendorData.startTime[i],
                        endTime: vendorData.endTime[i],
                        isClosed: vendorData.isclosed ? (vendorData.isclosed.includes(week[i].value)) : false
                    });
                }
            }
            if (vendorData.vendor_fb_link) {
                social_url.fb = vendorData.vendor_fb_link;
            }
            if (vendorData.vendor_twitter_link) {
                social_url.twitter = vendorData.vendor_twitter_link;
            }
            if (vendorData.vendor_instagram_link) {
                social_url.instagram = vendorData.vendor_instagram_link;
            }
            if (vendorData.vendor_linkedin_link) {
                social_url.linkedin = vendorData.vendor_linkedin_link;
            }
            if (vendorData.vendor_email) {
                vendor_add_info.email = vendorData.vendor_email;
            }
            if (vendorData.vendor_website) {
                vendor_add_info.website = vendorData.vendor_website;
            }
            if (vendorData.vendor_email || vendorData.vendor_website) {
                vendor_add_info.social_url = social_url;
            }
            if (vendorData.vendor_phone) {
                var vendor_phone_arr = Array.isArray(vendorData.vendor_phone) ? vendorData.vendor_phone : [vendorData.vendor_phone];
                for (var i = 1; i <= vendor_phone_arr.length; i++) {
                    //console.log(vendorData.isOwner.includes(i))
                    if (vendor_phone_arr[i - 1] != "") {
                        vendor_phone_data.push({
                            phone: vendor_phone_arr[i - 1],
                            isOwner: (vendorData.isOwner && vendorData.isOwner.includes(i.toString())) ? true : false,
                            isManager: (vendorData.isManager && vendorData.isManager.includes(i.toString())) ? true : false,
                            isWhatsapp: (vendorData.isWhatsapp && vendorData.isWhatsapp.includes(i.toString())) ? true : false,
                            isCall: (vendorData.isCall && vendorData.isCall.includes(i.toString())) ? true : false,
                            isSMS: (vendorData.isSMS && vendorData.isSMS.includes(i.toString())) ? true : false,
                        });
                    }
                }
            }
            async.each(imagesData, (image, next) => {
                count++;
                vendor_images_data.push({
                    "image_num": count,
                    "image_url": image.location,
                    //"image_url": __dirname + image.path,
                });
                next();
            },
                function (err) {
                    var vendorObject = new Vendor({
                        "business_category": vendor_bizz_cat,
                        "business_subcategory": business_subcategory,
                        "vendor_name": vendorData.vendor_name,
                        "vendor_phones": vendor_phone_data,
                        "vendor_desc": vendorData.vendor_desc,
                        "vendor_images": vendor_images_data,
                        "vendor_timings": vendor_timings,
                        "vendor_primary_image": (vendorData.primary_image && vendorData.primary_image < count) ? vendorData.primary_image : count,
                        "address": {
                            full_address: vendorData.full_address,
                            street: vendorData.street,
                            city: vendorData.city,
                            State: vendorData.state,
                            landmark: vendorData.landmark,
                            lat: vendorData.lat,
                            long: vendorData.long,
                            zip: vendorData.zip,
                        },
                        "location" :{
                            type: "Point",
                            coordinates :[vendorData.long,vendorData.lat]
                        },
                        "subscription_type": vendorData.subscription_type,
                        "additional_info": vendor_add_info,
                        "billing_start_date": moment().utcOffset(330).format(),
                        "billing_end_date": moment().utcOffset(330).add(1, 'M').format(),
                    });
                    console.log('data to save');
                    console.log(vendorObject);
                    vendorObject.save(function (err, data) {
                        if (err) {
                            console.log('Error Inserting New Data');
                            if (err.name == 'ValidationError') {
                                for (field in err.errors) {
                                    console.log(err.errors[field].message);
                                }
                            }
                        }
                        return callback(err, { success: true, msg: 'Vendor added' });
                    });
                });
        } else {
            return callback(err, { success: false, msg: 'Please Select Appropriate Category.' });
        }
    });
};
module.exports.vendorDetail = function (vendorid, callback) {
    var objectid = mongoose.Types.ObjectId;
    Vendor.findById({ '_id': objectid(vendorid) }, function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        return callback(err, data);
    });
};
module.exports.updateVendor = function (vendorid, vendorData, callback) {
    var objectid = mongoose.Types.ObjectId;
    var vendor_bizz_cat = {};
    let business_subcategory = {};
    var vendor_phone_data = [];
    var vendor_add_info = {};
    var social_url = {};
    var vendor_timings = [];
    vendor_bizzCat.findById({ '_id': objectid(vendorData.cat_id) }, function (err, catData) {
        if (err)
            return callback(err);
        if (catData) {
            vendor_bizz_cat = {
                cat_id: catData._id,
                name: catData.catname,
                slug: catData.slug,
            };
            if (catData.sub_category && catData.sub_category.length) {
                var elem = catData.sub_category.filter(item => {
                    return item._id == vendorData.subcat_id;
                });
                if (elem.length) {
                    business_subcategory.cat_id = elem[0]._id;
                    business_subcategory.name = elem[0].sub_cat_name;
                    business_subcategory.slug = elem[0].slug;
                }
                else {
                    return callback(err, { success: false, msg: 'Please Select Appropriate Subcategory.' });
                }
            }
            if (vendorData.vendor_fb_link) {
                social_url.fb = vendorData.vendor_fb_link;
            }
            if (vendorData.vendor_twitter_link) {
                social_url.twitter = vendorData.vendor_twitter_link;
            }
            if (vendorData.vendor_instagram_link) {
                social_url.instagram = vendorData.vendor_instagram_link;
            }
            if (vendorData.vendor_linkedin_link) {
                social_url.linkedin = vendorData.vendor_linkedin_link;
            }
            if (vendorData.vendor_email) {
                vendor_add_info.email = vendorData.vendor_email;
            }
            if (vendorData.vendor_website) {
                vendor_add_info.website = vendorData.vendor_website;
            }
            if (vendorData.vendor_email || vendorData.vendor_website) {
                vendor_add_info.social_url = social_url;
            }
            if (vendorData.vendor_phone) {
                var vendor_phone_arr = Array.isArray(vendorData.vendor_phone) ? vendorData.vendor_phone : [vendorData.vendor_phone];
                for (var i = 1; i <= vendor_phone_arr.length; i++) {
                    if (vendor_phone_arr[i - 1] != "") {
                        vendor_phone_data.push({
                            phone: vendor_phone_arr[i - 1],
                            isOwner: (vendorData.isOwner && vendorData.isOwner.includes(i.toString())) ? true : false,
                            isManager: (vendorData.isManager && vendorData.isManager.includes(i.toString())) ? true : false,
                            isWhatsapp: (vendorData.isWhatsapp && vendorData.isWhatsapp.includes(i.toString())) ? true : false,
                            isCall: (vendorData.isCall && vendorData.isCall.includes(i.toString())) ? true : false,
                            isSMS: (vendorData.isSMS && vendorData.isSMS.includes(i.toString())) ? true : false,
                        });
                    }

                }
            }
            if (!vendorData.willDoLater) {
                for (var i = 0; i < week.length; i++) {
                    vendor_timings.push({
                        week_name: week[i].value,
                        startTime: vendorData.startTime[i],
                        endTime: vendorData.endTime[i],
                        isClosed: vendorData.isclosed ? (vendorData.isclosed.includes(week[i].value)) : false
                    });
                }
                vendorData.vendor_timings = vendor_timings;
            }
            vendorData.vendor_phones = vendor_phone_data;
            vendorData.additional_info = vendor_add_info;
            vendorData.business_category = vendor_bizz_cat;
            vendorData.business_subcategory = business_subcategory;
            vendorData.address = {
                full_address: vendorData.full_address,
                street: vendorData.street,
                city: vendorData.city,
                State: vendorData.state,
                landmark: vendorData.landmark,
                lat: vendorData.lat,
                long: vendorData.long,
                zip: vendorData.zip,
            };
            vendorData.location = {
                type: "Point",
                coordinates :[vendorData.long,vendorData.lat]
            };
            Vendor.findByIdAndUpdate({ '_id': objectid(vendorid) }, vendorData, function (err, data) {
                return callback(err, { success: true, msg: 'Vendor has been updated successfully' });
            });
        } else {
            return callback(err, { success: false, msg: 'Please Seclect Appropriate Category.' });
        }
    });
};
module.exports.deleteVendor = function (vendorid, callback) {
    var objectid = mongoose.Types.ObjectId;
    var imagesToDelete = [];
    Vendor.findById(vendorid, function (err, result) {
        if (result) {
            imagesToDelete = result.vendor_images;
        }
        //return callback(err, { success: true, msg: 'Vendor has been deleted' },imagesToDelete);
        Vendor.findByIdAndRemove({ '_id': objectid(vendorid) }, function (err, data) {
            return callback(err, { success: true, msg: 'Vendor has been deleted' });
        });
    });
};
module.exports.makeImagePrimary = function (data, callback) {
    var objectid = mongoose.Types.ObjectId;
    if (data.primary_image !== "1" && data.primary_image !== "2" && data.primary_image !== "3" && data.primary_image !== "4" && data.primary_image !== "5") {
        return callback(null, { success: false, msg: 'Cant make primary' });
    }
    Vendor.update({ '_id': objectid(data.vendor_id) }, { 'vendor_primary_image': data.primary_image }, function (err, result) {
        if (err) console.log(err);
        if (result.nModified) {
            return callback(err, { success: true });
        } else {
            return callback(err, { success: false, msg: 'This image is already set to primary' });
        }
    });
};
module.exports.updateVendorImage = function (vendorid, vendorData, vendorImage, callback) {
    var objectid = mongoose.Types.ObjectId;
    var imageToDelete;
    if (vendorData.image_id) {
        Vendor.aggregate([
            { $match: { "_id": objectid(vendorid) } },
            { $unwind: "$vendor_images" },
            { $match: { "vendor_images._id": objectid(vendorData.image_id) } }
        ], function (err, data) {
            if (data.length) {
                imageToDelete = data[0].vendor_images.image_url.split("https://adecity.ams3.digitaloceanspaces.com/")[1];
            }
            Vendor.update({ '_id': objectid(vendorid), 'vendor_images._id': objectid(vendorData.image_id) }, {
                $set: {
                    'vendor_images.$.image_url': vendorImage[0].location,
                }
            }, function (err, result) {
                if (err) console.log(err);
                if (result.nModified) {
                    return callback(err, { success: true, msg: 'Image has been modified successfully.' }, imageToDelete);
                }
            });
        });
    } else {
        vendor_image = {
            "image_num": parseInt(vendorData.image_count) + 1,
            "image_url": vendorImage[0].location,
            // "image_url": __dirname + vendorImage[0].path,
        };
        Vendor.update({ '_id': objectid(vendorid) }, { $push: { vendor_images: vendor_image } }, function (err, result) {
            if (err) console.log(err);
            if (result.nModified) {
                return callback(err, { success: true, msg: 'Image has been Inserted successfully.' });
            }
        });
    }
};
module.exports.updateOldVendors = function (callback) {
    var objectid = mongoose.Types.ObjectId;
    var status=true;
    Vendor.find({}, function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        for(var i=0;i<data.length;i++) {
            if(data[i].address.long!='' && data[i].address.lat!='') {
            var vendorData={};
             vendorData.location = {
                type: "Point",
                coordinates :[data[i].address.long,data[i].address.lat]
            };
            Vendor.update({ '_id': objectid(data[i]._id) }, vendorData, function (err, result) {
                if (err) 
                return callback(err, { success: false });
            });
            }
        }
        return callback(err, { success: true });
    });
};
/*Vendor.findOne({ '_id': objectid(data.vendor_id) }, function (err, result) {
    if (result) {
        var imageData = result.vendor_images;
        if (imageData) {
            imageData.forEach(function (item) {
                if (item._id == data.image_id) {
                    item.isPrimary = true;
                } else {
                    item.isPrimary = false;
                }
            });
        }

    }
    else {
        return callback(err, { success: false, msg: 'Invalid Vendor' });
    }
}); */
/* var count = 0;
            async.each(imagesData, (image, next) => {
                if (parseInt(vendorData.primary_image) == count)
                    isPrimary = true;
                else
                    isPrimary = false;
                vendor_image = {
                    "image_num": count,
                    "image_url": image.location,
                    "isPrimary": isPrimary,
                };
                Vendor.update({ '_id': objectid(vendorid), 'vendor_images.image_num': count }, {
                    $set: {
                        'vendor_images.$.image_url': image.location, 'vendor_images.$.isPrimary': isPrimary
                    }
                }, function (err, data) {
                    count++;
                    if (err) console.log(err);
                    if (data.nModified === 0) {
                        Vendor.update({ '_id': objectid(vendorid) }, { $push: { vendor_images: vendor_image } }, function (err, data) {
                            console.log(data);
                            if (err) console.log(err);
                            next();
                        });
                    } else {
                        next();
                    }

                });
            }, function (err) {
                if (err) throw err;
                //vendorData.vendor_images = vendor_images_data;

            }); */