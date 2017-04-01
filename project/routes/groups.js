var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost/4770TeamProject';

var Group = require('../models/group');

router.get('/', function(req, res){
	res.render('groups', {currentUser: req.user, invites: req.user.invites});
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
			errors:errors, currentUser: req.user, invites: req.user.invites
		});
	} else {
		var memberArr = [];
		var requestArr = [];
		var adminArr = [];
		var invitesArr = [];
		memberArr.push(req.user.id);
		adminArr.push(req.user.id);
		var newGroup = new Group({
			ownerId: req.user.id,
			owner: owner,
			name: name,
			description: description,
			privacy: privacy,
			members: memberArr,
			admin: adminArr,
			requests: requestArr,
			invites: invitesArr
		});

		Group.createGroup(newGroup, function(err, user){
			if(err) throw err;
		});

		req.flash('success_msg', 'Group created successfully.');

		res.redirect('/groups');
	}
});


router.get('/loadGroups', function(req, res, next) {
	var resultArray = [];
	var res2 = [];
	var res3 = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').find({ members: { "$in" : [req.user.id]} });
		var notCursor = db.collection('groups').find({ members: { "$nin" : [req.user.id]} });
		var requested = db.collection('groups').find({ requests: { "$in" : [req.user.id]} });
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
		});

		requested.forEach(function(doc, err){
			res3.push(doc);
		}, function(){
		});

		notCursor.forEach(function(doc, err){
			res2.push(doc);
		}, function(){
			for (var i=0; i<res3.length; i++){
				if (res3[i]){
					for (var j=0; j<res2.length; j++){
						if (res2[j]){
							if (res3[i].name == res2[j].name){
								res2.splice(j, 1);
							}
						}
					}
				}
			}
			db.close();
			res.render('groups', {myGroups: resultArray, notMyGroups:res2, currentUser: req.user, requestedGroups: res3, invites: req.user.invites});
		});
	});
	//res.redirect('/');
});

router.post('/joinGroup', function(req, res){
	var groupId = req.body.groupIdentif;
	var userId = req.user.id;
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').update(
   { _id: objectId(groupId) },
   { $addToSet: { members: req.user.id } }
);
		db.close();
		req.flash('success_msg', 'You have successfully joined this group');
	 	res.redirect('/');
	});
});

router.get('/joinGroup/:groupId', function(req, res){
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').update(
    { _id: objectId(req.params.groupId) },
    { $addToSet: { members: req.user.id } });
		var cursor2 = db.collection('users').update(
		{ _id: objectId(req.user.id) },
		{ $pull: { invites: req.params.groupId } });
		var cursor3 = db.collection('groups').update(
 		{ _id: objectId(req.params.groupId) },
 		{ $pull: { invites: req.user.id } });
		db.close();
		req.flash('success_msg', 'You have successfully joined this group.');
	 	res.redirect('/');
	});
});

router.post('/requestJoinGroup', function(req, res){
	var groupId = req.body.groupIdentif;
	var userId = req.user.id;
	var sent = false;
	mongo.connect(url, function(err, db){
		if (req.user.invites){
			req.user.invites.forEach(function(doc, err){
				if (doc == groupId){
					var cursor = db.collection('groups').update(
				  { _id: objectId(groupId) },
				  { $addToSet: { members: req.user.id } });
				 var cursor2 = db.collection('users').update(
					{ _id: objectId(req.user.id) },
					{ $pull: { invites: groupId } });
				 	db.close();
				 	req.flash('success_msg', 'You have successfully joined this group.');
		 	 		res.redirect('/');
					sent = true;
				}
			});
		}
		if (!sent){
			var cursor = db.collection('groups').update(
	   { _id: objectId(groupId) },
	   { $addToSet: { requests: req.user.id } });
			db.close();
			req.flash('success_msg', 'You have requested to join this group.');
		 	res.redirect('/');
		}
	});
});

router.get('/requestJoinGroup/:groupId', function(req, res){
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').update(
   { _id: objectId(req.params.groupId) },
   { $addToSet: { requests: req.user.id } }
);
		db.close();
		req.flash('success_msg', 'You have requested to join this group.');
	 	res.redirect('/');
	});
});

router.get('/acceptRequest/:groupId/:userId', function(req, res){
	mongo.connect(url, function(err, db){
		var cursor = db.collection('groups').update(
   { _id: objectId(req.params.groupId) },
   { $addToSet: { members: req.params.userId } }
);
		var removeReq = db.collection('groups').update(
	 { _id: objectId(req.params.groupId) },
	 { $pull: { requests: req.params.userId } }
);

 		db.close();

		req.flash('success_msg', 'Group join request accepted.');
		res.redirect('/');
	});

});

