var mongoose = require('mongoose');
var Schema = mongoose.Schema;

questionSchema = new Schema( {
	id: {type:Number, unique:true},
    question : String,
    answered : Boolean,
    answers : [{type:Schema.Types.ObjectId, ref:'Answer'}],
    user : {type:Schema.Types.ObjectId, ref:'User'},
    tags : [{type:String}],
    upvotes: Number
}),
Question = mongoose.model('Question', questionSchema);

module.exports = Question;