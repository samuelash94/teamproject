var mongoose = require('mongoose');
//var Post = require('../models/post');
//var User = require('.../models/user');

var CommentSchema = mongoose.Schema({
	postId: {
		type: String
	},
	userId: {
		type: String
	},
	text: {
		type: String
	},
	date: {
		type: String
	},
	author: {
		type: String
	},
	isEdited: {
		type: Boolean
	}
});

var comment = module.exports = mongoose.model('Comment', CommentSchema);

module.exports.getCurrentDate = function(){
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
	return date;
}

module.exports.addComment = function(newComment, callback){
	newComment.save(callback);
}

module.exports.getCommentByID = function(id, callback){
	comment.findById(id, callback);
}

module.exports.editComment = function(id, newCommentText, callback){
	var currentDate = this.getCurrentDate();
	this.getCommentByID(id, function(err, user) {
    done(err, user);
  });
  comment.save({_id: id, text : newCommentText, date: currentDate, isEdited: true}, callback);
}

module.exports.deleteComment = function(id, callback){
  comment.remove({_id: ObjectId(id)}, callback);
}
