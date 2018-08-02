var User = require('../models/usersModel');
exports.index = function (req, res) {
    if (req.session.username) {
        return res.redirect('/dashboard');
    } else {
        res.render('login', {
            data: {},
            title : "Adecity",
            errors: {}
        });
    }
};
exports.login = function (req, res) {
    var user_detail = {
        email: req.body.email,
        password: req.body.password
    }
    User.findOne({ email: req.body.email, password: req.body.password }, function (err, loggedin_user) {
        if (err) throw err;
        if (loggedin_user) {
            console.log(loggedin_user);
            req.session.isLoggedIn = true;
            req.session.username = loggedin_user.username;
            console.log(req.session);
            return res.redirect('/dashboard');
        }
        else {
            errors['email']['msg'] = "This account does not exist";
            res.render('login', {
                data: user_detail,
                title : "Adecity",
                errors: errors
            });
        }
    });
};
exports.register = function (req, res) {
    console.log(req.session);
    if (req.session.username) {
        return res.redirect('/dashboard');
    } else {
        res.render('register', {
            data: {},
            errors: {}
        });
    }
};


exports.createUser = function (req, res, next) {
    var user_detail = {
        email: req.body.email,
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    }
    var errors = {};
    if (user_detail.name == '') {
        errors['name_msg'] = "Name can not be empty.";
    }
    if (user_detail.username == '') {
        errors['username_msg'] = "User Name can not be empty.";
    }
    if (user_detail.password == '') {
        errors['password_msg'] = "Password can not be empty.";
    } else if (user_detail.password.length < 5) {
        errors['password_msg'] = "Password Length should not be less than 7 character";
    }
    if (Object.keys(errors).length === 0) {
        var user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            name: req.body.name,
            admin: true,
            address: [{
                nickname: req.body.nickname,
                streetAddress: req.body.streetAddress,
                streetAddress2: req.body.streetAddress2,
                state: req.body.state,
                zip: req.body.zip
            }]
        });
        User.findOne({ email: req.body.email }, function (err, prev_user) {
            if (err) throw err;
            if (prev_user) {
                console.log(prev_user);
                errors['password_msg'] = "This Email Address Already Exists.";
                res.render('register', {
                    data: user_detail,
                    errors: errors
                });
            }
            else {
                user.save(function (err, user) {
                    if (err) throw err;
                    // req.session.isLoggedIn = true;
                    // req.session.user = user.username;
                    return res.redirect('/login');
                });
            }
        });
    } else {
        res.render('register', {
            data: user_detail,
            errors: errors
        });
    }
};