/**
 * http://usejsdoc.org/
 */
 var mongoose = require('mongoose');
 var bcrypt = require('bcryptjs');

 // Schedule Schema
 var scheduleSchema = mongoose.Schema({
 	slot: {
 		type: String
 	},
 	monday: {
    type: String
  },
  tuesday: {
    type: String
  },
  wednesday: {
    type: String
  },
  thursday: {
    type: String
  },
  friday: {
    type: String
  },

 	name: {
 		type: String
 	},
   userId: {
     type: String
   }
 });

 var schedule = module.exports = mongoose.model('schedule', scheduleSchema);

 module.exports.createSchedule = function(newSchedule, callback){
 	newSchedule.save(callback);
 }

 module.exports.getCourseByID = function(id, callback){
 	schedule.findById(id, callback);
 }

 module.exports.editCouseName = function(id, newName, callback){
 	schedule.save({_id: ObjectId(id), courseName : newName});
 }
