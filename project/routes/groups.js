var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

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
		var memberArr = [];
		memberArr.push(req.user.id);
		var newGroup = new Group({
			ownerId: req.user.id,
			owner: owner,
			name: name,
			description: description,
			privacy : privacy,
			members: memberArr
		});

		Group.createGroup(newGroup, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'Group created successfully.');

		res.redirect('/groups');
	}
});

router.get('/myGroups', function(req, res, next) {
	var resultArray = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').find({ members: { "$in" : [req.user.id]} });
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('groups', {groups: resultArray});
		});
	});
	//res.redirect('/');
});

router.get('/loadGroups', function(req, res, next) {
	var resultArray = [];
	var res2 = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').find({ members: { "$in" : [req.user.id]} });
		var notCursor = db.collection('groups').find({ members: { "$nin" : [req.user.id]} });
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
		});

		notCursor.forEach(function(doc, err){
			res2.push(doc);
		}, function(){
			db.close();
			res.render('groups', {myGroups: resultArray, notMyGroups:res2});
		});
	});
	//res.redirect('/');
});

router.post('/joinGroup', function(req, res){
	var groupId = req.body.groupIdentif;
	var userId = req.user.id;
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').update(
    { _id: objectId(groupId)},
    { "$push":
        {"members":
            {
                userId
            }
        }
    }
);
		db.close();
		req.flash('success_msg', 'You have successfully joined this group');
	 	res.redirect('/');
	});
});

module.exports = router;
