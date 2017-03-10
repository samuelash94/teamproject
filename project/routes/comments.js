var express = require('express');
var router = express.Router();

var Post = require('../models/post');
var User = require('../models/user');
var comment = require('../models/comment');

router.get('/', function(req, res){
	res.render('index');
});

router.post('/addComment', function(req, res){
  var commentText = req.body.commentTextField;
  var date = new Date();
  req.checkBody('commentTextField', 'comment text must not be empty').notEmpty();

	var errors = req.validationErrors();

  if(errors){
		res.render('index',{
			errors:errors
		});
	} else {
		var newComment = new comment({
			//postId: Post.id,

			//userId: "58b967c52427cf2890203b29",
      postID: "58c205adf16ac410e8ade94b",
      userId: req.user.id,
			text: commentText,
			date: date,
		});

    comment.addComment(newComment, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'comment was added.');
    res.redirect("/");
  }

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
