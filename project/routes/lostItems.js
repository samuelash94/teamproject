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

router.post('/postItem', function(req, res){
	var description = req.body.itemDesc;
	var lostRegion = req.body.region;
	var address = req.body.Address;
	var posterId = req.user.id;
	var poster = req.user.name;

	req.checkBody('itemDesc', 'Item description must not be empty').notEmpty();
	req.checkBody('Address', 'Item Address must not be empty').notEmpty();
	req.checkBody('region', 'Region found must not be empty').notEmpty();

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
			hasImage: false
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

module.exports = router;
