var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');

var url = 'mongodb://localhost/4770TeamProject';
var schedule = require('../models/schedule');

router.get('/', function(req, res){
	res.render('schedule');
});

router.post('/create', function(req, res){
	var name = req.body.courseName;
	var days = req.body.courseDays;
	var slot = req.body.courseSlot;
	var time = req.body.courseTime;
	var userId = req.user.id;

	req.checkBody('courseName', 'Course name must not be empty').notEmpty();
	req.checkBody('courseDays', 'Course days must not be empty').notEmpty();
	req.checkBody('courseSlot', 'Course slot must not be empty').notEmpty();
	req.checkBody('courseTime', 'Course time must not be empty').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('schedule',{
			errors:errors
		});
	} else {
		var newSchedule = new schedule({
			name: name,
			days: days,
			sloy: slot,
			time: time,
			userId : userId
		});

		schedule.createSchedule(newSchedule, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'Course has been added to you schedule.');

		res.redirect('/schedule');
	}
});

router.get('/loadCourses', function(req, res, next) {
	var resultArray = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('schedule').find();
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('schedule', {schedule: resultArray});
		});
	});
	//res.redirect('/');
});

module.exports = router;
