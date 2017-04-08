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
	if(req.user.isAuthenticated == false){
		req.flash('error_msg', 'You have not authenticated via email yet.');
		res.redirect('/users/login');
	}

	else{
	var allFriends;
	var acceptedFriends = [];
	var users = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('users').find();
		cursor.forEach(function(doc, err){
			users.push(doc);
			if (doc._id == req.user.id){
				allFriends = doc.friends;
				allFriends.forEach(function(doc, err){
					if (doc.status == "accepted"){
						acceptedFriends.push(doc);
					}
				});
				res.render('index', {currentUser: req.user, friends: acceptedFriends, users: users});
			}
		});
		db.close();
	});
}
});

router.get('/profile/:userId', function(req, res, next){
	if(!req.user){
		res.redirect('/users/login');
	}
	else {

	mongo.connect(url, function(err, db){
		var cursor2 = db.collection('groups').find();
		var groups = [];
		cursor2.forEach(function(doc, err){
			groups.push(doc);
		});
		var cursor3 = db.collection('schedules').find({userId: req.params.userId});

		var schedule = [];
		cursor3.forEach(function(doc, err){
			schedule.push(doc);
		});
		var cursor = db.collection('users').find();
		var cursorUsers = db.collection('users').find();
		var cursorSchedules = db.collection('schedules').find();
		var cursorSchedules2 = [];
		var cursorSchedules3 = [];
		cursorSchedules.forEach(function(doc, err){
			cursorSchedules2.push(doc);
			cursorSchedules3.push(doc);
		});
		var users = [];
		var mutualFriends = [];
		var mutualGroups = [];
		var mutualCourses = [];
		var mutualTwo = [];
		var mutualThree = [];
		var isFriend = false;
		cursorUsers.forEach(function(doc, err){
			users.push(doc);
		});
		cursor.forEach(function(doc, err){
			if (err) throw err;
			if (doc._id == req.params.userId){
				if (req.user){
					var allFriends = doc.friends;
					var userFriends = [];
					var userFriendRequests = [];
					var userGroups = [];
					var tenSuggestedFriends = [];
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
						userFriends.forEach(function(doc2, err){
							var doc3;
							for (var i=0; i<users.length; i++){
								if (users[i]._id.equals(doc2._id)){
									doc2 = users[i];
								}
							}
							if (doc2.friends){
								var otherFriends = doc2.friends;
								for (var i=0; i<otherFriends.length; i++){
									if (otherFriends[i].status == "accepted"){
										var toAdd = true;
										for (var j=0; j<doc.friends.length; j++){
											if (doc.friends[j]._id.equals(otherFriends[i]._id)){
												toAdd = false;
											}else if (otherFriends[i]._id.equals(doc._id)){
												toAdd = false;
											}
										}
										if (toAdd){
											for (var j=0; j<users.length; j++){
												if (users[j]._id.equals(otherFriends[i]._id)){
													mutualFriends.push(users[j]);
												}
											}
										}
									}
								}
							}
						});
						groups.forEach(function(doc2, err){
							for (var i=0; i<doc2.members.length; i++){
								if (doc2.members[i] == doc._id){
									for (var j=0; j<doc2.members.length; j++){
										var toAdd = true;
										if (doc2.members[i] != doc2.members[j]){
											for (var k=0; k<doc.friends.length; k++){
												if (doc2.members[j] == doc.friends[k]._id){
													toAdd = false;
												}
											}
											if (toAdd){
												if (doc2.members[j] != doc._id){
													for (var k=0; k<users.length; k++){
														if (users[k]._id == doc2.members[j]){
															mutualGroups.push(users[k]);
														}
													}
												}
											}
										}
									}
								}
							}
						});
						cursorSchedules2.forEach(function(doc2, err){
							if (doc2.userId == doc._id){
								for (var i=0; i<cursorSchedules3.length; i++){
									var toAdd = true;
									if (doc2.name == cursorSchedules3[i].name){
										if (cursorSchedules3[i].userId == doc._id){
											toAdd = false;
										}else{
											for (var j=0; j<doc.friends.length; j++){
												if (cursorSchedules3[i].userId == doc.friends[j]._id){
													toAdd = false;
												}
											}
										}
									}
									if (toAdd){
										for (var j=0; j<users.length; j++){
											if (users[j]._id == cursorSchedules3[i].userId){
												mutualCourses.push(users[j]);
											}
										}
									}
								}
							}
						});
						for (var i=0; i<mutualFriends.length; i++){
							for (var j=0; j<mutualGroups.length; j++){
								for (var k=0; k<mutualCourses.length; k++){
									var three = false;
									if (mutualFriends[i]._id.equals(mutualGroups[j]._id) && mutualFriends[i]._id.equals(mutualCourses[k]._id)){
										mutualThree.push(mutualFriends[i]);
										three = true;
									}else if (mutualGroups[j]._id.equals(mutualCourses[k]._id)){
										mutualTwo.push(mutualGroups[j]);
									}
								}
								if (!three){
									if (mutualFriends[i] && mutualGroups[j]){
										if (mutualFriends[i]._id.equals(mutualGroups[j]._id)){
											mutualTwo.push(mutualFriends[i]);
										}
									}
								}
							}
							for (var j=0; j<mutualCourses.length; j++){
								if (mutualFriends[i] && mutualCourses[j]){
									if (mutualFriends[i]._id.equals(mutualCourses[j]._id)){
										mutualTwo.push(mutualFriends[i]);
									}
								}
							}
						}
						//splicing
						for (var i=0; i<mutualTwo.length; i++){
							for (var j=0; j<mutualFriends.length; j++){
								if (mutualTwo[i]._id.equals(mutualFriends[j]._id)){
									mutualFriends.splice(j, 1);
									j--;
								}
							}
							for (var j=0; j<mutualGroups.length; j++){
								if (mutualTwo[i]._id.equals(mutualGroups[j]._id)){
									mutualGroups.splice(j, 1);
									j--;
								}
							}
							for (var j=0; j<mutualCourses.length; j++){
								if (mutualTwo[i]._id.equals(mutualCourses[j]._id)){
									mutualCourses.splice(j, 1);
									j--;
								}
							}
						}
						for (var i=0; i<mutualThree.length; i++){
							for (var j=0; j<mutualFriends.length; j++){
								if (mutualThree[i]._id.equals(mutualFriends[j]._id)){
									mutualFriends.splice(j, 1);
									j--;
								}
							}
							for (var j=0; j<mutualGroups.length; j++){
								if (mutualThree[i]._id.equals(mutualGroups[j]._id)){
									mutualGroups.splice(j, 1);
									j--;
								}
							}
							for (var j=0; j<mutualCourses.length; j++){
								if (mutualThree[i]._id.equals(mutualCourses[j]._id)){
									mutualCourses.splice(j, 1);
									j--;
								}
							}
							for (var j=0; j<mutualTwo.length; j++){
								if (mutualThree[i]._id.equals(mutualTwo[j]._id)){
									mutualTwo.splice(j, 1);
									j--;
								}
							}
						}

						for (var i=0; i<10; i++){
							if (mutualThree[i]){
								tenSuggestedFriends.push(mutualThree[i]);
							}
						}
						if (tenSuggestedFriends.length < 10){
							for (var i=0; i<10-tenSuggestedFriends.length; i++){
								if (mutualTwo[i]){
									tenSuggestedFriends.push(mutualTwo[i]);
								}
							}
						}
						if (tenSuggestedFriends.length < 10){
							for (var i=0; i<10-tenSuggestedFriends.length; i++){
								if (mutualFriends[i]){
									tenSuggestedFriends.push(mutualFriends[i]);
								}
							}
						}
						if (tenSuggestedFriends.length < 10){
							for (var i=0; i<10-tenSuggestedFriends.length; i++){
								if (mutualCourses[i]){
									tenSuggestedFriends.push(mutualCourses[i]);
								}
							}
						}
						if (tenSuggestedFriends.length < 10){
							for (var i=0; i<10-tenSuggestedFriends.length; i++){
								if (mutualGroups[i]){
									tenSuggestedFriends.push(mutualGroups[i]);
								}
							}
						}

						console.log(mutualFriends);
						console.log(mutualGroups);
						console.log(mutualCourses);
						console.log(mutualTwo);
						console.log(mutualThree);
						console.log(tenSuggestedFriends);
						//for (var i=0; i<10; i++){
							//if (suggestedFriends[i]){
								//tenSuggestedFriends.push(suggestedFriends[i]);
							//}
						//}
					}
					res.render('profile', {user: doc, currentUser: req.user, friends: userFriends, friendRequests: userFriendRequests, users: users, isFriend: isFriend, groupInvites: doc.invites, groups: groups, schedule: schedule, suggestedFriends: tenSuggestedFriends});

				}else{
					var userFriends = doc.friends;
					res.render('profile', {user: doc, friends: userFriends, users: users});
				}
			}
		});
		db.close();
	});
}
});

