var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost/4770TeamProject';

var Post = require('../models/post');

router.get('/', function(req, res){
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
});

router.post('/post', function(req, res){
	var text = req.body.postField;
	var date = Post.getCurrentDate();
	var mongoDate = new Date();
	var image = 0;
	var userId = req.user.id;
	var author = req.user.name;
	var visibility = req.body.visibility;
	var friendsList;
	if (req.body.friendsList){
		friendsList = req.body.friendsList;
	}else{
		if (visibility == 3){
			friendsList = req.user.visibilityList;
		}else{
			friendsList = [];
		}
	}
	req.checkBody('postField', 'Post must not be empty').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index',{
			errors:errors, currentUser: req.user
		});
	} else {
		var newPost = new Post({
			userId: userId,
			author: author,
			text: text,
			date: date,
			mongoDate: mongoDate,
			image: image,
			visible: visibility,
			friendsList: friendsList
		});

		Post.createPost(newPost, function(err, post){
			if(err) throw err;
			console.log(post);
		});

		req.flash('success_msg', 'Post was posted.');

		res.redirect('/');
	}
});

router.post('/post/profile/:userId', function(req, res){
	var text = req.body.postField;
	var date = Post.getCurrentDate();
	var mongoDate = new Date();
	var image = 0;
	var userId = req.user.id;
	var author = req.user.name;
	var user;
	mongo.connect(url, function(err, db){
		var cursor = db.collection('users').find();
		cursor.forEach(function(doc, err){
			if (doc._id == req.params.userId){

				user = doc;

				req.checkBody('postField', 'Post must not be empty').notEmpty();

				var errors = req.validationErrors();

				if(errors){
					res.render('index',{
						errors:errors, currentUser: req.user
					});
				} else {
					var newPost = new Post({
						userId: userId,
						author: author,
						text: text,
						date: date,
						mongoDate: mongoDate,
						image: image,
						visible: 0,
						friendsList: [],
						userPage: req.params.userId
					});
					if (user.whoCanPost == 0){
						Post.createPost(newPost, function(err, post){
							if(err) throw err;
							console.log(post);
						});
						req.flash('success_msg', 'Post was posted.');
						res.redirect('/');
					}else if (user.whoCanPost == 1){
						var posted = false;
						var friendsList = user.friends;
						if (friendsList){
							for (var i=0; i<friendsList.length; i++){
								if (friendsList[i]._id == userId){
									Post.createPost(newPost, function(err, post){
										if(err) throw err;
										console.log(post);
									});
									posted = true;
									req.flash('success_msg', 'Post was posted.');
									res.redirect('/');
								}
							}
							if (!posted){
								req.flash('error_msg', 'Error: Post was not posted. You do not have permission to post on this page.');
								res.redirect('/');
							}
						}else{
							req.flash('error_msg', 'Error: Post was not posted. You do not have permission to post on this page.');
							res.redirect('/');
						}
					}else if (user.whoCanPost == 3){
						var posted = false;
						var whoCanPostList = user.whoCanPostList;
						if (whoCanPostList){
							for (var i=0; i<whoCanPostList.length; i++){
								if (whoCanPostList[i] == userId){
									Post.createPost(newPost, function(err, post){
										if(err) throw err;
										console.log(post);
									});
									posted = true;
									req.flash('success_msg', 'Post was posted.');
									res.redirect('/');
								}
							}
							if (!posted){
								req.flash('error_msg', 'Error: Post was not posted. You do not have permission to post on this page.');
								res.redirect('/');
							}
						}else{
							req.flash('error_msg', 'Error: Post was not posted. You do not have permission to post on this page.');
							res.redirect('/');
						}
					}else{
						req.flash('error_msg', 'Error: Post was not posted. You do not have permission to post on this page.');
						res.redirect('/');
					}
				}
			}
		});
		db.close();
	});
});

