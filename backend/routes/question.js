var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Question = require('../models/question');
var Notification = require('../models/notification');

router.get('/:id', function (req, res, next) {
    Question.findOne({ id: req.params.id }, function (error, question) {
        if(question){
            res.render('question.ejs');
        }

        if(error){
            console.log(error);
        }
    });
});

router.post('/mark/:id', function (req,res){
    const userId = req.body.userId;

    Question.findOne({id:req.body.params.id}, (err,question) =>{
        User.findById(question.user, (err, user)=>{
            if(userId === user.unique_id){
                question.answered = true;
                question.save().then(()=> console.log('saved')).catch((err)=> console.log('error occured while saving',err));
            }else{
                res.json({error:'You don\'t have permission'});
            }
        });
    });
});

router.post('/add', function (req, res, next) {

    const userId = req.session.userId;
    console.log(userId);
    if (userId) {
        const question = req.body.question;
        Question.findOne({}, (err, data) => {
            let id = 1;
            if(data){
                id = data.id;
            }
          
            User.findOne({unique_id:userId}, function (err, user) {

                const questionModel = Question({
                    id: id+1,
                    question,
                    user,
                    answers: [],
                    upvotes: 0
                });

                questionModel.save().then(() => {
                    console.log('saved');
                    console.log(id);

                }).catch((err) => {
                    console.log('err'+ err);
                });
            });

        });
    } else {
        res.json({ message: 'No permission' });
    }

});

router.post('/answer/:id', function (req, res) {
    const userId = req.session.userId;
    if (userId) {
        const answer = req.body.answer;

        User.findOne({ unique_id: userId }, function (err, user) {

            Question.findOne({ id: req.params.id }, function (err, question) {
                if (!err) {
                  
                    User.findById(question.user, (err, questionUser)=>{
                        if (user.unique_id != questionUser.unique_id) {
                            const answer = Answer({answer});
                            answer.save().then((answer)=>{
                                question.answers.push(answer);
                                question.save(function(err, question){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log('Success');
                                        var notification = Notification({
                                            message : `{user.name} has answered your question`,
                                            read : false
                                        });
                                        notification.save().then(()=>console.log('Notification saved!')).catch((err)=> console.log('error occured', err));
                                    }
                                });

                            });
                            
                        
                        } else {
                            res.json({ message: 'You can\'t answer your own question' });
                        }
                    })
                    
                } else {
                    res.json({ message: 'Error occured while finding a question with the given a id' });
                }
            });
        });
    } else {
        res.json({ message: 'No permission' });
    }
});

router.post('/upvote/:id', function (req, res) {
    const userId = req.session.userId;

    if (userId) {

        User.findOne({unique_id:userId}, (err, user)=> {
    Question.findOne({ id: req.params.id }, function (err, question) {

        User.findById(question.user, (err, questionUser)=> {
            if (question && user.unique_id !== questionUser.unique_id){
                question.upvotes += 1;
               
                question.save(function(err, question){
                    if(err)
                        console.log(err);
                    else
                        console.log('Success');
                });
                console.log(question);
            }else{
                res.json({error:' You cannot upvote your own question'});
            }

        });
     
    });
});
}

});


router.post('/remove/:id', function (req, res, next) {

    if (req.session.userId) {
        Question.findOne({ id: req.params.id }, function (err, question) {
            if (!err) {
                User.findById(question.user, (err, user)=>{
                    if (user.unique_id === req.session.userId){
                        question.remove();
                    }else{
                        res.json({error:'You do not own this question'});
                    }
                });
               
        }
        });
    }
});

module.exports = router;