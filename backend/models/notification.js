var mongoose = require('mongoose');
var Schema = mongoose.Schema;

notificationSchema = new Schema( {
	
	unique_id: Number,
	content: String,
	read: Boolean
}),
Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;