var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost/4770TeamProject';
var schedule = require('../models/schedule');

router.get('/', function(req, res){
	res.render('schedule', {currentUser: req.user});
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
	var daysTimes = [];

	if(typeof mon != 'undefined'){
		var monTime = "Monday at ";
		var monStartHour = req.body.mondayStartHour;
		monTime += monStartHour + ":";
		var monStartMin = req.body.mondayStartMinutes;
		monTime += monStartMin + " ";
		var monStartAP = req.body.mondayStartAMPM;
		monTime += monStartAP + " - ";
		var monEndHour = req.body.mondayEndHour;
		monTime += monEndHour + ":";
		var monEndMin = req.body.mondayEndMinutes;
		monTime += monEndMin + " ";
		var monEndAP = req.body.mondayEndAMPM;
		monTime += monEndAP;
		//daysTimes.push(monTime);
	}

	if(typeof tues != 'undefined'){
		var tuesTime = "Tuesday at ";
		var tuesStartHour = req.body.tuesdayStartHour;
		tuesTime += tuesStartHour + ":";
		var tuesStartMin = req.body.tuesdayStartMinutes;
		tuesTime += tuesStartMin + " ";
		var tuesStartAP = req.body.tuesdayStartAMPM;
		tuesTime += tuesStartAP + " - ";
		var tuesEndHour = req.body.tuesdayEndHour;
		tuesTime += tuesEndHour + ":";
		var tuesEndMin = req.body.tuesdayEndMinutes;
		tuesTime += tuesEndMin + " ";
		var tuesEndAP = req.body.tuesdayEndAMPM;
		tuesTime += tuesEndAP;
		//daysTimes.push(tuesTime);
	}

	if(typeof wed != 'undefined'){
		var wedTime = "Wednesday at ";
		var wedStartHour = req.body.wednesdayStartHour;
		wedTime += wedStartHour + ":";
		var wedStartMin = req.body.wednesdayStartMinutes;
		wedTime += wedStartMin + " ";
		var wedStartAP = req.body.wednesdayStartAMPM;
		wedTime += wedStartAP + " - ";
		var wedEndHour = req.body.wednesdayEndHour;
		wedTime += wedEndHour + ":";
		var wedEndMin = req.body.wednesdayEndMinutes;
		wedTime += wedEndMin + " ";
		var wedEndAP = req.body.wednesdayEndAMPM;
		wedTime += wedEndAP;
		//daysTimes.push(wedTime);
	}
	if(typeof thurs != 'undefined'){
		var thursTime = "Thursday at ";
		var thursStartHour = req.body.thursdayStartHour;
		thursTime += thursStartHour + ":";
		var thursStartMin = req.body.thursdayStartMinutes;
		thursTime += thursStartMin + " ";
		var thursStartAP = req.body.thursdayStartAMPM;
		thursTime += thursStartAP + " - ";
		var thursEndHour = req.body.thursdayEndHour;
		thursTime += thursEndHour + ":";
		var thursEndMin = req.body.thursdayEndMinutes;
		thursTime += thursEndMin + " ";
		var thursEndAP = req.body.thursdayEndAMPM;
		thursTime += thursEndAP;
		//daysTimes.push(thursTime);
	}
	if(typeof fri != 'undefined'){
		var friTime = "Friday at ";
		var friStartHour = req.body.fridayStartHour;
		friTime += friStartHour + ":";
		var friStartMin = req.body.fridayStartMinutes;
		friTime += friStartMin + " ";
		var friStartAP = req.body.fridayStartAMPM;
		friTime += friStartAP + " - ";
		var friEndHour = req.body.fridayEndHour;
		friTime += friEndHour + ":";
		var friEndMin = req.body.fridayEndMinutes;
		friTime += friEndMin + " ";
		var friEndAP = req.body.fridayEndAMPM;
		friTime += friEndAP;
		//daysTimes.push(friTime);
	}

	req.checkBody('courseName', 'Course name must not be empty').notEmpty();
	req.checkBody('courseSlot', 'Course slot must not be empty').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('schedule',{
			errors:errors, currentUser: req.user
		});
	} else {
		var newSchedule = new schedule({
			name: name,
			//daysTimes: daysTimes,
			monday: monTime,
			tuesday: tuesTime,
			wednesday: wedTime,
			thursday: thursTime,
			friday: friTime,
			slot: slot,
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
			res.render('schedule', {schedule: resultArray, currentUser: req.user});
		});
	});
	//res.redirect('/');
});

router.post('/deleteCourse/', function(req, res) {
	mongo.connect(url, function(err, db){
		var newComment = db.collection('schedules').deleteOne(
	 	{ _id: objectId(req.body.schedId) });
		db.close();
	req.flash('success_msg', 'course was deleted.');
	 res.redirect('/schedule');

	});
});

module.exports = router;
