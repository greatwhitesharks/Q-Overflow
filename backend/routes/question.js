var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Question = require('../models/question');

//View question
router.get('/:id', function (req, res, next) {

	console.log('asdas')
});

router.post('/add', function (req, res, next) {
    const question = req.body.question;
    const userId = req.body.userId;
    const user = null;
    
    User.findById(id, function (err, u) {
        user = u;
    });
    
    const questionModel = Quesion({
        question,
        user,
        answers : [],
        upvotes: 0
    });

    questionModel.save().then(()=> {

    }).catch(()=>{

    });
});

router.post('/upvote')


router.post('/remove/:id', function(req,res,next){

});
