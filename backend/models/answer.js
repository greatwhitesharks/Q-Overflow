var mongoose = require('mongoose');
var Schema = mongoose.Schema;

answerSchema = new Schema( {

    answer:String,
    time : {Date}
	
}),
Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;