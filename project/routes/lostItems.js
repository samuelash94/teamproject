var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var lostItem = require('../models/lostItem');

var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost/4770TeamProject';

router.get('/', function(req, res){
	res.render('lostandfound', {currentUser: req.user});
});

router.get("/uploadItemImage/:itemId", function(req, res){
	var itemId = req.params.itemId;
	var resultArray = [];
	mongo.connect(url, function(err, db){
		var lostItem = db.collection('lostitems').find({_id: objectId(itemId)});
		lostItem.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('uploadLostPhoto', {lostItem: resultArray[0], currentUser: req.user});
		});
	});
});

router.post('/postItem', function(req, res){
	var description = req.body.itemDesc;
	var lostRegion = req.body.region;
	var address = req.body.Address;
	var posterId = req.user.id;
	var poster = req.user.name;
	var phoneNumber = req.body.phoneNumber;
	var posterEmail = req.user.email;

	req.checkBody('itemDesc', 'Item description must not be empty').notEmpty();
	req.checkBody('Address', 'Item Address must not be empty').notEmpty();
	req.checkBody('region', 'Region found must not be empty').notEmpty();
	req.checkBody('phoneNumber', 'Phone Number must not be empty').notEmpty();
	req.checkBody('phoneNumber', 'Phone Number must be an integer').isInt();

	var errors = req.validationErrors();

	if(errors){
		res.render('lostandfound',{
			errors:errors, currentUser: req.user
		});
	} else {

		var location = address + " " + lostRegion;
		var newItem = new lostItem({
			description: description,
			location: location,
			posterId: posterId,
			poster: poster,
			posterEmail: posterEmail,
			hasImage: false,
			phoneNumber: phoneNumber,
			claimed: false
		});

		lostItem.postNewItem(newItem, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'Item successfully added to lost and found.');

		res.render('uploadLostPhoto', {lostItem: newItem});
	}
});

router.post('/upload/:itemId', function(req, res){
	var itemId = req.params.itemId;

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

	var dir = __dirname + '/uploads/lostItems/'+ itemId;
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
}
else{
	fs.readdir(dir, (err, files) => {
  if (err) throw error;

  for (const file of files) {
    fs.unlink(path.join(dir, file), err => {
      if (err) throw error;
    });
  }
});
}
form.uploadDir = path.join(__dirname, '/uploads/lostItems/'+ itemId);

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
		var extension = file.name.split('.').pop();
		mongo.connect(url, function(err, db){
			var newComment = db.collection('lostitems').update(
		 { _id: objectId(itemId) },
		 {
			 $set:{
				 'extension': extension,
			 }
		 }
	);
	db.close();
		});
    fs.rename(file.path, path.join(form.uploadDir, itemId + '.' + extension));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

	mongo.connect(url, function(err, db){
		var newComment = db.collection('lostitems').update(
	 { _id: objectId(itemId) },
	 {
		 $set:{
			 'hasImage': true,
		 }
	 }
);
db.close();
	});

});

router.get('/viewItems', function(req, res, next) {
	var resultArray = [];
	var res2 = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('lostitems').find({ posterId: { "$in" : [req.user.id]} });
		var notCursor = db.collection('lostitems').find({ posterId: { "$nin" : [req.user.id]} });

		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		});

		notCursor.forEach(function(doc, err){
			res2.push(doc);
		}, function(){
			db.close();
			res.render('lostItemsIndex', {myItems: resultArray, notMyItems:res2, currentUser: req.user});
		});
	});
});

router.post('/deleteItem/:itemId', function(req, res){
	var itemId = req.params.itemId;
	mongo.connect(url, function(err, db){
		db.collection('lostitems').deleteOne(
	 { _id: objectId(itemId) });
db.close();
	});
	var dir = __dirname + '/uploads/lostItems/'+ itemId;


	var list = fs.readdirSync(dir);
    for(var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);

        if(filename == "." || filename == "..") {
            // pass these files
        } else if(stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
req.flash('success_msg', 'The item was deleted.');
	 res.redirect('/lostItems/viewItems');

});

router.post('/claimItem/:itemId', function(req, res){
	var itemId = req.params.itemId;
	var posterId = req.body.posterId;
	var found = false;
	var users = [];
	var phone = req.body.phoneNumber;
	var posterEmail = req.body.email;
	mongo.connect(url, function(err, db){
		db.collection('lostitems').update(
	 { _id: objectId(itemId) },
	 {
		 $set:{
			 'claimed': true,
			 'claimedBy': req.user.name,
			 'claimerId': req.user.id,
			 'claimerEmail': req.user.email,
		 }
	 }
);
db.close();
});

mongo.connect(url, function(err, db){
	var finder = db.collection('users').find({ _id: objectId(posterId) });
	finder.forEach(function(doc, err){
		users.push(doc);
	},function(){
			var friends = users[0].friends;
			for (var j=0; j<friends.length; j++){
				if (friends[j]._id == req.user.id){
					found = true;
					break;
				}
		}

		if(found == true){
				db.close();
				req.flash('success_msg', 'You have successfully claimed the item. The phone number is: ' + phone);
		}
		else{
			req.flash('success_msg', 'You have successfully claimed the item. The email is: ' + posterEmail);
		}
		db.close();
			 res.redirect('/lostItems/viewItems');

	});
});

});

router.post('/unclaimItem/:itemId', function(req, res){
	var itemId = req.params.itemId;
	mongo.connect(url, function(err, db){
		db.collection('lostitems').update(
	 { _id: objectId(itemId) },
	 {
		 $set:{
			 'claimed': false,
		 }
	 }
);
db.close();
req.flash('success_msg', 'You have set the item back to unclaimed');
res.redirect('/lostItems/viewItems');
	});
});

module.exports = router;
