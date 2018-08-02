app.get('/api', function (req, res, next) {
    // res.json({
    //     "hello": "world",
    //     "bike": "twister"
    // });
    var doc = new jsPDF()
      doc.text('Hello world!', 10, 10)
doc.save('a4.pdf')
});
var Schema = mongoose.Schema;
var testSchema = new Schema({
    testvalue: Number,
});
var Test = mongoose.model("Test", testSchema);
app.get('/save-array', function (req, res) {
    var myArray = [1, 2, 3, 4];
    async.each(myArray, function (value, next) {
        console.log('Processing Value ' + value);
        var Testobj = new Test({
            testvalue: value,
        });
        Testobj.save(function (error) {
            console.log("Your value has been saved!");
            next();
        });
    }, function (err) {
        res.json({
            "hello": "world",
            "bike": "twister"
        });
    });
});


// Load HTTP module
var http = require("http");

// Create HTTP server and listen on port 8000 for requests
http.createServer(function (request, response) {

    // Set the response HTTP header with HTTP status and Content type
    response.writeHead(200, { 'Content-Type': 'text/plain' });

    // Send the response body "Hello World"
    response.end('Hello World\n');
}).listen(8000);

// Print URL for accessing server
console.log('Server running at http://127.0.0.1:8000/');

 /*
    jsreport.render('<h1>Hi there!</h1>').then(function (out) {
        out.result.pipe(resp);
    });
    jsreport.render({ template: { content: 'Hello world', engine: 'jsrender', recipe: 'phantom-pdf' } }).then(function (out) {
        out.stream.pipe(res);
    }).catch(function (e) {
        res.end(e.message);
    });
    */
    /*    Jsreport using api
    var data = {
        template : {'shortid': 'HJH11D83ce'},
        options : {
            preview:true
        },
        data : {
            "books" :[{
                name:'dsvs',
                author : 'bsbfbsf'
            },
            {
                name: 'fsbfbfds',
                author :'fdbdfb'
            }]
        }
    }
    var options= {
        json : data,
        method : 'POST',
        uri : 'http://localhost:8001/api/report',
        scripts: {
            "allowedModules" : ["http"]
        }
    }
    request(options).pipe(res);
    */


    /* HTML PDF 
    var pdf = require('html-pdf');
    var fs = require('fs');
    var html = fs.readFileSync('./test/businesscard.html', 'utf8');
    var options = { format: 'Letter' };
    pdf.create(html, options).toFile('./businesscard.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });
    res.json({
        "hello": "world",
        "bike": "twister"
    });
    */
   

// app.post('/login', function (req, res) {
//     var user_detail = {
//         email: req.body.email,
//         password: req.body.password
//     }
//     var errors = {};
//     if (user_detail.email.length == '') {
//         errors['email'] = {};
//         errors['email']['msg'] = "Email Is Required.";
//     } else {
//         var email_array = user_detail.email.split('@');
//         console.log(email_array);
//         if (email_array.length == 2) {
//             var email_array2 = email_array[1].split('.');
//             if (email_array.length != 2 && email_array2.length != 2 && email_array[0].length == 0 && email_array2[0].length == 0 && (email_array2[1].length < 2 || email_array2[1].llength > 4)) {
//                 errors['email'] = {};
//                 errors['email']['msg'] = "Please Enter a valid Email Address";
//             }
//         } else {
//             errors['email'] = {};
//             errors['email']['msg'] = "Please Enter a valid Email Address";
//         }
//     }
//     if (user_detail.password.length < 7) {
//         errors['password'] = {};
//         errors['password']['msg'] = "Password length should be greater than 7 char.";
//     }
//     res.render('login', {
//         data: user_detail,
//         errors: errors
//     });
// });

