var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');

var url = 'mongodb://localhost/4770TeamProject';

var Post = require('../models/post');

router.get('/', function(req, res){
	res.render('index');
});

router.post('/post', function(req, res){
	var text = req.body.postField;

	// Date formatting
	var dateObj = new Date();
	var month = dateObj.getMonth();
	var day = dateObj.getDate();
	var hour = dateObj.getHours();
	var ampm = "AM";
	switch (month){
		case 0:
			month = "January";
			break;
		case 1:
			month = "February";
			break;
		case 2:
			month = "March";
			break;
		case 3:
			month = "April";
			break;
		case 4:
			month = "May";
			break;
		case 5:
			month = "June";
			break;
		case 6:
			month = "July";
			break;
		case 7:
			month = "August";
			break;
		case 8:
			month = "September";
			break;
		case 9:
			month = "October";
			break;
		case 10:
			month = "November";
			break;
		case 11:
			month = "December";
			break;
	}
	if (hour > 11){
		ampm = "PM";
	}
	if (hour > 12){
		hour = hour-12;
	}else if (hour == 0){
		hour = hour+12;
	}
	var date = month + " " + day + ", " + dateObj.getFullYear() + " " + hour + ":" + dateObj.getMinutes() + ampm;
	var image = 0;
	var userId = req.user.id;
	var author = req.user.name;
	req.checkBody('postField', 'Post must not be empty').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index',{
			errors:errors
		});
	} else {
		var newPost = new Post({
			userId: userId,
			author: author,
			text: text,
			date: date,
			image: image,
			visible: 0,
		});

		Post.createPost(newPost, function(err, post){
			if(err) throw err;
			console.log(post);
		});

		req.flash('success_msg', 'Post was posted.');

		res.redirect('/');
	}
});

router.get('/loadPosts', function(req, res, next) {
	var resultArray = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('posts').find();
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('index', {posts: resultArray});
		});
	});
	//res.redirect('/');
});

module.exports = router;
