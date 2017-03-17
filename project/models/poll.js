/**
 * http://usejsdoc.org/
 */
 var mongoose = require('mongoose');
 var bcrypt = require('bcryptjs');

 // Schedule Schema
 var pollSchema = mongoose.Schema({
 	groupId: {
 		type: String
 	},
 	userId: {
 		type: String
 	},
 	rating: {
 		type: [Number]
 	},
 	name: {
 		type: String
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
 	poll.update({
    _id: ObjectId(id)
  },
    {$push:
      {rating: newRating}
    }
  );
 }

//module.exports.getRating = function(id, callback){
//  return //average
//}