router.post('/invite/:groupId', function(req, res){
	mongo.connect(url, function(err, db){
		var newInvites = req.body.adminFriendList;
		if (Array.isArray(newInvites)){
			var groups = db.collection('groups').find();
			groups.forEach(function(doc, err){
				if (doc._id == req.params.groupId){
					if (doc.privacy == "private"){
						newInvites.forEach(function(doc2, err){
							var cursor = db.collection('users').update(
					   { _id: objectId(doc2) },
					   { $addToSet: { invites: req.params.groupId }});
						 var cursor2 = db.collection('groups').update(
						 { _id: objectId(req.params.groupId) },
						 { $addToSet: { invites: doc2 }});
						});
						req.flash('success_msg', 'Successfully invited friends to group.');
						res.redirect('/');
						db.close();
					}else{
						newInvites.forEach(function(doc2, err){
						 var cursor3 = db.collection('groups').update(
						 { _id: objectId(req.params.groupId) },
						 { $addToSet: { members: doc2 }});
						});
						req.flash('success_msg', 'Successfully added friends to group.');
						res.redirect('/');
						db.close();
					}
				}
			});
		}else{
			var groups = db.collection('groups').find();
			groups.forEach(function(doc, err){
				if (doc._id == req.params.groupId){
					if (doc.privacy == "private"){
						var cursor4 = db.collection('users').update(
					  { _id: objectId(newInvites) },
					  { $addToSet: { invites: req.params.groupId }});
						var cursor5 = db.collection('groups').update(
					  { _id: objectId(req.params.groupId) },
					  { $addToSet: { invites: newInvites }});
						console.log(cursor5);
						req.flash('success_msg', 'Successfully invited friend to group.');
						res.redirect('/');
						db.close();
					}else{
						var cursor6 = db.collection('groups').update(
					  { _id: objectId(req.params.groupId) },
					  { $addToSet: { members: newInvites }});
						console.log(cursor6);
						req.flash('success_msg', 'Successfully added friend to group.');
						res.redirect('/');
						db.close();
					}
				}
			});
		}
	});
});

router.post('/promote/:groupId', function(req, res){
	mongo.connect(url, function(err, db){
		var newAdmin = req.body.memberList;
		if (Array.isArray(newAdmin)){
			newAdmin.forEach(function(doc, err){
				var cursor = db.collection('groups').update(
		   { _id: objectId(req.params.groupId) },
		   { $addToSet: { admin: doc }});
			});
		}else{
			var cursor2 = db.collection('groups').update(
		 { _id: objectId(req.params.groupId) },
		 { $addToSet: { admin: newAdmin }});
		}
		req.flash('success_msg', 'Successfully promoted admin.');
		res.redirect('/');
		db.close();
	});
});

router.post('/demote/:groupId', function(req, res){
	mongo.connect(url, function(err, db){
		var demoted = req.body.memberList;
		if (Array.isArray(demoted)){
			demoted.forEach(function(doc, err){
				var cursor = db.collection('groups').update(
		   { _id: objectId(req.params.groupId) },
		   { $pull: { admin: doc }});
			});
		}else{
			var cursor2 = db.collection('groups').update(
		 { _id: objectId(req.params.groupId) },
		 { $pull: { admin: demoted }});
		}
		req.flash('success_msg', 'Successfully demoted admin.');
		res.redirect('/');
		db.close();
	});
});

router.post('/remove/:groupId', function(req, res){
	mongo.connect(url, function(err, db){
		var removed = req.body.memberList;
		if (Array.isArray(removed)){
			removed.forEach(function(doc, err){
				var cursor = db.collection('groups').update(
		   { _id: objectId(req.params.groupId) },
		   { $pull: { members: doc }});
			 	var cursor2 = db.collection('groups').update(
			 { _id: objectId(req.params.groupId) },
			 { $pull: { admin: doc }});
			});
			req.flash('success_msg', 'Successfully removed users from group.');
 			res.redirect('/');
		}else{
			var cursor3 = db.collection('groups').update(
		 { _id: objectId(req.params.groupId) },
		 { $pull: { members: removed }});
		 	var cursor4 = db.collection('groups').update(
		 { _id: objectId(req.params.groupId) },
		 { $pull: { admin: removed }});
			req.flash('success_msg', 'Successfully removed user from group.');
 			res.redirect('/');
		}
		db.close();
	});
});

router.post('/deleteGroup/', function(req, res) {
		mongo.connect(url, function(err, db){
			var newComment = db.collection('groups').deleteOne(
	   { _id: objectId(req.body.groupIdentif) });
	db.close();
	req.flash('success_msg', 'group was deleted.');
		 res.redirect('/');

		});
});



module.exports = router;
