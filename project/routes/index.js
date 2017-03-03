var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

router.get('/', createPost, function(req, res){
	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

function displayPostField(){
	document.getElementById("postField").style.visibility = 'visible';
}

router.post('/post', function(req, res){
	var postField = req.body.postField;
	var date = new Date();
	var day = today.getDate();
	var month = today.getMonth()+1;
	var year = today.getFullYear();
	var hour = today.getHours();
	var minute = today.getMinutes();
	req.checkBody('postField', 'Post must not be empty').notEmpty();
	
	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newPost = new Post({
			body: postField;
			day: day;
			month: month;
			year: year;
			hour: hour;
			minute: minute;
		});
		
		User.createPost(newPost, function(err, user){
			if(err) throw err;
			console.log(user);
		});
	  
});

module.exports = router;