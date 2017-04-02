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
	var error = false;

	if(name == ''){
		req.flash('error_msg', 'You must select a course name.');
		res.redirect('/schedule');
	}

	else{
		if(slot == ''){
			req.flash('error_msg', 'You must select a slot.');
			res.redirect('/schedule');
		}
		else{
			if(typeof mon == 'undefined' && typeof tues == 'undefined' && typeof wed == 'undefined' && typeof thurs == 'undefined' && typeof fri == 'undefined'){
				req.flash('error_msg', 'You must select at least one day.');
				res.redirect('/schedule');
			}
			else{
				if(typeof mon != 'undefined'){
					//if(req.body.mondayStartHour == '' || req.body.mondayStartMinutes == '' || req.body.mondayStartAMPM == '' || req.body.mondayEndHour == '' || req.body.mondayEndMinutes == '' || req.body.mondayEndAMPM == '')
					var monTime = "Monday at " + req.body.mondayStartHour + ": "
																		+ req.body.mondayStartMinutes + " "
																		+ req.body.mondayStartAMPM + " - "
																		+ req.body.mondayEndHour + ":"
																		+ req.body.mondayEndMinutes + " "
																		+ req.body.mondayEndAMPM;
				}

				if(typeof tues != 'undefined'){
					var tuesTime = "Tuesday at " + req.body.tuesdayStartHour + ": "
																		+ req.body.tuesdayStartMinutes + " "
																		+ req.body.tuesdayStartAMPM + " - "
																		+ req.body.tuesdayEndHour + ":"
																		+ req.body.tuesdayEndMinutes + " "
																		+ req.body.tuesdayEndAMPM;
				}

				if(typeof wed != 'undefined'){
					var wedTime = "Wednesday at " + req.body.wednesdayStartHour + ": "
																		+ req.body.wednesdayStartMinutes + " "
																		+ req.body.wednesdayStartAMPM + " - "
																		+ req.body.wednesdayEndHour + ":"
																		+ req.body.wednesdayEndMinutes + " "
																		+ req.body.wednesdayEndAMPM;
				}

				if(typeof thurs != 'undefined'){
					var thursTime = "thursday at " + req.body.thursdayStartHour + ": "
																		+ req.body.thursdayStartMinutes + " "
																		+ req.body.thursdayStartAMPM + " - "
																		+ req.body.thursdayEndHour + ":"
																		+ req.body.thursdayEndMinutes + " "
																		+ req.body.thursdayEndAMPM;
				}

				if(typeof fri != 'undefined'){
					var friTime = "friday at " + req.body.fridayStartHour + ": "
																		+ req.body.fridayStartMinutes + " "
																		+ req.body.fridayStartAMPM + " - "
																		+ req.body.fridayEndHour + ":"
																		+ req.body.fridayEndMinutes + " "
																		+ req.body.fridayEndAMPM;
				}



				var errors = req.validationErrors();

				if(errors){
					res.render('schedule',{
						errors:errors, currentUser: req.user
					});
				}
				else {
					var newSchedule = new schedule({
						name: name,
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

					req.flash('success_msg', 'Course has been added to your schedule.');

					res.redirect('/schedule');
				}
			}
		}
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
