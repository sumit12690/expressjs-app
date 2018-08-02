var moment = require('moment');
var bizzCat = require('../models/models/bizzCat');
var mongoose = require('mongoose');
var async = require('async');


module.exports.allCatList = function (callback) {
    bizzCat.find({}, { "sub_category": 0 }, function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        return callback(err, data);
    });
};

module.exports.getCatBySearch = function (keyword, callback) {
    var rgx = new RegExp(keyword, 'i');
    bizzCat.find({ 'catname': rgx }, { "catname": 1 }, function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        bizzCat.aggregate(
            [
                { $unwind: "$sub_category" },
                { $match: { 'sub_category.sub_cat_name': rgx } },
                { $project : {'catname' : 1,'sub_category.sub_cat_name':1} }
            ], function (err, result) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                return callback(err, data, result);
            });
    });
};
module.exports.subCatList = function (id, callback) {
    bizzCat.findOne({ "_id": mongoose.Types.ObjectId(id) }, { "sub_category": 1 }, function (err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        return callback(err, data);
    });
};
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}
module.exports.addCategory = function (catname, sub_cat_name, type, callback) {
    bizzCat.findOne({ "catname": catname }, function (err, data) {
        if (!data) {
            var sub_cat = Array.isArray(sub_cat_name) ? sub_cat_name.sort() : [sub_cat_name];
            var sub_category = [];
            sub_cat.forEach(function (item) {
                if (item != '') {
                    sub_category.push({
                        sub_cat_name: item,
                        slug: slugify(item)
                    });
                }
            });
            var query = new bizzCat({
                "catname": catname,
                "type": type,
                "slug": slugify(catname),
                "sub_category": sub_category
            });
            query.save(function (err, data) {
                if (err) throw err;
                return callback(err, { success: true, msg: 'Category added' });
            });
        } else {
            return callback(err, { success: false, msg: 'Category Exists' });
        }
    });
};
module.exports.updateCategory = function (data, sub_cat, callback) {
    if (!sub_cat.length) return callback(null, { success: false, msg: 'All Sub categories already exists' });
    var objectid = mongoose.Types.ObjectId;
    var slug = slugify(data.cat_name);
    var sub_category_data = [];
    if (data.type != "business" && data.type != "home")
        return callback(err, { success: true, msg: 'Please choose valid type' });
    // for (var i=0;i<sub_cat.length;i++){
    //     sub_category_data.push({
    //         sub_cat_name: sub_cat[i],
    //         slug: slugify(sub_cat[i])
    //     });
    // }
    sub_cat.forEach(function (item) {
        sub_category_data.push({
            sub_cat_name: item,
            slug: slugify(item)
        });
    });
    bizzCat.update({ '_id': objectid(data.cat_id) }, {
        $push:
            {
                'sub_category':
                    {
                        $each: sub_category_data,
                        $sort: 1
                    }
            },
        $set: {
            catname: data.cat_name,
            slug: slug,
            type: data.type
        }

    }, function (err, data) {
        return callback(err, { success: true, msg: 'Category has been updated successfully' });
    });
};
module.exports.deleteCategory = function (catid, callback) {
    var objectid = mongoose.Types.ObjectId;
    bizzCat.findByIdAndRemove({ '_id': objectid(catid) }, function (err, data) {
        return callback(err, { success: true, msg: 'Category has been deleted' });
    });
};
module.exports.deleteSubCategory = function (data, callback) {
    var objectid = mongoose.Types.ObjectId;
    bizzCat.update({ '_id': objectid(data.cat_id) }, { $pull: { "sub_category": { "_id": mongoose.Types.ObjectId(data.sub_cat_id) } } }, function (err, data) {
        if (data.nModified || data.n) return callback(err, { success: true, msg: "Successfully deleted" });
        else
            return callback(err, { success: false, msg: 'Cant delete sub category, try later' });
    });
};
