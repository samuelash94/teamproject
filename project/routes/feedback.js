var express = require('express');
var router = express.Router();
var Feedback = require('../models/feedback');
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost/4770TeamProject';

router.get('/', function(req, res){
  if(!req.user){
		res.redirect('/users/login');
	}
  else {

  res.render('feedback', {currentUser: req.user});
}
});

router.post('/submitFeedback', function(req, res){
  if(!req.user){
		res.redirect('/users/login');
	}
  else {

  var title = req.body.Title;
  var description = req.body.Description;
  var feedbackType = req.body.feedbackType;
  var date = Feedback.getCurrentDate();

  req.checkBody('Title', 'Title is required').notEmpty();
	req.checkBody('Description', 'Description is required').notEmpty();
	req.checkBody('feedbackType', 'Please select an option').notEmpty();

  var errors = req.validationErrors();

  if(errors){
		res.render('feedback',{
			errors:errors, currentUser: req.user
		});
  }
  else{
    var newFeedback = new Feedback({
      description: description,
      userId: req.user.id,
      date: date,
      mongoDate: new Date(),
      author: req.user.name,
      feedbackType: feedbackType,
      title: title
    });

    Feedback.addFeedback(newFeedback, function(err, feed){
      if(err) throw err;
      console.log(feed);
    });

    req.flash('success_msg', 'Feedback Posted');

    res.redirect('/feedback');
  }
}
});

router.get('/viewFeedback', function(req, res){
  if(!req.user){
		res.redirect('/users/login');
	}
  else {

  var resultArray = [];
  mongo.connect(url, function(err, db){
    var feedback = db.collection('feedbacks').find().sort({mongoDate: -1});
    feedback.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
      db.close();
      res.render('viewFeedback', {feedback: resultArray});
		});
  });
}
});

module.exports = router;
