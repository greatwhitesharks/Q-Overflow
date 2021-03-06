var express = require('express');
var ejs = require('ejs');
var path = require('path');

var app = express();


var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var server = require('http').Server(app);
var io = require('socket.io')(server);



mongoose.connect('mongodb://localhost/db2', { useMongoClient: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));
var User = require('./models/user');
var Notification =  require('./models/notification');
var Question = require('./models/question');
var Answer = require('./models/answer');

app.get('/answered/:time/:id', function(req,res){
  Question.findOne({id: req.params.id}, (err, question) =>{
    Answer.find({_id :{$in : question.answers}, time : {$gt:req.params.time}}, function(err, answers){
      res.redirect('/questions/'+req.params.id);
    });
  });
});

app.get('/efg', function(req,res){
  res.render('e');
});

app.get('/notifications', function(req,res){
  const userId = req.session.userId;

  User.findOne({unique_id:userId}, (err, user) =>{
    Notification.find({
      '_id' : {
        $in : user.notifcations
      }
    }, function (err, notifcations){

      for(not in notifcations){
        notifcation.read = true;
        notifcation.save();
      }
      res.json(notifcations);
    });
  });

});

app.get('/test', function(req,res){
res.render('e');
});

var index = require('./routes/user');
var questionRoutes = require('./routes/question');
app.use('/users', index);
app.use('/questions', questionRoutes);


// // error handler
// // define as the last app.use callback
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.send(err.message);
// });

//Whenever someone connects this gets executed


// listen on port 3000
app.listen(3005, function () {
  console.log('Express app listening on port 3000');
});




// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('File Not Found');
//   err.status = 404;
//   next(err);
// });
