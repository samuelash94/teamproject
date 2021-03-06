var mongoose = require('mongoose');

var FeedbackSchema = mongoose.Schema({
	description: {
		type: String
	},
	userId: {
		type: String
	},
	date: {
		type: String
	},
	mongoDate: {
		type: Date
	},
	author: {
		type: String
	},
  feedbackType: {
    type: String
  },
  title: {
    type: String
  }
});

var feedback = module.exports = mongoose.model('Feedback', FeedbackSchema);

module.exports.getCurrentDate = function(){
	// Date formatting
	var dateObj = new Date();
	var month = dateObj.getMonth();
	var day = dateObj.getDate();
	var hour = dateObj.getHours();
	var minute = dateObj.getMinutes();
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
	if (minute < 10){
		minute = "0" + minute;
	}
	var date = month + " " + day + ", " + dateObj.getFullYear() + " " + hour + ":" + minute + ampm;
	return date;
}

module.exports.addFeedback = function(newFeedback, callback){
	newFeedback.save(callback);
}

module.exports.getFeedbackByID = function(id, callback){
	feedback.findById(id, callback);
}
