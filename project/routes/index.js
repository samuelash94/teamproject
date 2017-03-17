var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost/4770TeamProject';

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index', {currentUser: req.user});
});

router.get('/profile/:userId', function(req, res, next){
	mongo.connect(url, function(err, db){
		var cursor = db.collection('users').find({ "_id": objectId(req.params.userId) });
		var users = [];
		cursor.forEach(function(doc, err){
			users.push(doc);
			if (err) throw err;
			if (doc._id == req.params.userId){
				if (req.user){
					var currentUserId = req.user.id;
					var userFriends = doc.friends;
					var friendIds = [];
					var friendRequestIds = [];
					userFriends.forEach(function (idk, err){
						if (idk.status == "accepted"){
							friendIds.push(idk._id + "");
						}else if (idk.status == "pending"){
							friendRequestIds.push(idk._id + "");
						}
					});
					res.render('profile', {user: doc, currentUser: req.user, currentUserId:currentUserId, friendIds: friendIds, friendRequestIds: friendRequestIds, users: users});
				}else{
					var userFriends = doc.friends;
					var friendIds = [];
					userFriends.forEach(function (idk, err){
						if (idk.status == "accepted"){
							console.log(idk._id);
							friendIds.push(idk._id + "");
						}
					});
					res.render('profile', {user: doc, friendIds: friendIds, users: users});
				}
			}
		});
		//if (db.collection('users').find({_id : req.params.userId}) > 0){
			//res.render('profile', {output: req.params.userId});
		//}
	});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
