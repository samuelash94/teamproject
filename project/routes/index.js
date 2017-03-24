var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var friends = require("mongoose-friends");

var url = 'mongodb://localhost/4770TeamProject';

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index', {currentUser: req.user});
});

router.get('/profile/:userId', function(req, res, next){
	mongo.connect(url, function(err, db){
		var cursor = db.collection('users').find();
		var users = [];
		var isFriend = false;
		cursor.forEach(function(doc, err){
			users.push(doc);
			if (err) throw err;
			if (doc._id == req.params.userId){
				if (req.user){
					var allFriends = doc.friends;
					var userFriends = [];
					var userFriendRequests = [];
					if (allFriends){
						allFriends.forEach(function(doc2, err){
							if (doc2.status == "accepted"){
								userFriends.push(doc2);
							}else if (doc2.status == "pending"){
								userFriendRequests.push(doc2);
							}
							if (doc2._id == req.user.id){
								isFriend = true;
							}
						});
					}
					res.render('profile', {user: doc, currentUser: req.user, friends: userFriends, friendRequests: userFriendRequests, users: users, isFriend: isFriend});

				}else{
					var userFriends = doc.friends;
					res.render('profile', {user: doc, friends: userFriends, users: users});
				}
			}
		});
		//if (db.collection('users').find({_id : req.params.userId}) > 0){
			//res.render('profile', {output: req.params.userId});
		//}
	});
});

router.post('/search', function(req, res){
	var search = req.body.searchBar;
	var regex = new RegExp(["^", search, "$"].join(""), "i");
	var resultArray = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('users').find({name: regex});
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
		});
		db.close();
	 	res.render('searchResults', {userResults: resultArray});
	});
});

router.get('/group/:groupId', function(req, res, next){
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').find();
		var cursor2 = db.collection('users').find();
		var groups = [];
		var users = [];
		var isMember = false;
		cursor2.forEach(function(doc, err){
			users.push(doc);
		});
		cursor.forEach(function(doc, err){
			groups.push(doc);
			if (err) throw err;
			if (doc._id == req.params.groupId){
				if (req.user){
					var members = doc.members;
					members.forEach(function(doc2,err){
						if (doc2 == req.user.id){
							isMember = true;
						}
					});
					res.render('group', {group: doc, currentUser: req.user, groups: groups, users: users, isMember: isMember});
				}else{
					res.render('group', {group: doc, groups: groups, users: users});
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