app.listen("92", function () {
    console.log("server running");
});
// app.post('/form',
// form(
//     field("email").trim().required().is(/^[a-z]+$/),
//     field("password").trim().required().is(/^[0-9]+$/),
//     field("email").trim().required().isEmail()
// ),
// function(req,res){
//     if(!req.form.isValid) {
//         console.log(req.form.errors());
//     } else {
//         console.log("Email: ", req.form.email);
//         console.log("Password:", req.form.password);
//         console.log("EMAIL:", req.form.email);
//     }
// }
// )
var arr = [1,2,3,3,2,1,5];
var newobj={};
arr.forEach(function(ite) { 
if(newobj[ite]) {
    newobj[ite]++;
} else {
newobj[ite]=1;
}
})
// console.log(newobj);
// var ob={};
// ob.name='megha';
// ob.add={};
// ob.add.a1='hello';
// ob.add.a2='hello';
// console.log(ob);
// user.validateEmailAccessibility(req.body.email).then(function(valid) {
    //     if (valid) {
    //         user.save(function (err, user) {
    //             if (err) throw err;
    //             req.session.isLoggedIn = true;
    //             req.session.user = user.username;
    //             //res.redirect('/account/' + user.username);
    //         });
    //     } else {
    //       alert("Email already used");
    //     }
    //   });
    // user.find({'email': req.body.email}, function (err, user) {
    //     if (err) return handleError(err);
    //     console.log(user);
    //     if (user) {
    //         console.log(user);
    //         return next(new Error('Record Already Exist.'));
    //     }
    //     else {
    //         user.save(function (err, user) {
    //             if (err) throw err;
    //             req.session.isLoggedIn = true;
    //             req.session.user = user.username;
    //             res.redirect('/account/' + user.username);
    //         });
    //     }
    // })








    // app.get('/mongo-testing',function(req,res){
//     var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/mydb";
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });
// });









// app.get('/mongo-testing', function (req, res) {
//     var MongoClient = require('mongodb').MongoClient;
//     var URL = "mongodb://localhost:27017/mydb";
//     MongoClient.connect(URL, function (err, db) {
//         if (err) throw err;
//         var collection = db.collection('tbl_admin');
//         collection.insert({ name: 'taco', tasty: true }, function (err, result) {
//             collection.find({ name: 'taco' }).toArray(function (err, docs) {
//                 console.log(docs[0])
//                 db.close()
//             })
//         })
//     })
// });




// var chris=new User ({
//     name: 'Sumit',
//     username : 'sumit12690',
//     password : 'password'
// });
// chris.dudify(function(err,name){
//     if(err) throw err;
//     console.log('your new name is '+ name);
// });
// chris.save(function(err){
//     if(err) throw err;
//     console.log('User Saved Successfully');
// });
// User.find({},function(err,users){
//     if(err) throw err;
//     console.log(users);
// });
// User.find({username:'sumit12690'},function(err,user) {
//     if(err) throw err;
//     console.log(user);
// })
// // User.findById(1, function(err,user) {
// //     if(err) throw err;
// //     console.log(user);
// // });
// User.validateEmailAccessibility(req.body.email).then(function(valid) {
    //     if (valid) {
    //         user.save(function (err, user) {
    //             if (err) throw err;
    //             req.session.isLoggedIn = true;
    //             req.session.user = user.username;
    //             //res.redirect('/account/' + user.username);
    //         });
    //     } else {
    //       alert("Email already used");
    //     }
    //   });
    // user.save(function (err, user) {
    //     if (err) throw err;
    //     req.session.isLoggedIn = true;
    //     req.session.user = user.username;
    //     //res.redirect('/account/' + user.username);
    // });

    // user.find({'email': req.body.email}, function (err, user) {
    //     if (err) return handleError(err);
    //     console.log(user);
    //     if (user) {
    //         console.log(user);
    //         return next(new Error('Record Already Exist.'));
    //     }
    //     else {
    //         user.save(function (err, user) {
    //             if (err) throw err;
    //             req.session.isLoggedIn = true;
    //             req.session.user = user.username;
    //             res.redirect('/account/' + user.username);
    //         });
    //     }
    // })


//     var Schema = mongoose.Schema;
//     var testSchema = new Schema({
//         testvalue: Number,
//     });
//     var Test = mongoose.model("Test", testSchema);
// app.get('/save-array', function (req, res) {
//     var myArray = ['1', '2', '3', '4'];
//     myArray.forEach(function (value) {
//         var Testobj = new Test({
//             testvalue: value,
//         });
//         Testobj.save(function (error) {
//             console.log("Your value has been saved!");
//             if (error) {
//                 console.error(error);
//             }
//         });
//     });
//     return res.redirect('/login');
// });