var mongoose = require('mongoose');
//var Post = require('../models/post');
//var User = require('.../models/user');

var CommentSchema = mongoose.Schema({
	postId: {
		type: String,
	},
	userId: {
		type: String
	},
	text: {
		type: String
	},
	date: {
		type: Date
	}
});

var comment = module.exports = mongoose.model('Comment', CommentSchema);

module.exports.addComment = function(newComment, callback){
	newComment.save(callback);
}

module.exports.getCommentByID = function(id, callback){
	comment.findById(id, callback);
}

module.exports.editComment = function(id, newCommentText, callback){
	var currentDate = new Date();
  comment.save({_id: ObjectId(id), text : newCommentText, date: currentDate}, callback);
}

module.exports.deleteComment = function(id, callback){
  comment.remove({_id: ObjectId(id)}, callback);
}
