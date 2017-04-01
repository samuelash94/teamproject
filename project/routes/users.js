var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

var mailer = require('../mailer');

var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost/4770TeamProject';

var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var msopdf = require('node-msoffice-pdf');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Reset Password
router.post('/resetPassword', function(req, res){
	var password = req.body.password;

	req.checkBody('password', 'Password is required').notEmpty();
	var errors = req.validationErrors();

	if(errors){
		res.render('resetPassword',{
			errors:errors
		});
	} else {
		/* Not sure about the code here

		User.resetPassword(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		*/
		req.flash('success_msg', 'Your password is now reset');

		res.redirect('/users/login');
	}

});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var student_id = req.body.student_id;
	var gender = req.body.gender;
	var campus = req.body.campus;
	var invites = [];
	var postDefault = "0";
	var visibilityList = [];

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('student_id', 'Student number is required').notEmpty();
	req.checkBody('student_id', 'Student number must be an Integer').isInt();
	req.checkBody('student_id', 'Student number already in use').isStudentNumberUnique();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('email', 'Email must end in @mun.ca').endsWith('@mun.ca');
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password,
			student_id: student_id,
			gender: gender,
			campus: campus,
			invites: invites,
			postDefault: postDefault,
			visibilityList: visibilityList,
			whoCanPost: 0,
			whoCanPostList: []
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');

		mailer.sendInitialEmail(newUser.email, newUser.username);
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

router.get('/addFriend/:userId', function(req, res){
	User.addFriend(req.user.id, req.params.userId, function(err){
		if (err) throw err;
		else{
			req.flash('success_msg', 'Friend request sent.');
			res.redirect('/');
		}
	});
});

router.get('/goToUpload', function(req, res){
	res.render('upload', {currentUser:req.user});
});

router.post('/upload/profile', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

	var dir = __dirname + '/uploads/'+ req.user.id;
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
		fs.mkdirSync(dir + '/profile', 0744);
		fs.mkdirSync(dir + '/resume', 0744);
}
else{
	fs.readdir(dir + '/profile', (err, files) => {
  if (err) throw error;

  for (const file of files) {
    fs.unlink(path.join(dir + '/profile', file), err => {
      if (err) throw error;
    });
  }
});
}
form.uploadDir = path.join(__dirname, '/uploads/'+ req.user.id + '/profile');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
		var extension = file.name.split('.').pop();
		mongo.connect(url, function(err, db){
			var newComment = db.collection('users').update(
		 { _id: objectId(req.user.id) },
		 {
			 $set:{
				 'profExt': extension,
			 }
		 }
	);
	db.close();
		});
    fs.rename(file.path, path.join(form.uploadDir, req.user.id + '.' + extension));
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
		var newComment = db.collection('users').update(
	 { _id: objectId(req.user.id) },
	 {
		 $set:{
			 'hasProfile': true,
		 }
	 }
);
db.close();
	});

});

router.post('/upload/resume', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

	var dir = __dirname + '/uploads/'+ req.user.id;
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
		fs.mkdirSync(dir + '/profile', 0744);
		fs.mkdirSync(dir + '/resume', 0744);
}

else{
	fs.readdir(dir + '/resume', (err, files) => {
  if (err) throw error;

  for (const file of files) {
    fs.unlink(path.join(dir + '/resume', file), err => {
      if (err) throw error;
    });
  }
});
}
form.uploadDir = path.join(__dirname, '/uploads/'+ req.user.id + '/resume');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
		var extension = file.name.split('.').pop();
		mongo.connect(url, function(err, db){
			var newComment = db.collection('users').update(
		 { _id: objectId(req.user.id) },
		 {
			 $set:{
				 'resExt': extension,
			 }
		 }
	);
	db.close();
		});
    fs.rename(file.path, path.join(form.uploadDir, req.user.id + '.' + extension));
		if(extension == 'docx' || extension == 'doc'){
			msopdf(null, function(error, office) {
				office.word({input: __dirname +  '/uploads/'+ req.user.id + '/resume/' + req.user.id + '.' + extension, output: __dirname +  '/uploads/'+ req.user.id + '/resume/' + req.user.id + '.pdf'}, function(error, pdf) {
      if (error) {
           console.log("Woops", error);
       }
   });
	 office.close(null, function(error) {
	        if (error) {
	            console.log("Woops", error);
	        }
	    });
 });
	}
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
		var newComment = db.collection('users').update(
	 { _id: objectId(req.user.id) },
	 {
		 $set:{
			 'hasResume': true,
		 }
	 }
);
db.close();
	});

});


