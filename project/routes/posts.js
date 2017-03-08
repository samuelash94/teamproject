var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Post = require('../models/post');

router.get('/', function(req, res){
	res.render('index');
});

router.post('/post', function(req, res){
	var text = req.body.postField;
	var date = new Date();
	var image = 0;
/*
	var day = today.getDate();
	var month = today.getMonth()+1;
	var year = today.getFullYear();
	var hour = today.getHours();
	var minute = today.getMinutes();
	var ampm;
	var newDate;

	if (hour < 11){
		ampm = "AM";
	}else{
		ampm = "PM";
	}
	if (hour == 0){
		hour = hour+12;
	}else if (hour == 12){
		hour = hour-12;
	}
	if (minute < 10){
		newDate = day + "/" + (month+1) + "/" + (year+1900) + " " + hour + "0:" + minute + ampm;
	}else{
		newDate = day + "/" + (month+1) + "/" + (year+1900) + " " + hour + ":" + minute + ampm;
	}

*/
	req.checkBody('postField', 'Post must not be empty').notEmpty();
	
	var errors = req.validationErrors();

	if(errors){
		res.render('index',{
			errors:errors
		});
	} else {
		var newPost = new Post({
			text: text,
			date: date,
			image: image,
			visible: 0,
		});

		Post.createPost(newPost, function(err, user){
			if(err) throw err;
			console.log(user);
		});
		
		req.flash('success_msg', 'Post was posted.');

		res.redirect('/');
	}
});

module.exports = router;
