var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Question = require('../models/question');
var Notification = require('../models/notification');
var Answer = require('../models/answer')
var Filter = require('bad-words');
var filter = new Filter;

router.get('/newanswers/:id/:time', (req, res) =>{

    var date = new Date(time*1000);


User.findOne({id:req.session.userId}, (err,user)=>{
    Question.findOne({id:req.params.id}, (err, question)=>{
        Answers.findOne({id:{$in: question.answers}, date :{$gt: date},user:{$ne: user._id}}, (err,answer)=>{
            if(answer){
                res.json({answered:true});
            } 
        });
    });
});
});

router.get('/ask', function (req, res, next){
    if(req.session.userId){
        res.render('question');
    }else{
        res.redirect('/user/login');
    }
});

router.get('/:id', function (req, res, next) {
    Question.findOne({ id: req.params.id }, function (error, question) {
        if(question){
            Answer.find({_id : {$in : question.answers}}, (err, answers)=>{
                res.render('q.ejs',{
                    question: question.question,
                    answered: question.answered,
                    id : question.id,
                    tags : question.tag,
                    answers : answers,
                    upvotes : question.upvotes
                });
            });
       
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

    if (userId) {
        const question = req.body.question;
        const tags = req.body.tags;
        if(filter.isProfane(question)){
            res.status(422);
            res.json({error:'Your question contains bad words'});
            return;
        }else{

        console.log('Profane:', filter.isProfane(question));

        Question.findOne({}, (err, data) => {
            var id =1;
            if(data){
                id = data.id;
            }
          
            User.findOne({unique_id:userId}, function (err, user) {

                const questionModel = Question({
                    id: id+1,
                    question,
                    user,
                    answers: [],
                    tags : tags.split(','),
                    upvotes: 0
                });

                questionModel.save().then((q) => {
                    //TODO
                    console.log(q);
                    res.json({success:'success'});

                }).catch((err) => {
                    res.status(422);
                    res.json({error:'Error occured'});
                    console.log('err'+ err);
                });
            });

        }).sort({_id: -1}).limit(1);;
    }
    } else {
        res.status(422);
        res.json({ error: 'No permission' });
    }
    

});

router.post('/answer/:id', function (req, res) {
    var userId = req.session.userId;
    const answer = req.body.answer;
    if ( userId) {
        if(filter.isProfane(answer)){
            res.status(422);
            res.json({error:'Your answer contains bad words'});
     
        }else{
        
        // userId = 2;
        User.findOne({ unique_id: userId }, function (err, user) {

            Question.findOne({ id: req.params.id }, function (err, question) {
                if (!err) {
                  
                    User.findById(question.user, (err, questionUser)=>{
                        if (user.unique_id != questionUser.unique_id) {
                            const ans = Answer({answer, user, date:Date.now()});
                            ans.save().then((answer)=>{
                                question.answers.push(answer);
                                question.save(function(err, question){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
               
                                        res.json({success:'success'})
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
    }
    } else {
        res.json({ message: 'No permission' });
    }
});


router.post('/upvote/:id', function (req, res) {

    const userId = req.session.userId;
    
    if (userId) {
        
        User.findOne({unique_id:userId}, (err, user)=> {
     
            Question.findOne(
                { id: req.params.id , _id: {$nin:user.voted}}
                , function (err, question) {
                    
   
        User.findById(question.user, (err, questionUser)=> {
            if (question && user.unique_id !== questionUser.unique_id){
                
                if(user.upvoted.includes(question._id)){
                    question.upvotes -= 1;
                    let index = user.upvoted.indexOf(question._id);
                    user.upvoted.splice(index,1);
                    
                }else if (user.downvoted.includes(question._id)){
                    question.upvotes += 2;
                    user.upvoted.push(question);
                    let index = user.downvoted.indexOf(question._id);
                    user.downvoted.splice(index,1);
                }else{
                    question.upvotes += 1;
                    user.upvoted.push(question);
                }
               
               
                question.save(function(err, question){
                    if(err){

                        console.log(err);
                    }
                    else{
                        user.save();
                        res.json({success:'Success', votes: question.upvotes});
                    }
                });
                console.log(question);
            }else{
                res.status(404);
                res.json({error:' You cannot vote your own question'});
            }

        });
     
    });
});
}
});



router.post('/downvote/:id', function (req, res) {

    const userId = req.session.userId;
    
    if (userId) {
        
        User.findOne({unique_id:userId}, (err, user)=> {
     
            Question.findOne(
                { id: req.params.id , _id: {$nin:user.voted}}
                , function (err, question) {
                    
   
        User.findById(question.user, (err, questionUser)=> {
            if (question && user.unique_id !== questionUser.unique_id){
                
                if(user.upvoted.includes(question._id)){
                    question.upvotes -= 2;
                    let index = user.upvoted.indexOf(question._id);
                    user.downvoted.push(question);
                    user.upvoted.splice(index,1);
                }else if (user.downvoted.includes(question._id)){
                    question.upvotes += 1;
                    let index = user.downvoted.indexOf(question._id);
                    user.downvoted.splice(index,1);
                }else{
                    question.upvotes -= 1;
                    user.downvoted.push(question);
                }
               
               
                question.save(function(err, question){
                    if(err){

                        console.log(err);
                    }
                    else{
                      
                        user.save();
                        res.json({success:'Success', votes: question.upvotes});
                    }
                });
                console.log(question);
            }else{
                res.status(404);
                res.json({error:' You cannot vote your own question'});
            }

        });
     
    });
});
}
});


router.post('/remove/', function (req, res, next) {

    if (req.session.userId) {
        Question.findOne({ id: req.body.id }, function (err, question) {
            if (!err) {
                User.findById(question.user, (err, user)=>{
                    if (user.unique_id === req.session.userId){
                        question.remove().then(()=>{

                            res.json({success:'success', id:id});
                        }).catch((err)=>{

                        });
                    }else{
                        res.json({error:'You do not own this question'});
                    }
                });
               
        }
        });
    }
});

module.exports = router;