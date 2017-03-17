var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');

var url = 'mongodb://localhost/4770TeamProject';

var Group = require('../models/group');

router.get('/', function(req, res){
	res.render('groups');
});

router.post('/create', function(req, res){
	var name = req.body.groupName;
	var description = req.body.groupDesc;
	var privacy = req.body.groupPrivacy;
	var userId = req.user.id;
	var owner = req.user.name;

	req.checkBody('groupName', 'Group name must not be empty').notEmpty();
	req.checkBody('groupDesc', 'Group description must not be empty').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('groups',{
			errors:errors
		});
	} else {
		var newGroup = new Group({
			userId: userId,
			owner: owner,
			name: name,
			description: description,
			privacy : privacy
		});

		Group.createGroup(newGroup, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'Group created successfully.');

		res.redirect('/groups');
	}
});

router.get('/loadGroups', function(req, res, next) {
	var resultArray = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').find();
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('groups', {groups: resultArray});
		});
	});
	//res.redirect('/');
});

router.get('/deleteGroup', function(req, res) {
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').find();
		cursor.remove();
			db.close();
			res.render('groups', {groups: resultArray});
		});
	});
	//res.redirect('/');
});

router.get('/addUser', function(req, res) {
	var userId = req.user.id;
	var newUser = new User({
		userId: userId,
	});
	Group.getUserById(userId, function(err, user){
		if(err) throw err;
		console.log(user);
	});
	mongo.connect(url, function(err, db){
		if(err) throw err;
		else {
			db.createUser(newUser, function(err, user){
				if(err) throw err;
				else {
					db.collection('groups').insert()
				}
			});
		}
});

module.exports = router;
