var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost/4770TeamProject';
var poll = require('../models/poll');

router.get('/', function(req, res){
	res.render('poll', {currentUser: req.user});
});

router.post('/create', function(req, res){
	var name = req.body.pollName;
	var userId = req.user.id;
	var ratings = [];

	req.checkBody('pollName', 'Course name must not be empty').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('poll',{
			errors:errors, currentUser: req.user
		});
	} else {
		var newPoll = new poll({
			userId: userId,
			name: name
		});

		poll.createPoll(newPoll, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'Poll created successfully.');

		res.redirect('/poll');
	}
});
router.post('/vote', function(req, res){
	var vote = req.body.vote;
	console.log(vote);

	if(typeof vote != 'undefined'){
		var pollId = req.body.pollId;
		mongo.connect(url, function(err, db){
			var cursor = db.collection("polls").update(
   			{ _id: objectId(pollId)},
   			{ "$push":
					{
					 "ratings": vote
				 }
			 }
		 );
		 db.close();
		 req.flash('success_msg', 'Vote was added successfully');
		 res.redirect('/');
		});
//		mongo.connect(url, function(err, db){
//			var cursor = db.collection("polls").find(
//   			{ _id: objectId(pollId), average},
//			)
//		});
	}

});


router.get('/loadPolls', function(req, res, next) {
	var resultArray = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('polls').find();
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('poll', {poll: resultArray, currentUser: req.user});
		});
	});
	//res.redirect('/');
});

module.exports = router;
