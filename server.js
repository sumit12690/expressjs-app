var express = require('express');

const multer = require('multer');
const multerupload = multer({ dest: 'uploads/' })
var bodyParser = require('body-parser');
var path = require("path");
var app = express();
var cors = require('cors')
var mongoose = require('mongoose');
var async = require('async');
var session = require('express-session');
var usersRoute = require('./routes/usersRoute');
var doorstepMedia = require('./routes/doorstep-media');
var vendor = require('./routes/vendors');
var category = require('./routes/bizz-category');
var vendorsRoute = require('./routes/vendorsRoute');
var condb = require('./routes/route');
app.use(cors());
app.get('/fileupload', (req, res) => {
    res.render('fileupload');
});

app.post('/fileupload', multerupload.single('file-to-upload'), (req, res) => {
    res.redirect('/');
});
// app.use('/',function(req,res,next) {
//     req.session.role='Superadmin';
//     req.session.username='Sumit Mangal';
//     next();
// });
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true, }));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', usersRoute);
app.use('/doorstep-media', doorstepMedia);
app.use('/vendor', vendor);
app.use('/vendors', vendor);
app.use('/api/vendor', vendorsRoute);
app.use('/bizz-category', category);
app.use('/content', condb)
app.use(express.static(path.join(__dirname, 'public')));
var Schema = mongoose.Schema;
var testSchema = new Schema({
    testvalue: Number,
});
var Test = mongoose.model("Test", testSchema);
app.get('/save-array', function (req, res) {
    var myArray = ['1', '2', '3', '4'];
    // myArray.forEach(function (value) {
    //     var Testobj = new Test({
    //         testvalue: value,
    //     });
    //     Testobj.save(function (error) {
    //         console.log("Your value has been saved!"+value);
    //         if (error) {
    //             console.error(error);
    //         }
    //     });
    // });
    async.eachSeries(myArray, function (value, callback) {
        var Testobj = new Test({
            testvalue: value,
        });
        Testobj.save(function (error) {
            console.log("Your value has been saved!" + value);
            if (error) {
                console.error(error);
            }
            callback();
        });
    });
});
app.get('/', function (req, res) {
    return res.redirect('/dashboard');
});
app.listen("92", function () {
    console.log("server running");
});
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/express1';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));