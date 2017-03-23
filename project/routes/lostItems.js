var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var lostItem = require('../models/lostItem');

router.get('/', function(req, res){
	res.render('lostandfound', {currentUser: req.user});
});

router.post('/postItem', function(req, res){
	var description = req.body.itemDesc;
	var location = req.body.foundLocation;
	var posterId = req.user.id;
	var poster = req.user.name;

	req.checkBody('itemDesc', 'Item description must not be empty').notEmpty();
	req.checkBody('foundLocation', 'Item location must not be empty').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('lostandfound',{
			errors:errors, currentUser: req.user
		});
	} else {
		var newItem = new lostItem({
			description: description,
			location: location,
			posterId: posterId,
			poster: poster
		});

		lostItem.postNewItem(newItem, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'Item successfully added to lost and found.');

		res.redirect('/lostItems');
	}
});

module.exports = router;
