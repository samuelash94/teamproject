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
		var cursor2 = db.collection('groups').find();
		var groups = [];
		cursor2.forEach(function(doc, err){
			groups.push(doc);
		});
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
					res.render('profile', {user: doc, currentUser: req.user, friends: userFriends, friendRequests: userFriendRequests, users: users, isFriend: isFriend, groupInvites: doc.invites, groups: groups});

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
		var hasRequested = false;
		cursor2.forEach(function(doc, err){
			users.push(doc);
		});
		cursor.forEach(function(doc, err){
			groups.push(doc);
			if (err) throw err;
			if (doc._id == req.params.groupId){
				if (req.user){
					var members = doc.members;
					var requests = doc.requests;
					members.forEach(function(doc2,err){
						if (doc2 == req.user.id){
							isMember = true;
						}
					});
					if (requests){
						requests.forEach(function(doc2,err){
							if (doc2 == req.user.id){
								hasRequested = true;
							}
						});
					}
					res.render('group', {group: doc, currentUser: req.user, groups: groups, users: users, isMember: isMember, hasRequested: hasRequested, invites: req.user.invites, admin: doc.admin});
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

router.get('/groupSettings/:groupId', function(req, res, next){
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').find();
		var cursor2 = db.collection('users').find();
		var users = [];
		var friends;
		cursor2.forEach(function(doc, err){
			users.push(doc);
			if (doc._id == req.user.id){
				friends = doc.friends;
			}
		});
		cursor.forEach(function(doc, err){
			if (doc._id == req.params.groupId && req.user){
				var a = doc.admin;		//admin who aren't the owner
				var b = doc.members;	//members who aren't admin
				var c = friends;			//friends who aren't members
				var d = doc.invites;	//anybody invited to group
				var e = doc.members;	//members who aren't the owner
				for (var i=0; i<b.length; i++){
					if (b[i]){
						for (var j=0; j<c.length; j++){
							if (c[j]){
								if (b[i] == c[j]._id){
									c.splice(j, 1);
								}
							}
						}
					}
				}
				for (var i=0; i<a.length; i++){
					if (a[i]){
						if (a[i] == doc.ownerId){
							a.splice(i, 1);
						}
						for (var j=0; j<b.length; j++){
							if (b[j]){
								if (b[j] == doc.ownerId){
									b.splice(j, 1);
								}
								if (a[i] == b[j]){
									b.splice(j, 1);
								}
							}
						}
					}
				}
				for (var i=0; i<d.length; i++){
					if (d[i]){
						for (var j=0; j<c.length; j++){
							if (d[i] == c[j]._id){
								c.splice(j, 1);
							}
						}
					}
				}
				for (var i=0; i<e.length; i++){
					if (e[i]){
						if (e[i] == doc.ownerId){
							e.splice(i, 1);
						}
					}
				}

				res.render('groupSettings', {group: doc, currentUser: req.user, users: users, nonAdmin: b, nonMemberFriends: c, adminNotOwner: a, membersNotOwner: e});
			}
		});
		db.close();
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
