/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Post Schema
var PostSchema = mongoose.Schema({
	text: {
		type: String,
	},
	date: {
		type: Date
	},
	image: {
		type: Number
	},
	visible: {
		type: Number
	}
});

var Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.createPost = function(newPost, callback){
	newPost.save(callback);
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
