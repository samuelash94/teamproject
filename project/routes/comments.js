var express = require('express');
var router = express.Router();

var Post = require('../models/post');
var User = require('../models/user');
var comment = require('../models/comment');

var mongo = require('mongodb');

var url = 'mongodb://localhost/4770TeamProject';

router.get('/', function(req, res){
	res.render('index');
});

router.post('/addComment/', function(req, res){
	var postIdentif = req.body.postIdentif;
  var commentText = req.body.commentTextField;
  var date = comment.getCurrentDate();
  req.checkBody('commentTextField', 'comment text must not be empty').notEmpty();

	var errors = req.validationErrors();

  if(errors){
		res.render('index',{
			errors:errors
		});
	} else {
		var newComment = new comment({
      postId: postIdentif,
      userId: req.user.id,
			text: commentText,
			date: date,
			author: req.user.name,
			isEdited: false
		});

    comment.addComment(newComment, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'comment was added.');
    res.redirect("/");
  }

});

router.get('/loadComments', function(req, res, next) {
	var commentsArray = [];
	mongo.connect(url, function(err, db){
		var cursor = db.collection('comments').find( { postId: req.body.postIdentif } )
		cursor.forEach(function(doc, err){
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('index', {comments: commentsArray});
			console.log(commentsArray);
		});
	});
});

/*
router.post('/editComment/'+ id , function(req, res) {
  comment.editComment(id, function(err, user){
    if(err) throw err;
    if(!comment){
      return done(null, false, {message: 'Comment does not exist!'});
    }
    else{
      req.flash('success_msg', 'comment was edited.');

      res.redirect('/');
    }
  });
});

router.post('/deleteComment/'+ id , function(req, res) {
  comment.deleteComment(id, function(err, user){
    if(err) throw err;
    if(!comment){
      return done(null, false, {message: 'Comment does not exist!'});
    }
    else{
      req.flash('success_msg', 'comment was deleted.');

      res.redirect('/');
    }
  });
});
*/

module.exports = router;