router.post('/post/group/:groupId', function(req, res){
	var text = req.body.postField;
	var date = Post.getCurrentDate();
	var mongoDate = new Date();
	var image = 0;
	var userId = req.user.id;
	var author = req.user.name;
	var group;
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').find();
		cursor.forEach(function(doc, err){
			if (doc._id == req.params.groupId){

				group = doc;

				req.checkBody('postField', 'Post must not be empty').notEmpty();

				var errors = req.validationErrors();

				if(errors){
					res.render('index',{
						errors:errors, currentUser: req.user
					});
				} else {
					var newPost = new Post({
						userId: userId,
						author: author,
						text: text,
						date: date,
						mongoDate: mongoDate,
						image: image,
						visible: 0,
						friendsList: [],
						groupPage: req.params.groupId
					});
					console.log("here.");
					var posted = false;
					var members = doc.members;
					for (var i=0; i<members.length; i++){
						console.log("here..");
						if (members[i] == userId){
							Post.createPost(newPost, function(err, post){
								if(err) throw err;
								console.log(post);
							});
						posted = true;
						req.flash('success_msg', 'Post was posted.');
						res.redirect('/');
						}
					}
					if (!posted){
						req.flash('error_msg', 'Error: Post was not posted. You do not have permission to post on this page.');
						res.redirect('/');
					}
				}
			}
		});
		db.close();
	});
});

router.get('/loadPosts', function(req, res, next) {
	var resultArray = [];
	var commentsArray = [];
	var users = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('posts').find().sort({mongoDate: -1});
		var cursorUsers = db.collection('users').find();
		cursorUsers.forEach(function(doc, err){
			console.log(doc.name);
			users.push(doc);
		}, function(){
		});
		cursor.forEach(function(doc, err){
			if (doc.userPage){
				//do nothing! If the post is meant for a user's page do not load it in the dashboard
			}else{
				if (doc.userId == req.user.id){
					resultArray.push(doc);
				}else{
					if (doc.visible == 0){
						resultArray.push(doc);
					}else if (doc.visible == 1 || doc.visible == 3){
						for (var i=0; i<users.length; i++){
							if (doc.userId == users[i]._id){
								var visible = doc.friendsList;
								var friends = users[i].friends;
								if (doc.visible == 1){
									for (var j=0; j<friends.length; j++){
										if (friends[j]._id == req.user.id){
											resultArray.push(doc);
										}
									}
								}else if (doc.visible == 3){
									console.log(visible.length);
									for (var j=0; j<visible.length; j++){
										console.log(visible[j]);
										console.log(req.user.id);
										if (visible[j] == req.user.id){
											resultArray.push(doc);
										}
									}
								}
							}
						}
					}
				}
			}
		});
		db.close();
	});
		mongo.connect(url, function(err, db){
			var cursorComments = db.collection('comments').find();
			cursorComments.forEach(function(doc, err){
				commentsArray.push(doc);
			}, function(){
				var allFriends;
				var acceptedFriends = [];
				var users = [];
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
							resultArray.sort();
							res.render('index', {comments: commentsArray, posts:resultArray, myID: req.user.id, currentUser: req.user, friends: acceptedFriends});
						}
					});
					db.close();
				});
			});
	//res.redirect('/');
});

