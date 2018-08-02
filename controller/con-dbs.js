
const db = require('../models/models/contactDb');

module.exports.getDbname = function (callback) {
	db.find({},{'_id':1,'dbname':1},(err,doc)=>{
		if(err) throw err ;
		return callback(null,doc);
	})
};

module.exports.dbData = function (query,pageno,callback) {
	db.find(query,(eror,doc)=>{
		if(eror) throw eror ;
		let totalPages ;
		let totContacts = doc[0].contactno.length ;
		if(totContacts%10==0){
			totalPages = totContacts/10;
		}else{
			totalPages = Math.ceil(totContacts/10) ;
		}
		if(pageno<1 || pageno>totalPages){
			return callback('invalidPageNO') ;
		}
		if(pageno>1){
			db.find(query,{'contactno':{$slice:[(pageno-1)*10,10]}},(err,docs)=>{
				if(err) throw err ;
				return callback(null,docs,totalPages);
			}).limit(1);
		}else{
			db.find(query,{'contactno':{$slice:[0,10]}},(err,docs)=>{
				if(err) throw err ;
				return callback(null,docs,totalPages);
			}).limit(1);

		}
	});
};

module.exports.dbNameChange = function (id,name,city,callback) {
	db.find({dbname:name},(eror,doc)=>{
		if(eror) throw eror ;
		if(doc.length<=0){
			db.findOneAndUpdate({'_id':id},{'dbname':name,'city':city},(err,docs)=>{
				if(err) throw err ;
				return callback(null,docs) ;
			})
		}else{
			return callback('exist',name);
		}
	});
};

module.exports.editNumber = function (dbId,oldNumber,newNumber,callback) {
	db.find({'_id':dbId,'contactno':newNumber},(eror,doc)=>{
		if(eror) throw eror ;
		if(doc.length<=0){
			db.findOneAndUpdate({'_id':dbId,'contactno':oldNumber},
				{$set: {'contactno.$':newNumber}},{upsert:true,new:true},
				(err,docs)=>{
					if(err) throw err ;
					return callback(null,docs) ;
				})
		}else{
			return callback('exist',newNumber);
		}
	});
};

module.exports.deleteNumber = function (dbId,number,callback) {
	db.update({'_id':dbId},{$pull: {'contactno':number}},{multi:true},(err,docs)=>{
		if(err) throw err ;
		return callback(null,docs);
	})
};

module.exports.addOrUpdateDatabase = function (type,query,callback) {
	if(type=='update'){
		db.findOneAndUpdate({'_id':query.dbId},
			{$addToSet:{contactno: {$each:query.contactno}}},
			{upsert:true,new:true},(err,reslt)=>{
			return callback(null,reslt);
		});
	}
	if(type=='add'){
		db.find({'dbname':query.dbname},(err,reslts)=>{
			if(err) throw err ;
			if(reslts.length>0){
				return callback('exist',reslts);
			}
			else{
				let newDb = new db(query) ;
				newDb.save((err)=>{
					if(err) throw err ;
					return callback(null,'success');
				});
			}
		});
	}
};

module.exports.deleteDB = function (dbId,callback) {
	db.remove({'_id':dbId},(err,docs)=>{
		if(err) throw err ;
		return callback(null,docs);
	});
};