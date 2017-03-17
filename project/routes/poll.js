var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');

var url = 'mongodb://localhost/4770TeamProject';

var poll = require('../models/poll');

router.get('/', function(req, res){
	res.render('poll');
});

router.post('/create', function(req, res){
	var name = req.body.pollName;
	var userId = req.user.id;

	req.checkBody('pollName', 'Course name must not be empty').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('poll',{
			errors:errors
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

router.get('/loadPolls', function(req, res, next) {
	var resultArray = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('poll').find();
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('poll', {poll: resultArray});
		});
	});
	//res.redirect('/');
});

module.exports = router;
