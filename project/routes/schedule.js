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
		switch(monStartHour){
			case "H1":
				monTime += "1:";
				break;
			case "H2":
				monTime += "2:";
				break;
			case "H3":
				monTime += "3:";
				break;
			case "H4":
				monTime += "4:";
				break;
			case "H5":
				monTime += "5:";
				break;
			case "H6":
				monTime += "6:";
				break
			case "H7":
				monTime += "7:";
				break;
			case "H8":
				monTime += "8:";
				break;
			case "H9":
				monTime += "9:";
				break;
			case "H10":
				monTime += "10:";
				break;
			case "H11":
				monTime += "11:";
				break;
			case "H12":
				monTime += "12:";
				break;
		}
		var monStartMin = req.body.mondayStartMinutes;
		switch(monStartMin){
			case "M1":
				monTime += "00 ";
				break;
			case "M2":
				monTime += "15 ";
				break;
			case "M3":
				monTime += "30 ";
				break;
			case "M4":
				monTime += "45 ";
				break;
		}
		var monStartAP = req.body.mondayStartAMPM;
		switch(monStartAP){
			case "AM":
				monTime += "AM - ";
				break;
			case "PM":
				monTime += "PM - ";
				break;
		}
		var monEndHour = req.body.mondayEndHour;
		switch(monEndHour){
			case "H1":
				monTime += "1:";
				break;
			case "H2":
				monTime += "2:";
				break;
			case "H3":
				monTime += "3:";
				break;
			case "H4":
				monTime += "4:";
				break;
			case "H5":
				monTime += "5:";
				break;
			case "H6":
				monTime += "6:";
				break
			case "H7":
				monTime += "7:";
				break;
			case "H8":
				monTime += "8:";
				break;
			case "H9":
				monTime += "9:";
				break;
			case "H10":
				monTime += "10:";
				break;
			case "H11":
				monTime += "11:";
				break;
			case "H12":
				monTime += "12:";
				break;
		}
		var monEndMin = req.body.mondayEndMinutes;
		switch(monEndMin){
			case "M1":
				monTime += "00 ";
				break;
			case "M2":
				monTime += "15 ";
				break;
			case "M3":
				monTime += "30 ";
				break;
			case "M4":
				monTime += "45 ";
				break;
			case "M5":
				monTime += "50 ";
				break;
		}
		var monEndAP = req.body.mondayEndAMPM;
		switch(monEndAP){
			case "AM":
				monTime += "AM";
				break;
			case "PM":
				monTime += "PM";
				break;
		}
		daysTimes.push(monTime);
	}

	if(typeof tues != 'undefined'){
		var tuesTime = "Tuesday at ";
		var tuesStartHour = req.body.tuesdayStartHour;
		switch(tuesStartHour){
			case "H1":
				tuesTime += "1:";
				break;
			case "H2":
				tuesTime += "2:";
				break;
			case "H3":
				tuesTime += "3:";
				break;
			case "H4":
				tuesTime += "4:";
				break;
			case "H5":
				tuesTime += "5:";
				break;
			case "H6":
				tuesTime += "6:";
				break
			case "H7":
				tuesTime += "7:";
				break;
			case "H8":
				tuesTime += "8:";
				break;
			case "H9":
				tuesTime += "9:";
				break;
			case "H10":
				tuesTime += "10:";
				break;
			case "H11":
				tuesTime += "11:";
				break;
			case "H12":
				tuesTime += "12:";
				break;
		}
		var tuesStartMin = req.body.tuesdayStartMinutes;
		switch(tuesStartMin){
			case "M1":
				tuesTime += "00 ";
				break;
			case "M2":
				tuesTime += "15 ";
				break;
			case "M3":
				tuesTime += "30 ";
				break;
			case "M4":
				tuesTime += "45 ";
				break;
		}
		var tuesStartAP = req.body.tuesdayStartAMPM;
		switch(tuesStartAP){
			case "AM":
				tuesTime += "AM - ";
				break;
			case "PM":
				tuesTime += "PM - ";
				break;
		}
		var tuesEndHour = req.body.tuesdayEndHour;
		switch(tuesEndHour){
			case "H1":
				tuesTime += "1:";
				break;
			case "H2":
				tuesTime += "2:";
				break;
			case "H3":
				tuesTime += "3:";
				break;
			case "H4":
				tuesTime += "4:";
				break;
			case "H5":
				tuesTime += "5:";
				break;
			case "H6":
				tuesTime += "6:";
				break
			case "H7":
				tuesTime += "7:";
				break;
			case "H8":
				tuesTime += "8:";
				break;
			case "H9":
				tuesTime += "9:";
				break;
			case "H10":
				tuesTime += "10:";
				break;
			case "H11":
				tuesTime += "11:";
				break;
			case "H12":
				tuesTime += "12:";
				break;
		}
		var tuesEndMin = req.body.tuesdayEndMinutes;
		switch(tuesEndMin){
			case "M1":
				tuesTime += "00 ";
				break;
			case "M2":
				tuesTime += "15 ";
				break;
			case "M3":
				tuesTime += "30 ";
				break;
			case "M4":
				tuesTime += "45 ";
				break;
			case "M5":
				tuesTime += "50 ";
				break;
		}
		var tuesEndAP = req.body.tuesdayEndAMPM;
		switch(tuesEndAP){
			case "AM":
				tuesTime += "AM";
				break;
			case "PM":
				tuesTime += "PM";
				break;
		}
		daysTimes.push(tuesTime);
	}

	if(typeof wed != 'undefined'){
		var wedTime = "Wednesday at ";
		var wedStartHour = req.body.wednesdayStartHour;
		switch(wedStartHour){
			case "H1":
				wedTime += "1:";
				break;
			case "H2":
				wedTime += "2:";
				break;
			case "H3":
				wedTime += "3:";
				break;
			case "H4":
				wedTime += "4:";
				break;
			case "H5":
				wedTime += "5:";
				break;
			case "H6":
				wedTime += "6:";
				break
			case "H7":
				wedTime += "7:";
				break;
			case "H8":
				wedTime += "8:";
				break;
			case "H9":
				wedTime += "9:";
				break;
			case "H10":
				wedTime += "10:";
				break;
			case "H11":
				wedTime += "11:";
				break;
			case "H12":
				wedTime += "12:";
				break;
		}
		var wedStartMin = req.body.wednesdayStartMinutes;
		switch(wedStartMin){
			case "M1":
				wedTime += "00 ";
				break;
			case "M2":
				wedTime += "15 ";
				break;
			case "M3":
				wedTime += "30 ";
				break;
			case "M4":
				wedTime += "45 ";
				break;
		}
		var wedStartAP = req.body.wednesdayStartAMPM;
		switch(wedStartAP){
			case "AM":
				wedTime += "AM - ";
				break;
			case "PM":
				wedTime += "PM - ";
				break;
		}
		var wedEndHour = req.body.wednesdayEndHour;
		switch(wedEndHour){
			case "H1":
				wedTime += "1:";
				break;
			case "H2":
				wedTime += "2:";
				break;
			case "H3":
				wedTime += "3:";
				break;
			case "H4":
				wedTime += "4:";
				break;
			case "H5":
				wedTime += "5:";
				break;
			case "H6":
				wedTime += "6:";
				break
			case "H7":
				wedTime += "7:";
				break;
			case "H8":
				wedTime += "8:";
				break;
			case "H9":
				wedTime += "9:";
				break;
			case "H10":
				wedTime += "10:";
				break;
			case "H11":
				wedTime += "11:";
				break;
			case "H12":
				wedTime += "12:";
				break;
		}
		var wedEndMin = req.body.wednesdayEndMinutes;
		switch(wedEndMin){
			case "M1":
				wedTime += "00 ";
				break;
			case "M2":
				wedTime += "15 ";
				break;
			case "M3":
				wedTime += "30 ";
				break;
			case "M4":
				wedTime += "45 ";
				break;
			case "M5":
				monTime += "50 ";
				break;
		}
		var wedEndAP = req.body.wednesdayEndAMPM;
		switch(wedEndAP){
			case "AM":
				wedTime += "AM";
				break;
			case "PM":
				wedTime += "PM";
				break;
		}
		daysTimes.push(wedTime);
	}
	if(typeof thurs != 'undefined'){
		var thursTime = "Thrusday at ";
		var thursStartHour = req.body.thursdayStartHour;
		switch(thursStartHour){
			case "H1":
				thursTime += "1:";
				break;
			case "H2":
				thursTime += "2:";
				break;
			case "H3":
				thursTime += "3:";
				break;
			case "H4":
				thursTime += "4:";
				break;
			case "H5":
				thursTime += "5:";
				break;
			case "H6":
				thursTime += "6:";
				break
			case "H7":
				thursTime += "7:";
				break;
			case "H8":
				thursTime += "8:";
				break;
			case "H9":
				thursTime += "9:";
				break;
			case "H10":
				thursTime += "10:";
				break;
			case "H11":
				thursTime += "11:";
				break;
			case "H12":
				thursTime += "12:";
				break;
		}
		var thursStartMin = req.body.thursdayStartMinutes;
		switch(thursStartMin){
			case "M1":
				thursTime += "00 ";
				break;
			case "M2":
				thursTime += "15 ";
				break;
			case "M3":
				thursTime += "30 ";
				break;
			case "M4":
				thursTime += "45 ";
				break;
		}
		var thursStartAP = req.body.thursdayStartAMPM;
		switch(thursStartAP){
			case "AM":
				thursTime += "AM - ";
				break;
			case "PM":
				thursTime += "PM - ";
				break;
		}
		var thursEndHour = req.body.thursdayEndHour;
		switch(thursEndHour){
			case "H1":
				thursTime += "1:";
				break;
			case "H2":
				thursTime += "2:";
				break;
			case "H3":
				thursTime += "3:";
				break;
			case "H4":
				thursTime += "4:";
				break;
			case "H5":
				thursTime += "5:";
				break;
			case "H6":
				thursTime += "6:";
				break
			case "H7":
				thursTime += "7:";
				break;
			case "H8":
				thursTime += "8:";
				break;
			case "H9":
				thursTime += "9:";
				break;
			case "H10":
				thursTime += "10:";
				break;
			case "H11":
				thursTime += "11:";
				break;
			case "H12":
				thursTime += "12:";
				break;
		}
		var thursEndMin = req.body.thursdayEndMinutes;
		switch(thursEndMin){
			case "M1":
				thursTime += "00 ";
				break;
			case "M2":
				thursTime += "15 ";
				break;
			case "M3":
				thursTime += "30 ";
				break;
			case "M4":
				thursTime += "45 ";
				break;
			case "M5":
				monTime += "50 ";
				break;
		}
		var thursEndAP = req.body.thursdayEndAMPM;
		switch(thursEndAP){
			case "AM":
				thursTime += "AM";
				break;
			case "PM":
				thursTime += "PM";
				break;
		}
		daysTimes.push(thursTime);
	}
	if(typeof fri != 'undefined'){
		var friTime = "Friday at ";
		var friStartHour = req.body.fridayStartHour;
		switch(friStartHour){
			case "H1":
				friTime += "1:";
				break;
			case "H2":
				friTime += "2:";
				break;
			case "H3":
				friTime += "3:";
				break;
			case "H4":
				friTime += "4:";
				break;
			case "H5":
				friTime += "5:";
				break;
			case "H6":
				friTime += "6:";
				break
			case "H7":
				friTime += "7:";
				break;
			case "H8":
				friTime += "8:";
				break;
			case "H9":
				friTime += "9:";
				break;
			case "H10":
				friTime += "10:";
				break;
			case "H11":
				friTime += "11:";
				break;
			case "H12":
				friTime += "12:";
				break;
		}
		var friStartMin = req.body.friStartMinutes;
		switch(friStartMin){
			case "M1":
				friTime += "00 ";
				break;
			case "M2":
				friTime += "15 ";
				break;
			case "M3":
				friTime += "30 ";
				break;
			case "M4":
				friTime += "45 ";
				break;
		}
		var friStartAP = req.body.fridayStartAMPM;
		switch(friStartAP){
			case "AM":
				friTime += "AM - ";
				break;
			case "PM":
				friTime += "PM - ";
				break;
		}
		var friEndHour = req.body.fridayEndHour;
		switch(friEndHour){
			case "H1":
				friTime += "1:";
				break;
			case "H2":
				friTime += "2:";
				break;
			case "H3":
				friTime += "3:";
				break;
			case "H4":
				friTime += "4:";
				break;
			case "H5":
				friTime += "5:";
				break;
			case "H6":
				friTime += "6:";
				break
			case "H7":
				friTime += "7:";
				break;
			case "H8":
				friTime += "8:";
				break;
			case "H9":
				friTime += "9:";
				break;
			case "H10":
				friTime += "10:";
				break;
			case "H11":
				friTime += "11:";
				break;
			case "H12":
				friTime += "12:";
				break;
		}
		var friEndMin = req.body.fridayEndMinutes;
		switch(friEndMin){
			case "M1":
				friTime += "00 ";
				break;
			case "M2":
				friTime += "15 ";
				break;
			case "M3":
				friTime += "30 ";
				break;
			case "M4":
				friTime += "45 ";
				break;
			case "M5":
				monTime += "50 ";
				break;
		}
		var friEndAP = req.body.fridayEndAMPM;
		switch(friEndAP){
			case "AM":
				friTime += "AM";
				break;
			case "PM":
				friTime += "PM";
				break;
		}
		daysTimes.push(friTime);
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
			daysTimes: daysTimes,
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
