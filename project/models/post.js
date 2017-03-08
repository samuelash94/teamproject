/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Post Schema
var PostSchema = mongoose.Schema({
	body: {
		type: String,
		index:true
	},
	date: {
		type: Date
	},
	image: {
		type: null
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

module.exports.changeVisibility = function(newVisibility, callback){
	Post.visible = newVisibility;
}