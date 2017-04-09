var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://sraa61@excalibur.cs.mun.ca/teamproject/project/projectdb';

var poll = require('../models/poll');

router.get('/', function(req, res){
	if(!req.user){
		res.redirect('/users/login');
	}
	else {
	res.render('poll', {currentUser: req.user});
}
});

router.post('/create', function(req, res){
	if(!req.user){
		res.redirect('/users/login');
	}
	else {

	var name = req.body.pollName;
	var userId = req.user.id;
	var author = req.user.name;
	var ratings = [];


	if(name == ''){
		req.flash('error_msg', 'You must select a course name.');
		res.redirect('/poll');
	}
	else{
		var errors = req.validationErrors();

		if(errors){
			res.render('poll',{
				errors:errors, currentUser: req.user
			});
		} else {
			var newPoll = new poll({
				userId: userId,
				name: name,
				author : author
			});

			poll.createPoll(newPoll, function(err, user){
				if(err) throw err;
				console.log(user);
			});

			req.flash('success_msg', 'Poll created successfully.');

			res.redirect('/poll');
		}
	}
}
});
router.post('/vote', function(req, res){
	if(!req.user){
		res.redirect('/users/login');
	}
	else {

	var vote = req.body.vote;
	if(typeof vote == 'undefined'){
		req.flash('error_msg', 'Select a rating to vote.');
		res.redirect('/poll');
	}
	else{
		var pollId = req.body.pollId;
		var pollName = req.body.pollName;
		var registered = false;
		//console.log(pollName);
		var schedule = [];
		mongo.connect(url, function(err, db){
			var cursor2 = db.collection('schedules').find();
			cursor2.forEach(function(doc, err){

			if(doc.userId == req.user.id){
				if(doc.name == pollName){
					registered = true;
				}
			}
			},function(){
				if(registered){
					var cursor = db.collection('polls').update(	{ _id: objectId(pollId)},	{ "$push":	{"ratings": vote}	});
					req.flash('success_msg', 'Vote was added successfully');
					res.redirect('/poll/loadPolls');
					db.close();
				}
				else{
					req.flash('error_msg', 'You must be registered for the course to vote.');
					res.redirect('/poll/loadPolls');
					db.close();
				}
			});
		});
	}
}
});



router.get('/loadPolls', function(req, res, next) {
	if(!req.user){
		res.redirect('/users/login');
	}
	else {

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
}
});

router.post('/deletePoll/:pollId', function(req, res){
	if(!req.user){
		res.redirect('/users/login');
	}
	else {

	var pollId = req.params.pollId;
	mongo.connect(url, function(err, db){
		db.collection('polls').deleteOne({_id: objectId(pollId)});
		db.close();
		req.flash('success_msg', 'poll was deleted.');
		res.redirect('/poll/loadPolls');
	});
}
});

module.exports = router;
