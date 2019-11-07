var mongoose = require('mongoose');
var Schema = mongoose.Schema;

questionSchema = new Schema( {
	id: Number,
    question : String,
    answered : Boolean,
    answers : [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    user : {type.Schema.Types.ObjectID, ref:'User'},
    upvotes: Number
}),
User = mongoose.model('Question', questionSchema);

module.exports = Question;