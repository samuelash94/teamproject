var express = require('express');
var router = express.Router();

router.get('/', createPost, function(req, res){
	res.render('index');
});

function displayPostField(){
	document.getElementById("postField").style.visibility = 'visible';
	document.getElementById("postSubmit").style.visibility = 'visible';
}

router.post('/post', function(req, res){
	var postField = req.body.postField;
	var date = new Date();
	var image = null;
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
	
	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newPost = new Post({
			body: postField;
			date: date;
			image: image;
			visible: 0;
		});
		
		Post.createPost(newPost, function(err, user){
			if(err) throw err;
			console.log(user);
		});
	  
});

module.exports = router;