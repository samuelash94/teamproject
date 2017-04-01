/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Group Schema
var lostItemSchema = mongoose.Schema({
	description: {
		type: String
	},
	location: {
		type: String
	},
	posterId: {
		type: String
	},
	poster: {
		type: String
	},
	hasImage: {
		type: Boolean
	}
});

var lostItem = module.exports = mongoose.model('lostItem', lostItemSchema);

module.exports.postNewItem = function(newItem, callback){
	newItem.save(callback);
}

module.exports.getItemByID = function(id, callback){
	lostItem.findById(id, callback);
}

module.exports.editDescription = function(id, newDesc, callback){
	lostItem.save({_id: ObjectId(id), description : newDesc});
	//Group.save(callback);
}

module.exports.editLocation = function(id, newLocation, callback){
	lostItem.save({_id: ObjectId(id), location : newLocation});
	//Group.save(callback);
}

module.exports.removeItem = function(id){
	lostItem.remove({_id: ObjectId(id)});
}
