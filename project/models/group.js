/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Group Schema
var GroupSchema = mongoose.Schema({
	ownerId: {
		type: String
	},
	owner: {
		type: String
	},
	name: {
		type: String
	},
	description: {
		type: String
	},
	privacy: {
		type: String
	},
	members:{
		type: Array
	},
	requests:{
		type: Array
	}
});

var Group = module.exports = mongoose.model('Group', GroupSchema);

module.exports.createGroup = function(newGroup, callback){
	newGroup.save(callback);
}

module.exports.getGroupByID = function(id, callback){
	Group.findById(id, callback);
}

module.exports.changePrivacy = function(id, newPrivacy, callback){
	Group.save({_id: ObjectId(id), privacy : newPrivacy});
	//Group.save(callback);
}

module.exports.editName = function(id, newName, callback){
	Group.save({_id: ObjectId(id), name : newName});
	//Group.save(callback);
}

module.exports.editDescription = function(id, newDesc, callback){
	Group.save({_id: ObjectId(id), description : newDesc});
	//Group.save(callback);
}
