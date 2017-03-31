/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Post Schema
var PostSchema = mongoose.Schema({
	userId: {
		type: String
	},
	author: {
		type: String
	},
	text: {
		type: String
	},
	date: {
		type: String
	},
	image: {
		type: Number
	},
	visible: {
		type: Number
	},
	friendsList: {
		type: Array
	}
});

var Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.createPost = function(newPost, callback){
	newPost.save(callback);
}

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

module.exports.getPostByID = function(id, callback){
	Post.findById(id, callback);
}

module.exports.changeVisibility = function(id,newVisibility, callback){
	Post.save({_id: ObjectId(id), visible : newVisibility});
	//Post.save(callback);
}

module.exports.editText = function(id,newText, callback){
	Post.save({_id: ObjectId(id), text : newText});
	//Post.save(callback);
}

module.exports.removeText = function(id, callback){
	Post.save({_id: ObjectId(id), text : null});
	//Post.save(callback);
}

module.exports.removeImage = function(id, callback){
	Post.save({_id: ObjectId(id), image : null});
}

module.exports.deletePost = function(id){
	Post.remove({_id: ObjectId(id)});
}
