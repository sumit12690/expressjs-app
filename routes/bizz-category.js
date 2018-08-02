const express = require('express');
const router = express.Router();
//const auth_superadmin = require('../middleware/auth');
const con_category = require('../controller/con-bizz_category');
router.get('/', (req, res) => {
    con_category.allCatList((err, result) => {
        if (err) {
            throw err;
        }
        return res.render('category-list', {
            result: result,
            title: "Adecity Business Category",
            role: req.session.role,
            username: req.session.username,
        });
    });
});
router.get('/search-category/:keyword', (req, res) => {
    var keyword = req.params.keyword;
    con_category.getCatBySearch(keyword,(err, data,result) => {
        if (err) {
            throw err;
        }
        res.json(data.concat(result));
    });
});
router.post('/add-category', (req, res) => {
    var cat_name = req.body.cat_name;
    var sub_cat_name = req.body.sub_cat_name;
    var type = req.body.type;
    if (!cat_name) return res.redirect('/bizz-category/?updated=false&msg=Enter Category Name');
    if (!type) return res.redirect('/bizz-category/?updated=false&msg=Please choose category type');
    if (type != "business" && type != "home") return res.redirect('/bizz-category/?updated=false&msg=Please choose valid category type');
    con_category.addCategory(cat_name, sub_cat_name, type, (err, result) => {
        if (err) {
            throw err;
        }
        if (result.success)
            return res.redirect('/bizz-category/?updated=true&msg=Success Added');
        else
            return res.redirect('/bizz-category/?updated=false&msg=' + result.msg);
    });
});
router.post('/update-category', (req, res) => {
    var catid = req.body.cat_id;
    var catname = req.body.cat_name;
    var sub_category = req.body.sub_cat;
    if (!catid || !catname) return res.json({ success: false, msg: 'Some Fields are missing' });
    con_category.subCatList(catid, (err, result) => {
        if (err) {
            throw err;
        }
        var old_sub_cat = result.sub_category; // city's existing localities
        var updated_sub_cat = removeDuplicateSubCate(old_sub_cat, sub_category);
        con_category.updateCategory(req.body, updated_sub_cat, (err, result) => {
            if (err) {
                throw err;
            }
            return res.json(result);
        });
    });
});
router.get('/delete-category/:catid', (req, res) => {
    var catid = req.params.catid;
    con_category.deleteCategory(catid, (err, result) => {
        if (err) {
            throw err;
        }
        if (result.success)
            return res.redirect('/bizz-category/?delete=true&msg=Success Deleted');
        else
            return res.redirect('/bizz-category/?delete=true&msg=Error in deletion');
    });
});
router.post('/delete-sub-category', (req, res) => {
    con_category.deleteSubCategory(req.body, (err, result) => {
        if (err) {
            throw err;
        }
        return res.json(result);
    });
});
//get sub cat
router.post('/get-sub-category', (req, res) => {
    var catid = req.body.id;
    if (!catid) 
    return res.json({ success: false, msg: 'Category id not available' });
    con_category.subCatList(catid, (err, result) => {
        if (err) {
            throw err;
        }
        return res.json(result);
    });
});
function removeDuplicateSubCate(old_sub_cat, sub_category) {
    for (var i = 0; i < old_sub_cat.length; i++) {
        for (j = 0; j < sub_category.length; j++) {
            if (old_sub_cat[i].sub_cat_name == sub_category[j]) {
                var index = sub_category.indexOf(sub_category[j]);
                if (index > -1) {
                    sub_category.splice(index, 1);
                }
            }
        }
    }
    return sub_category;
}
module.exports = router;