router.get('/acceptFriend/:userId', function(req, res){
	User.addFriend(req.user.id, req.params.userId, function(err){
		if (err) throw err;
		else{
			req.flash('success_msg', 'Friend request accepted.');
			res.redirect('/');
		}
	});

});

router.post('/setDefaultVisibility/:userId', function(req, res){
	mongo.connect(url, function(err, db){
		var cursor = db.collection('users').update(
		{ _id: objectId(req.params.userId) },
		{ $set:{ visibilityList: [] }});
		var cursor2 = db.collection('users').update(
	 	{ _id: objectId(req.params.userId) },
	 	{
		 	$set:{
			 	'postDefault': req.body.visibility
		 	}
	 	});
		req.flash('success_msg', 'Default post visibility updated.');
		res.redirect('/');
		db.close();
	});
});

router.post('/visibilityList/:userId', function(req, res){
	mongo.connect(url, function(err, db){
		var cursor = db.collection('users').update(
		{ _id: objectId(req.params.userId) },
		{ $set:{ visibilityList: [] }});
		var friendsToAdd = req.body.friendsList;
		if (Array.isArray(friendsToAdd)){
			friendsToAdd.forEach(function(doc, err){
				console.log(doc);
				var cursor2 = db.collection('users').update(
			 	{ _id: objectId(req.params.userId) },
			 	{ $addToSet:{ visibilityList: doc }});
			});
			req.flash('success_msg', 'List of friends who can view your posts updated.');
			res.redirect('/');
			db.close();
		}else{
			console.log(friendsToAdd);
			var cursor3 = db.collection('users').update(
			{ _id: objectId(req.params.userId) },
			{ $addToSet:{ visibilityList: friendsToAdd }});
			req.flash('success_msg', 'List of friends who can view your posts updated.');
			res.redirect('/');
			db.close();
		}
	});
});

router.post('/setWhoCanPost/:userId', function(req, res){
	mongo.connect(url, function(err, db){
		var cursor = db.collection('users').update(
		{ _id: objectId(req.params.userId) },
		{ $set:{ whoCanPostList: [] }});
		var cursor2 = db.collection('users').update(
	 	{ _id: objectId(req.params.userId) },
	 	{
		 	$set:{
			 	'whoCanPost': req.body.posters
		 	}
	 	});
		req.flash('success_msg', 'Who can post on your profile updated.');
		res.redirect('/');
		db.close();
	});
});

router.post('/whoCanPostList/:userId', function(req, res){
	mongo.connect(url, function(err, db){
		var cursor = db.collection('users').update(
		{ _id: objectId(req.params.userId) },
		{ $set:{ whoCanPostList: [] }});
		var friendsToAdd = req.body.friendsList;
		if (Array.isArray(friendsToAdd)){
			friendsToAdd.forEach(function(doc, err){
				console.log(doc);
				var cursor2 = db.collection('users').update(
			 	{ _id: objectId(req.params.userId) },
			 	{ $addToSet:{ whoCanPostList: doc }});
			});
			req.flash('success_msg', 'List of friends who can post on your profile updated.');
			res.redirect('/');
			db.close();
		}else{
			console.log(friendsToAdd);
			var cursor3 = db.collection('users').update(
			{ _id: objectId(req.params.userId) },
			{ $addToSet:{ whoCanPostList: friendsToAdd }});
			req.flash('success_msg', 'List of friends who can post on your profile updated.');
			res.redirect('/');
			db.close();
		}
	});
});

module.exports = router;