router.get('/loadPosts/profile/:userId', function(req, res, next) {
	var resultArray = [];
	var commentsArray = [];
	var users = [];
	var isFriend = false;
	mongo.connect(url, function(err, db){
		var cursor = db.collection('posts').find().sort({mongoDate: -1});;
		var cursorComments = db.collection('comments').find();
		var cursorUsers = db.collection('users').find();
		cursor.forEach(function(doc, err){
			if (doc.userId == req.params.userId){
				resultArray.push(doc);
			}else if (doc.userPage == req.params.userId){
				resultArray.push(doc);
			}
		}, function(){
			//db.close();
			//res.render('index', {posts: resultArray});
		});

		cursorComments.forEach(function(doc, err){
			commentsArray.push(doc);
		}, function(){
			//db.close();
			//res.render('/profile/:userId', {comments: commentsArray, posts:resultArray, user: user, currentUser: req.user, friends: userFriends, friendRequests: userFriendRequests, users: users, isFriend: isFriend});
		});

		cursorUsers.forEach(function(doc, err){
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
					res.render('profile', {comments: commentsArray, posts:resultArray, user: doc, currentUser: req.user, friends: userFriends, friendRequests: userFriendRequests, users: users, isFriend: isFriend});

				}else{
					var userFriends = doc.friends;
					res.render('profile', {comments: commentsArray, posts:resultArray, user: doc, friends: userFriends, users: users});
				}
			}
		});
	});
	//res.redirect('/');
});

router.get('/loadPosts/group/:groupId', function(req, res, next) {
	var resultArray = [];
	var commentsArray = [];
	var users = [];
	var groups = [];
	var isMember = false;
	var hasRequested = false;
	mongo.connect(url, function(err, db){
		var cursor = db.collection('posts').find().sort({mongoDate: -1});;
		var cursorComments = db.collection('comments').find();
		var cursorGroups = db.collection('groups').find();
		var cursorUsers = db.collection('users').find();

		cursorUsers.forEach(function(doc, err){
			users.push(doc);
		});

		cursor.forEach(function(doc, err){
			if (doc.groupPage == req.params.groupId){
				resultArray.push(doc);
			}
		}, function(){
			//db.close();
			//res.render('index', {posts: resultArray});
		});

		cursorComments.forEach(function(doc, err){
			commentsArray.push(doc);
		}, function(){
			//db.close();
			//res.render('/profile/:userId', {comments: commentsArray, posts:resultArray, user: user, currentUser: req.user, friends: userFriends, friendRequests: userFriendRequests, users: users, isFriend: isFriend});
		});

		cursorGroups.forEach(function(doc, err){
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
					res.render('group', {comments: commentsArray, posts:resultArray, group: doc, currentUser: req.user, groups: groups, users: users, isMember: isMember, hasRequested: hasRequested, invites: req.user.invites, admin: doc.admin});
				}else{
					res.render('group', {comments: commentsArray, posts:resultArray, group: doc, groups: groups, users: users});
				}
			}
		});
	});
	//res.redirect('/');
});

router.post('/editPost', function(req, res){

	var newPostText = req.body.PostText;
	var currentDate = Post.getCurrentDate();
	req.checkBody('PostText', 'post text must not be empty').notEmpty();

	var errors = req.validationErrors();

  if(errors){
		res.render('index',{
			errors:errors, currentUser: req.user
		});
	}
	else {
		mongo.connect(url, function(err, db){
			var newComment = db.collection('posts').update(
	   { _id: objectId(req.body.postIdentif) },
		 {
	     $set:{
	       'text': newPostText,
	       'date': currentDate,
				 'mongoDate': new Date(),
	     }
		 }
	);
	db.close();
	req.flash('success_msg', 'post was edited.');
		 res.redirect('/');

		});

	}
});

router.post('/editVisibility/', function(req, res){
	var visibility = req.body.postVisibility;
	var newVisibility = Number(visibility);

	mongo.connect(url, function(err, db){
		var newComment = db.collection('posts').update(
	 { _id: objectId(req.body.postIdentif) },
	 {
		 $set:{
			 'visibility': newVisibility,
			 'date': currentDate,
			 'mongoDate': new Date(),
		 }
	 }
);
db.close();
req.flash('success_msg', 'post was edited.');
	 res.redirect('/');

	});

});

router.post('/deletePost/', function(req, res) {
		mongo.connect(url, function(err, db){
			var newComment = db.collection('posts').deleteOne(
	   { _id: objectId(req.body.postIdentif) });
	db.close();
	req.flash('success_msg', 'post was deleted.');
		 res.redirect('/');

		});
});

module.exports = router;
