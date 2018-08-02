var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    address: [{
        nickname: { type: String },
        streetAddress: { type: String },
        streetAddress2: { type: String },
        state: { type: String },
        zip: { type: String }
    }],
    admin: Boolean,
    created_at: Date,
    updated_at: Date
});
var User = mongoose.model("User", userSchema);
//exporting validate
module.exports = User;
module.exports.validateEmailAccessibility = function(email){
    return User.findOne({email: email}).then(function(result){
         return result !== null;
    });
 }






















 // userSchema.pre('save', function (next) {
//     var currentDate = new Date();
//     this.updated_at = currentDate;
//     if (!this.created_at)
//         this.created_at = currentDate;
//         // User.find({email : user.name},
//     next();
// })



// User = function () {
//     this.createAndSave = function (req, res) {
//         new User({
//             username: req.body.username,
//             password: req.body.password,
//             email: req.body.email,
//             phone: req.body.phone,
//             address: [{
//                 nickname: req.body.nickname,
//                 streetAddress: req.body.streetAddress,
//                 streetAddress2: req.body.streetAddress2,
//                 state: req.body.state,
//                 zip: req.body.zip
//             }]
//         }).save(function (err, user) {
//             if (err) throw err;
//             req.session.isLoggedIn = true;
//             req.session.user = user.username;
//             res.redirect('/account/' + user.username);
//         })
//     }
//     this.updateRequest = function (req, res) {
//         User.update({ username: req.user.username }, {
//             username: req.body.username,
//             email: req.body.email,
//             phone: req.body.phone,
//             newsletter: req.body.newsletter,
//             address: [{
//                 nickname: req.body.nickname,
//                 streetAddress: req.body.streetAddress,
//                 streetAddress2: req.body.streetAddress2,
//                 state: req.body.state,
//                 zip: req.body.zip
//             }]
//         }, function (err) {
//             res.redirect("/account/" + req.body.username);
//         });
//     }
//     this.addAddress = function (req, res) 
//     {
//         var newAddress = 
//         {
//             nickname: req.body.nickname,
//             streetAddress: req.body.streetAddress,
//             streetAddress2: req.body.streetAddress2,
//             state: req.body.state,
//             zip: req.body.zip
//         }
//         User.update({username: req.session.user},
//             {$push: {address: newAddress}}, 
//             {upsert: true}, function (err) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log("successfully Added");
//                 }
//             })
//     }
// }
// The allowed SchemaTypes are:
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array



// userSchema.methods.dudify = function () {
//     this.name = this.name + '-dude';
//     return this.name;
// }

// function find_user_by_email(user,cb){
//     UserModel.find({name : user.name}, function (err, docs) {
//         if (docs.length){
//             cb('Name exists already',null);
//         }else{
//             user.save(function(err){
//                 cb(err,user);
//             });
//         }
//     });
// }