router.get('/profileSettings/:userId', function(req, res, next){
	if(!req.user){
		res.redirect('/users/login');
	}
	else {

	mongo.connect(url, function(err, db){
		var cursor2 = db.collection('groups').find();
		var groups = [];
		cursor2.forEach(function(doc, err){
			groups.push(doc);
		});
		var cursor = db.collection('users').find();
		var users = [];
		cursor.forEach(function(doc, err){
			users.push(doc);
			if (err) throw err;
				if (doc._id == req.params.userId){
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
					});
				}
				res.render('profileSettings', {user: doc, currentUser: req.user, friends: userFriends, friendRequests: userFriendRequests, users: users, groupInvites: doc.invites, groups: groups, postDefault: doc.postDefault, whoCanPost: doc.whoCanPost});
			}
		});
		//if (db.collection('users').find({_id : req.params.userId}) > 0){
			//res.render('profile', {output: req.params.userId});
		//}
	});
}
});

router.post('/search', function(req, res){
	var search = req.body.searchBar;
	var resultArray = [];
	var groupArray = [];
	if(search){
		var regex = new RegExp(["^", search, "$"].join(""), "i");
		mongo.connect(url, function(err, db){
			var cursor = db.collection('users').find({name: regex});
			cursor.forEach(function(doc, err){
				resultArray.push(doc);
			}, function(){
				db.close();
			});
		});

		mongo.connect(url, function(err, db){
			var cursorGroups = db.collection('groups').find({name: regex});
			cursorGroups.forEach(function(doc, err){
				groupArray.push(doc);
			}, function(){
				db.close();
				res.render('searchResults', {userResults: resultArray, groupResults: groupArray});
			});
		});
	}
	else {
		mongo.connect(url, function(err, db){
			var cursor = db.collection('users').find();
			cursor.forEach(function(doc, err){
				resultArray.push(doc);
			}, function(){
				db.close();
			});
		});

		mongo.connect(url, function(err, db){
			var cursorGroups = db.collection('groups').find();
			cursorGroups.forEach(function(doc, err){
				groupArray.push(doc);
			}, function(){
				db.close();
				res.render('searchResults', {userResults: resultArray, groupResults: groupArray});
			});
		});
	}

});

router.get('/group/:groupId', function(req, res, next){
	if(!req.user){
		res.redirect('/users/login');
	}
	else {

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
	});
}
});

router.get('/groupSettings/:groupId', function(req, res, next){
	if(!req.user){
		res.redirect('/users/login');
	}
	else {

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
				var e = [];	//members who aren't the owner
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
					if (a[i] == doc.ownerId){
						a.splice(i, 1);
					}
						for (var j=0; j<b.length; j++){
							if (b[j] == doc.ownerId){
								b.splice(j, 1);
							}
							if (a[i] == b[j]){
								b.splice(j, 1);
							}
						}
				}
				for (var i=0; i<d.length; i++){
					for (var j=0; j<c.length; j++){
						if (d[i] == c[j]._id){
							c.splice(j, 1);
						}
					}
				}
				a.forEach(function(doc2, err){
					e.push(doc2);
				});
				b.forEach(function(doc2, err){
					e.push(doc2);
				});

				res.render('groupSettings', {group: doc, currentUser: req.user, users: users, nonAdmin: b, nonMemberFriends: c, adminNotOwner: a, membersNotOwner: e});
			}
		});
		db.close();
	});
}
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
