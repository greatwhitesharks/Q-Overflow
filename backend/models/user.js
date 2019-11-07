var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	username: String,
	password: String,
	notifications:  [{type:Schema.Types.ObjectId, ref:'Notification'}],
	passwordConf: String
}),
User = mongoose.model('User', userSchema);

module.exports = User;