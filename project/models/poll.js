/**
 * http://usejsdoc.org/
 */
 var mongoose = require('mongoose');
 var bcrypt = require('bcryptjs');
 var objectId = require('mongodb').ObjectID;

 // Schedule Schema
 var pollSchema = mongoose.Schema({
 	groupId: {
 		type: String
 	},
 	userId: {
 		type: String
 	},
 	ratings: {
 		type: Array
 	},
 	name: {
 		type: String
 	},
  average:{
    type: Number
  }
 });

 var poll = module.exports = mongoose.model('poll', pollSchema);

 module.exports.createPoll = function(newPoll, callback){
 	newPoll.save(callback);
 }

 module.exports.getPollByID = function(id, callback){
 	poll.findById(id, callback);
 }

 module.exports.addRating = function(id, newRating, callback){
 	poll.update(
    {_id: objectId(id)},
    {$push: {ratings: newRating} }
  );
 }

//module.exports.getRating = function(id, callback){
//  return //average
//}
