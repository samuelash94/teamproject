var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost/4770TeamProject';
var schedule = require('../models/schedule');

router.get('/', function(req, res){
	res.render('schedule');
});

router.post('/create', function(req, res){
	var name = req.body.courseName;
	var slot = req.body.courseSlot;
	var userId = req.user.id;
	var mon = req.body.monday;
	var tues = req.body.tuesday;
	var wed = req.body.wednesday;
	var thurs = req.body.thursday;
	var fri = req.body.friday;
	var monTime = req.body.monTime;
	var tuesTime = req.body.tuesTime;
	var wedTime = req.body.wedTime;
	var thursTime = req.body.thursTime;
	var friTime = req.body.friTime;
	var daysTimes = [];
	if(typeof mon != 'undefined'){
		if(typeof monTime != 'undefined'){
			daysTimes.push(mon + " at " + monTime);
		}
		else{
			daysTimes.push(mon);
		}
	}
	if(typeof tues != 'undefined'){
		if(typeof tuesTime != 'undefined'){
			daysTimes.push(" " + tues + " at " + tuesTime);
		}
		else{
			daysTimes.push(" " + tues);
		}
	}
	if(typeof wed != 'undefined'){
		if(typeof wed != 'undefined'){
			daysTimes.push(" " + wed + " at " + wedTime);
		}
		else{
			daysTimes.push(" " + wed);
		}
	}
	if(typeof thurs != 'undefined'){
		if(typeof thursTime != 'undefined'){
			daysTimes.push(" " + thurs + " at " + thursTime);
		}
		else{
			daysTimes.push(" " + thurs);
		}
	}
	if(typeof fri != 'undefined'){
		if(typeof friTime != 'undefined'){
			daysTimes.push(" " + fri + " at " + friTime);
		}
		else{
			daysTimes.push(" " + fri);
		}
	}



	req.checkBody('courseName', 'Course name must not be empty').notEmpty();
	req.checkBody('courseSlot', 'Course slot must not be empty').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('schedule',{
			errors:errors
		});
	} else {
		var newSchedule = new schedule({
			name: name,
			daysTimes: daysTimes,
			sloy: slot,
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
		var cursor = db.collection('schedules').find({userId: req.user.id});
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('schedule', {schedule: resultArray});
		});
	});
	//res.redirect('/');
});

router.post('/deleteCourse/', function(req, res) {
		mongo.connect(url, function(err, db){
			var newCouse = db.collection('schedules').deleteOne(
	   { _id: objectId(req.body.schedId) });
	db.close();
	req.flash('success_msg', 'Course was deleted.');
		 res.redirect('/schedule');
		});
});

module.exports = router;
