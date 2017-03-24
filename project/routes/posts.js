var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost/4770TeamProject';

var Post = require('../models/post');

router.get('/', function(req, res){
	res.render('index', {currentUser: req.user});
});

router.post('/post', function(req, res){
	var text = req.body.postField;
	var date = Post.getCurrentDate();
	var image = 0;
	var userId = req.user.id;
	var author = req.user.name;
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
			image: image,
			visible: 0,
		});

		Post.createPost(newPost, function(err, post){
			if(err) throw err;
			console.log(post);
		});

		req.flash('success_msg', 'Post was posted.');

		res.redirect('/');
	}
});

router.get('/loadPosts', function(req, res, next) {
	var resultArray = [];
	var commentsArray = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('posts').find();
		var cursorComments = db.collection('comments').find();
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
		});

		cursorComments.forEach(function(doc, err){
			commentsArray.push(doc);
		}, function(){
			db.close();
			res.render('index', {comments: commentsArray, posts:resultArray, myID: req.user.id, currentUser: req.user});
		});

	});
	//res.redirect('/');
});

router.get('/loadPosts/:userId', function(req, res, next) {
	var resultArray = [];
	var commentsArray = [];
	var users = [];
	var isFriend = false;
	mongo.connect(url, function(err, db){
		var cursor = db.collection('posts').find({userId : req.params.userId});
		var cursorComments = db.collection('comments').find();
		var cursorUsers = db.collection('users').find();
		cursor.forEach(function(doc, err){
				resultArray.push(doc);
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

router.post('/editPost', function(req, res){

	var newPostText = req.body.PostText;
	var currentDate = Post.getCurrentDate();
	req.checkBody('PostText', 'post text must not be empty').notEmpty();
	console.log("ye");

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
		 }
	 }
);
db.close();
req.flash('success_msg', 'post was edited.');
	 res.redirect('/');

	});

});

module.exports = router;
