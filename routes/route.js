/* jshint esversion:6 */
var express = require('express');
var router = express.Router();
var auth_dataAdmin = require('../middleware/auth_dataadmin');
var moment = require('moment');
var conDb = require('../controller/con-dbs');
/*-------------------------------CONTACT DB ROUTES--------------------------------------------------------------*/

//show all sms dbs
router.all('/all-dbs', auth_dataAdmin, function (req, res, next) {
	//pagination lgao jbtime mile
	let dbId = req.body.dbId || req.query.dbId;
	let pageno = parseInt(req.body.pageno || 1 );
	let querry = {};
	if (dbId) {
		querry._id = dbId;
	}
	conDb.getDbname((err, reslt)=> {
		if (err) throw err;
		let db = reslt;
		if (db.length) {
			conDb.dbData(querry,pageno, (err, dbdata,totalPages)=> {
				if (err=='invalidPageNO') {
					return res.redirect('/content/all-dbs');
				}
				return res.render('all-dbs', {
					db: db,
					currentdb: req.body.dbName || req.query.dbname,
					currentID: dbId,
					dbdata: dbdata,
					city:dbdata[0].city,
					totalPages:totalPages,
					currentPage:pageno,
					title: "All Databases",
					role: req.session.role,
					username: req.session.username
				});
			})
		}
	});
});

router.all('/add-db', auth_dataAdmin, function (req, res, next) {
    let type = req.body.type||'add';
    let DBid=req.body.DBid;
	let dbName=req.body.dbName;
	let city=req.body.city;
    let showTextBox=false; // hide text box at the time of update numbers
    if(type=='add'){
        showTextBox=true;
    }
    return res.render('add-db', {
        title: "Add database",
        role: req.session.role,
        showTextBox:showTextBox,
        type:type,
        DBid:DBid,
		dbName:dbName,
		city:city,
        username: req.session.username
    });
});

router.post('/save-db', auth_dataAdmin, function (req, res, next) {
    var dbName, dbId, numbers,city ;
	var query = {} ;
	var type = req.body.saveType;
	console.log(req.body);
    if(req.body.saveType=="update"){
       query.dbId=req.body.DBid;
	    query.contactno=req.body.numbers;
    }else{
		query.dbname = req.body.dbName;
		query.city = req.body.city;
        query.contactno = req.body.numbers ;
	}
	console.log(query)
    conDb.addOrUpdateDatabase(type,query,(err,result)=>{
	    if(err=='exist') {
		    return res.json({
			    success:false,
			    msg:"Database "+query.dbname+" is already exists"
		    });
	    }
		if(result=='success' && type =='add') {
			return res.json({
				success:true,
				msg:query.dbname+' saved successfully'
			})
		}else{
			return res.json({
				success:true,
				dbName:dbName,
				dbId:dbId,
				msg:"Numbers succesfully saved to "+req.body.dbName
			});
		}
    });
});

router.post('/edit-name', auth_dataAdmin, function (req, res, next) {
	let id = req.body.id;
	let dbname = req.body.dbname;
	let city = req.body.city;
	
	conDb.dbNameChange(id, dbname, city, (err, reslt)=> {
		if (err == 'exist') {
			return res.json({
				success: false,
				msg: dbname + " already exist"
			});
		}
		return res.json({
			success: true,
			msg: "Name succesfully updated to " + dbname
		});
	});
});

router.post('/edit-number', auth_dataAdmin, function (req, res, next) {
	let dbId = req.body.id;
	let oldNumber = req.body.oldnumber;
	let newNumber = req.body.newnumber;
	conDb.editNumber(dbId, oldNumber, newNumber, (err, reslt)=> {
		if (err == 'exist') {
			return res.redirect('/content/all-dbs?updated=false&msg=Number already exist in this database');
		} else {
			return res.redirect('/content/all-dbs?updated=true&msg=Number succesfully updated&dbId=' + dbId + '&dbname=' + reslt.dbname);
		}
	});
});

router.post('/delete-number',auth_dataAdmin, function (req,res, next) {
	let dbId = req.body.DBid ;
	let number = req.body.number ;
	if(dbId && number){
		conDb.deleteNumber(dbId,number,(err,docs)=>{
			if(err) throw err ;
			return res.redirect('/content/all-dbs?delete=true&msg=Number successfully deleted');
		})
	}else{
		return res.redirect('/content/all-dbs?delete=false&msg=Something is missing');
	}
});

router.post('/delete-db',auth_dataAdmin, function (req,res,next) {
	let dbId = req.body.DBid ;
	let dbname = req.body.dbname ;
	if(dbId){
		conDb.deleteDB(dbId,(err,reslt)=>{
			if(err) throw err ;
			return res.redirect('/content/all-dbs?delete=true&msg='+dbname+' successfully deleted');
		})
	}else{
		return res.redirect('/content/all-dbs?delete=false&msg=Something is missing');
	}
});
module.exports = router;