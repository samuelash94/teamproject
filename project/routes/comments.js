var express = require('express');
var router = express.Router();

var Post = require('../models/post');
var User = require('../models/user');
var comment = require('../models/comment');

var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost/4770TeamProject';

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

router.post('/addComment/', function(req, res){
	var postIdentif = req.body.postIdentif;
  var commentText = req.body.commentTextField;
  var date = comment.getCurrentDate();
	var mongoDate = new Date();
  req.checkBody('commentTextField', 'comment text must not be empty').notEmpty();

	var errors = req.validationErrors();

  if(errors){
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
	} else {
		var newComment = new comment({
      postId: postIdentif,
      userId: req.user.id,
			text: commentText,
			date: date,
			mongoDate: mongoDate,
			author: req.user.name,
			isEdited: false
		});

    comment.addComment(newComment, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'comment was added.');
    res.redirect("/");
  }

});


router.post('/editComment/', function(req, res){

	if(req.body.userIdentif != req.user.id){
		req.flash('error', 'You are not the author of this comment');
		res.redirect('/');
	}

	else{
		var newCommentText = req.body.commentText;
		var currentDate = comment.getCurrentDate();
		req.checkBody('commentText', 'comment text must not be empty').notEmpty();

		var errors = req.validationErrors();

	  if(errors){
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
		else {
			mongo.connect(url, function(err, db){
				var oldComment = db.collection('comments').findOne({_id : objectId(req.body.commentIdentif)});
	    		db.collection('oldComments').insert(oldComment);
				var newComment = db.collection('comments').update(
		   { _id: objectId(req.body.commentIdentif) },
			 {
		     $set:{
		       'text': newCommentText,
		       'date': currentDate,
					 'mongoDate': new Date(),
					 'isEdited': true,
		     }
			 }
		);
		db.close();
		req.flash('success_msg', 'comment was edited.');
			 res.redirect('/');
			});
		}
	}
});




router.post('/deleteComment/', function(req, res) {
	if(req.body.userIdentif != req.user.id){
		req.flash('error', 'You are not the author of this comment');
		res.redirect('/');
	}
	else{
		mongo.connect(url, function(err, db){
			var newComment = db.collection('comments').deleteOne(
	   { _id: objectId(req.body.commentIdentif) });
	db.close();
	req.flash('success_msg', 'comment was deleted.');
		 res.redirect('/');

		});
	}

});



module.exports = router;
